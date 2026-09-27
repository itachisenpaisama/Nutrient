import { UserProfile, DailyLogSummary, NutrientPlan, PlanRecommendation } from '../types';
import { DEMO_PROFILE, generate30DaysDemoLogs } from '../data/demoDataset';
import { calculateNutrientPlan } from './calculationEngine';
import { perform30DayToxicologyAudit } from './toxicologyEngine';
import { computeDiagnosticsAndInsights } from './analyticsEngine';

const STORAGE_KEYS = {
  PROFILE: 'nutri_vault_profile',
  LOGS: 'nutri_vault_logs',
  PLAN: 'nutri_vault_plan',
  RECOMMENDATIONS: 'nutri_vault_recommendations',
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
  static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed reading profile from storage', e);
    }
    return DEMO_PROFILE;
  }

  static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile, null, 2));
      // Auto-recalculate and save plan
      const plan = calculateNutrientPlan(profile);
      this.savePlan(plan);
    } catch (e) {
      console.error('Failed saving profile', e);
    }
  }

  static getPlan(profile?: UserProfile): NutrientPlan {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAN);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed reading plan from storage', e);
    }
    const prof = profile || this.getProfile();
    return calculateNutrientPlan(prof);
  }

  static savePlan(plan: NutrientPlan): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan, null, 2));
    } catch (e) {
      console.error('Failed saving plan', e);
    }
  }

  static getLogs(): DailyLogSummary[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed reading logs from storage', e);
    }
    // Initialize with demo logs
    const profile = this.getProfile();
    const demo = generate30DaysDemoLogs(profile);
    this.saveLogs(demo);
    return demo;
  }

  static saveLogs(logs: DailyLogSummary[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs, null, 2));
    } catch (e) {
      console.error('Failed saving logs', e);
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
    this.saveProfile(DEMO_PROFILE);
    const logs = generate30DaysDemoLogs(DEMO_PROFILE);
    this.saveLogs(logs);
  }

  /**
   * Generates a virtual folder tree mirroring the requested structured directory layout
   */
  static getStructuredFileVault(): VirtualFileNode {
    const profile = this.getProfile();
    const plan = this.getPlan(profile);
    const logs = this.getLogs();
    const toxicology = perform30DayToxicologyAudit(logs);
    const { correlations, recommendations } = computeDiagnosticsAndInsights(logs, profile);

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

    const profileJson = JSON.stringify(profile, null, 2);
    const planJson = JSON.stringify(plan, null, 2);
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
          children: [
            {
              name: 'user_profile.json',
              path: 'nutri_vault/profiles/user_profile.json',
              type: 'file',
              sizeBytes: profileJson.length,
              lastModified: profile.updatedAt,
              content: profileJson
            }
          ]
        },
        {
          name: 'plans',
          path: 'nutri_vault/plans',
          type: 'folder',
          children: [
            {
              name: 'current_nutrient_plan.json',
              path: 'nutri_vault/plans/current_nutrient_plan.json',
              type: 'file',
              sizeBytes: planJson.length,
              lastModified: new Date().toISOString(),
              content: planJson
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
      exportVersion: '1.0',
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
      // Validate structure
      if (data.vault && Array.isArray(data.vault.children)) {
        for (const child of data.vault.children) {
          if (child.name === 'profiles' && child.children?.[0]?.content) {
            localStorage.setItem(STORAGE_KEYS.PROFILE, child.children[0].content);
          }
          if (child.name === 'plans' && child.children?.[0]?.content) {
            localStorage.setItem(STORAGE_KEYS.PLAN, child.children[0].content);
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
