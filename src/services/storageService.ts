import {
  UserProfile,
  DailyLogSummary,
  NutrientPlan,
  PlanRecommendation,
  FoodItem,
  MealPreset
} from '../types';
import {
  DEMO_PROFILE,
  DEFAULT_PROFILES,
  DEFAULT_MEAL_PRESETS,
  generate30DaysDemoLogs
} from '../data/demoDataset';
import { calculateNutrientPlan } from './calculationEngine';
import { perform30DayToxicologyAudit } from './toxicologyEngine';
import { computeDiagnosticsAndInsights } from './analyticsEngine';

const STORAGE_KEYS = {
  PROFILES: 'nutri_vault_profiles_list',
  ACTIVE_PROFILE_ID: 'nutri_vault_active_profile_id',
  PROFILE: 'nutri_vault_profile', // fallback / legacy single profile
  LOGS_PREFIX: 'nutri_vault_logs_',
  LOGS: 'nutri_vault_logs', // fallback / legacy single logs
  PLAN_PREFIX: 'nutri_vault_plan_',
  PLAN: 'nutri_vault_plan',
  RECOMMENDATIONS: 'nutri_vault_recommendations',
  CUSTOM_FOODS: 'nutri_vault_custom_foods',
  MEAL_PRESETS: 'nutri_vault_meal_presets',
  THEME: 'nutri_vault_theme',
  LANG: 'nutri_vault_lang'
};

export interface VirtualFileNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  sizeBytes?: number;
  lastModified?: string;
  content?: string;
  children?: VirtualFileNode[];
}

export class StorageService {
  // ==========================================
  // MULTI-PROFILE MANAGEMENT
  // ==========================================

  /**
   * Retrieves all saved user profiles, handling migration from legacy single profile.
   */
  static getProfiles(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
      if (data) {
        const parsed: UserProfile[] = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => this.normalizeProfile(p));
        }
      }

      // Check legacy single profile key
      const legacyData = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (legacyData) {
        const legacyParsed: UserProfile = this.normalizeProfile(JSON.parse(legacyData));
        const initial = [legacyParsed];
        // Add others from default if not duplicate
        DEFAULT_PROFILES.forEach((def) => {
          if (!initial.some((p) => p.id === def.id || p.name === def.name)) {
            initial.push(def);
          }
        });
        this.saveProfiles(initial);
        return initial;
      }
    } catch (e) {
      console.error('Failed reading profiles from storage', e);
    }

    // Default initialization
    this.saveProfiles(DEFAULT_PROFILES);
    return DEFAULT_PROFILES;
  }

  /**
   * Internal helper to persist profiles array
   */
  static saveProfiles(profiles: UserProfile[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles, null, 2));
    } catch (e) {
      console.error('Failed saving profiles list', e);
    }
  }

  /**
   * Gets ID of the currently active profile
   */
  static getActiveProfileId(): string {
    try {
      const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
      const profiles = this.getProfiles();
      if (activeId && profiles.some((p) => p.id === activeId)) {
        return activeId;
      }
      if (profiles.length > 0) {
        return profiles[0].id;
      }
    } catch (e) {
      console.error('Failed reading active profile ID', e);
    }
    return DEMO_PROFILE.id;
  }

  /**
   * Sets the active profile ID and keeps legacy key in sync
   */
  static setActiveProfileId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
      const profile = this.getProfile(id);
      if (profile) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile, null, 2));
      }
    } catch (e) {
      console.error('Failed setting active profile ID', e);
    }
  }

  /**
   * Returns the currently active profile or fallback
   */
  static getProfile(id?: string): UserProfile {
    const profiles = this.getProfiles();
    const targetId = id || this.getActiveProfileId();
    const found = profiles.find((p) => p.id === targetId);
    if (found) return found;
    return profiles[0] || DEMO_PROFILE;
  }

  /**
   * Saves or updates a profile in the profiles list
   */
  static saveProfile(profile: UserProfile): void {
    try {
      const normalized = this.normalizeProfile(profile);
      const profiles = this.getProfiles();
      const existingIdx = profiles.findIndex((p) => p.id === normalized.id);

      let updatedList: UserProfile[];
      if (existingIdx >= 0) {
        updatedList = [...profiles];
        updatedList[existingIdx] = normalized;
      } else {
        updatedList = [...profiles, normalized];
      }

      this.saveProfiles(updatedList);

      // Recalculate plan and save for this profile
      const plan = calculateNutrientPlan(normalized);
      this.savePlan(plan, normalized.id);

      // If active profile updated, sync legacy key
      if (normalized.id === this.getActiveProfileId()) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(normalized, null, 2));
        this.savePlan(plan);
      }
    } catch (e) {
      console.error('Failed saving profile', e);
    }
  }

  /**
   * Creates a new profile, optionally generating initial tailored logs, and sets it active
   */
  static createProfile(
    newProfile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
    withDemoLogs: boolean = true
  ): UserProfile {
    const id = newProfile.id || `profile-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const created: UserProfile = {
      ...newProfile,
      id,
      medications: newProfile.medications || (newProfile.medication !== 'NONE' ? [newProfile.medication] : []),
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.saveProfile(created);
    this.setActiveProfileId(id);

    if (withDemoLogs) {
      const demoLogs = generate30DaysDemoLogs(created);
      this.saveLogs(demoLogs, id);
    } else {
      this.saveLogs([], id);
    }

    return created;
  }

  /**
   * Duplicates an existing profile with a new ID
   */
  static duplicateProfile(sourceId: string): UserProfile | null {
    const source = this.getProfile(sourceId);
    if (!source) return null;

    const newId = `profile-${Date.now()}`;
    const copy: UserProfile = {
      ...source,
      id: newId,
      name: `${source.name} (Kopie)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveProfile(copy);

    // Copy logs as well
    const logs = this.getLogs(sourceId);
    this.saveLogs(logs, newId);

    return copy;
  }

  /**
   * Deletes a profile. Returns false if attempting to delete the last remaining profile.
   */
  static deleteProfile(profileId: string): boolean {
    const profiles = this.getProfiles();
    if (profiles.length <= 1) return false;

    const remaining = profiles.filter((p) => p.id !== profileId);
    this.saveProfiles(remaining);

    // Clean up profile storage keys
    localStorage.removeItem(`${STORAGE_KEYS.LOGS_PREFIX}${profileId}`);
    localStorage.removeItem(`${STORAGE_KEYS.PLAN_PREFIX}${profileId}`);

    // If active profile was deleted, switch to the first remaining profile
    if (this.getActiveProfileId() === profileId) {
      this.setActiveProfileId(remaining[0].id);
    }

    return true;
  }

  private static normalizeProfile(profile: any): UserProfile {
    const primaryMed =
      profile.medications && profile.medications.length > 0
        ? profile.medications[0]
        : profile.medication || 'NONE';

    const meds =
      profile.medications && Array.isArray(profile.medications)
        ? profile.medications
        : primaryMed !== 'NONE'
        ? [primaryMed]
        : [];

    return {
      ...profile,
      medication: primaryMed,
      medications: meds,
      avatarColor: profile.avatarColor || '#06b6d4',
      waterGoalMl: profile.waterGoalMl || 3000,
      createdAt: profile.createdAt || new Date().toISOString(),
      updatedAt: profile.updatedAt || new Date().toISOString()
    };
  }

  // ==========================================
  // NUTRIENT PLANS
  // ==========================================

  static getPlan(profile?: UserProfile): NutrientPlan {
    const prof = profile || this.getProfile();
    try {
      const data =
        localStorage.getItem(`${STORAGE_KEYS.PLAN_PREFIX}${prof.id}`) ||
        (prof.id === this.getActiveProfileId() ? localStorage.getItem(STORAGE_KEYS.PLAN) : null);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed reading plan from storage', e);
    }
    const computed = calculateNutrientPlan(prof);
    this.savePlan(computed, prof.id);
    return computed;
  }

  static savePlan(plan: NutrientPlan, profileId?: string): void {
    const pid = profileId || this.getActiveProfileId();
    try {
      localStorage.setItem(`${STORAGE_KEYS.PLAN_PREFIX}${pid}`, JSON.stringify(plan, null, 2));
      if (pid === this.getActiveProfileId()) {
        localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan, null, 2));
      }
    } catch (e) {
      console.error('Failed saving plan', e);
    }
  }

  // ==========================================
  // DAILY LOGS & ENTRIES
  // ==========================================

  static getLogs(profileId?: string): DailyLogSummary[] {
    const pid = profileId || this.getActiveProfileId();
    try {
      const data =
        localStorage.getItem(`${STORAGE_KEYS.LOGS_PREFIX}${pid}`) ||
        (pid === this.getActiveProfileId() ? localStorage.getItem(STORAGE_KEYS.LOGS) : null);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed reading logs from storage', e);
    }

    // Initialize with demo logs for this profile
    const profile = this.getProfile(pid);
    const demo = generate30DaysDemoLogs(profile);
    this.saveLogs(demo, pid);
    return demo;
  }

  static saveLogs(logs: DailyLogSummary[], profileId?: string): void {
    const pid = profileId || this.getActiveProfileId();
    try {
      localStorage.setItem(`${STORAGE_KEYS.LOGS_PREFIX}${pid}`, JSON.stringify(logs, null, 2));
      if (pid === this.getActiveProfileId()) {
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs, null, 2));
      }
    } catch (e) {
      console.error('Failed saving logs', e);
    }
  }

  // ==========================================
  // HYDRATION (WATER TRACKING)
  // ==========================================

  static getWaterIntake(date: string, profileId?: string): number {
    const logs = this.getLogs(profileId);
    const day = logs.find((l) => l.date === date);
    return day?.waterMl ?? 0;
  }

  static setWaterIntake(date: string, amountMl: number, profileId?: string): void {
    const pid = profileId || this.getActiveProfileId();
    const logs = this.getLogs(pid);
    const profile = this.getProfile(pid);
    const existingIndex = logs.findIndex((l) => l.date === date);

    if (existingIndex >= 0) {
      const updated = [...logs];
      updated[existingIndex] = {
        ...updated[existingIndex],
        waterMl: Math.max(0, amountMl),
        waterGoalMl: updated[existingIndex].waterGoalMl || profile.waterGoalMl || 3000
      };
      this.saveLogs(updated, pid);
    } else {
      const newDay: DailyLogSummary = {
        date,
        entries: [],
        waterMl: Math.max(0, amountMl),
        waterGoalMl: profile.waterGoalMl || 3000,
        totals: {
          calories: 0,
          proteinG: 0,
          carbsG: 0,
          fatG: 0,
          fiberG: 0,
          omega3EpaMg: 0,
          omega3DhaMg: 0,
          vitaminB6Mg: 0,
          vitaminB9Ug: 0,
          vitaminB12Ug: 0,
          vitaminD3Iu: 0,
          vitaminK2Ug: 0,
          vitaminCMg: 0,
          magnesiumMg: 0,
          ironMg: 0,
          zincMg: 0,
          copperMg: 0
        },
        scorePct: 0,
        cofactorsMet: {
          iron: false,
          magnesium: false,
          p5pB6: false,
          zinc: false,
          omega3Epa: false,
          vitaminB12: false,
          fiber: false
        },
        alerts: []
      };
      this.saveLogs([...logs, newDay], pid);
    }
  }

  static addWaterIntake(date: string, deltaMl: number, profileId?: string): number {
    const current = this.getWaterIntake(date, profileId);
    const next = Math.max(0, current + deltaMl);
    this.setWaterIntake(date, next, profileId);
    return next;
  }

  // ==========================================
  // MEAL PRESETS / FAVORITES
  // ==========================================

  static getMealPresets(): MealPreset[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEAL_PRESETS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed reading meal presets', e);
    }
    return DEFAULT_MEAL_PRESETS;
  }

  static saveMealPreset(preset: MealPreset): void {
    try {
      const list = this.getMealPresets();
      const existingIdx = list.findIndex((p) => p.id === preset.id);
      if (existingIdx >= 0) {
        list[existingIdx] = preset;
      } else {
        list.push(preset);
      }
      localStorage.setItem(STORAGE_KEYS.MEAL_PRESETS, JSON.stringify(list, null, 2));
    } catch (e) {
      console.error('Failed saving meal preset', e);
    }
  }

  static deleteMealPreset(id: string): void {
    try {
      const list = this.getMealPresets().filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.MEAL_PRESETS, JSON.stringify(list, null, 2));
    } catch (e) {
      console.error('Failed deleting meal preset', e);
    }
  }

  // ==========================================
  // CUSTOM FOODS & RECOMMENDATIONS
  // ==========================================

  static getCustomFoods(): FoodItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_FOODS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed reading custom foods', e);
    }
    return [];
  }

  static saveCustomFood(food: FoodItem): void {
    try {
      const list = this.getCustomFoods();
      const existingIdx = list.findIndex((f) => f.id === food.id);
      const taggedFood: FoodItem = { ...food, isCustom: true };
      if (existingIdx >= 0) {
        list[existingIdx] = taggedFood;
      } else {
        list.push(taggedFood);
      }
      localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(list, null, 2));
    } catch (e) {
      console.error('Failed saving custom food', e);
    }
  }

  static deleteCustomFood(id: string): void {
    try {
      const list = this.getCustomFoods().filter((f) => f.id !== id);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(list, null, 2));
    } catch (e) {
      console.error('Failed deleting custom food', e);
    }
  }

  static getRecommendations(): PlanRecommendation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed reading recommendations', e);
    }
    return [];
  }

  static saveRecommendations(recs: PlanRecommendation[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recs, null, 2));
    } catch (e) {
      console.error('Failed saving recommendations', e);
    }
  }

  static resetToDemo(): void {
    localStorage.clear();
    this.saveProfiles(DEFAULT_PROFILES);
    this.setActiveProfileId(DEMO_PROFILE.id);
    DEFAULT_PROFILES.forEach((p) => {
      const logs = generate30DaysDemoLogs(p);
      this.saveLogs(logs, p.id);
      const plan = calculateNutrientPlan(p);
      this.savePlan(plan, p.id);
    });
  }

  // ==========================================
  // STRUCTURED VIRTUAL FILE VAULT
  // ==========================================

  static getStructuredFileVault(): VirtualFileNode {
    const profiles = this.getProfiles();
    const activeProfile = this.getProfile();
    const activePlan = this.getPlan(activeProfile);
    const logs = this.getLogs(activeProfile.id);
    const customFoods = this.getCustomFoods();
    const mealPresets = this.getMealPresets();
    const toxicology = perform30DayToxicologyAudit(logs);
    const { correlations, recommendations } = computeDiagnosticsAndInsights(logs, activeProfile);

    // Profile Files
    const profileNodes: VirtualFileNode[] = profiles.map((p) => {
      const content = JSON.stringify(p, null, 2);
      return {
        name: `${p.id}.json`,
        path: `nutri_vault/profiles/${p.id}.json`,
        type: 'file',
        sizeBytes: content.length,
        lastModified: p.updatedAt,
        content
      };
    });

    // Plans Files
    const planNodes: VirtualFileNode[] = profiles.map((p) => {
      const plan = this.getPlan(p);
      const content = JSON.stringify(plan, null, 2);
      return {
        name: `plan_${p.id}.json`,
        path: `nutri_vault/plans/plan_${p.id}.json`,
        type: 'file',
        sizeBytes: content.length,
        lastModified: new Date().toISOString(),
        content
      };
    });

    // Group logs by Year -> Month -> file
    const logNodesByYear: { [year: string]: { [month: string]: VirtualFileNode[] } } = {};

    for (const log of logs) {
      const [year, month] = log.date.split('-');
      if (!logNodesByYear[year]) logNodesByYear[year] = {};
      if (!logNodesByYear[year][month]) logNodesByYear[year][month] = [];

      const contentStr = JSON.stringify(log, null, 2);
      logNodesByYear[year][month].push({
        name: `log_${log.date}.json`,
        path: `nutri_vault/logs/${year}/${month}/log_${log.date}.json`,
        type: 'file',
        sizeBytes: contentStr.length,
        lastModified: log.date,
        content: contentStr
      });
    }

    const yearFolderNodes: VirtualFileNode[] = Object.keys(logNodesByYear).map((year) => {
      const monthFolderNodes: VirtualFileNode[] = Object.keys(logNodesByYear[year]).map((month) => ({
        name: month,
        path: `nutri_vault/logs/${year}/${month}`,
        type: 'folder',
        children: logNodesByYear[year][month]
      }));

      return {
        name: year,
        path: `nutri_vault/logs/${year}`,
        type: 'folder',
        children: monthFolderNodes
      };
    });

    const customFoodsJson = JSON.stringify(customFoods, null, 2);
    const mealPresetsJson = JSON.stringify(mealPresets, null, 2);
    const toxiJson = JSON.stringify(toxicology, null, 2);
    const analyticsJson = JSON.stringify({ correlations, recommendations }, null, 2);

    const root: VirtualFileNode = {
      name: 'nutri_vault',
      path: 'nutri_vault',
      type: 'folder',
      children: [
        {
          name: 'profiles',
          path: 'nutri_vault/profiles',
          type: 'folder',
          children: profileNodes
        },
        {
          name: 'plans',
          path: 'nutri_vault/plans',
          type: 'folder',
          children: planNodes
        },
        {
          name: 'foods',
          path: 'nutri_vault/foods',
          type: 'folder',
          children: [
            {
              name: 'custom_foods.json',
              path: 'nutri_vault/foods/custom_foods.json',
              type: 'file',
              sizeBytes: customFoodsJson.length,
              lastModified: new Date().toISOString(),
              content: customFoodsJson
            },
            {
              name: 'meal_presets.json',
              path: 'nutri_vault/foods/meal_presets.json',
              type: 'file',
              sizeBytes: mealPresetsJson.length,
              lastModified: new Date().toISOString(),
              content: mealPresetsJson
            }
          ]
        },
        {
          name: 'logs',
          path: 'nutri_vault/logs',
          type: 'folder',
          children: yearFolderNodes
        },
        {
          name: 'toxicology',
          path: 'nutri_vault/toxicology',
          type: 'folder',
          children: [
            {
              name: '30_day_audit.json',
              path: 'nutri_vault/toxicology/30_day_audit.json',
              type: 'file',
              sizeBytes: toxiJson.length,
              lastModified: toxicology.generatedAt,
              content: toxiJson
            }
          ]
        },
        {
          name: 'analytics',
          path: 'nutri_vault/analytics',
          type: 'folder',
          children: [
            {
              name: 'pearson_correlations.json',
              path: 'nutri_vault/analytics/pearson_correlations.json',
              type: 'file',
              sizeBytes: analyticsJson.length,
              lastModified: new Date().toISOString(),
              content: analyticsJson
            }
          ]
        }
      ]
    };

    return root;
  }

  static downloadJsonFile(fileName: string, content: string): void {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static exportFullVaultAsJson(): void {
    const vault = this.getStructuredFileVault();
    const exportBundle = {
      exportVersion: '2.0',
      exportedAt: new Date().toISOString(),
      vault
    };
    this.downloadJsonFile(
      `nutri_vault_backup_${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(exportBundle, null, 2)
    );
  }

  static importVaultFromJson(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.vault && Array.isArray(data.vault.children)) {
        for (const child of data.vault.children) {
          if (child.name === 'profiles' && Array.isArray(child.children)) {
            const importedProfiles: UserProfile[] = child.children
              .map((c: any) => {
                try {
                  return JSON.parse(c.content);
                } catch {
                  return null;
                }
              })
              .filter(Boolean);
            if (importedProfiles.length > 0) {
              this.saveProfiles(importedProfiles);
            }
          }
          if (child.name === 'foods' && Array.isArray(child.children)) {
            for (const foodChild of child.children) {
              if (foodChild.name === 'custom_foods.json' && foodChild.content) {
                localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, foodChild.content);
              }
              if (foodChild.name === 'meal_presets.json' && foodChild.content) {
                localStorage.setItem(STORAGE_KEYS.MEAL_PRESETS, foodChild.content);
              }
            }
          }
        }
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
}
