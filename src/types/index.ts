// Comprehensive Type Definitions for Nutrient Tracker & Profiling Engine

export type Gender = 'male' | 'female' | 'divergent';

export type ActivityLevel = 1.2 | 1.375 | 1.55 | 1.725 | 1.9;

export type PhysicalGoal = 'FAT_LOSS' | 'MAINTENANCE' | 'HYPERTROPHY';

export type NeuroModifier = 'NONE' | 'ADHD' | 'ASD' | 'AUDHD';

export type MedicationType =
  | 'METHYLPHENIDATE' // Medikinet adult, Ritalin, Concerta, Equasym
  | 'LISDEXAMFETAMINE' // Elvanse, Vyvanse, Attentin
  | 'ATOMOXETINE' // Strattera
  | 'GUANFACINE' // Intuniv
  | 'BUPROPION' // Wellbutrin, Elontril (NDRI)
  | 'SSRI' // Sertralin, Escitalopram, Citalopram, Fluoxetin, Paroxetin
  | 'SNRI' // Venlafaxin, Duloxetin
  | 'LAMOTRIGINE' // Lamictal
  | 'MELATONIN' // Circadin, Melatonin
  | 'IRON_SUPPLEMENT' // Ferro Sanol etc.
  | 'MAGNESIUM_SUPPLEMENT' // Magnesium Glycinat, Malat
  | 'THYROID_HORMONE' // L-Thyroxin
  | 'OTHER'
  | 'NONE';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  bodyFatPct?: number; // Optional KFA
  leanBodyMassKg?: number; // Calculated LBM
  activityLevel: ActivityLevel;
  goal: PhysicalGoal;
  neuroModifier: NeuroModifier;
  medication: MedicationType; // Primary or legacy single medication
  medications: MedicationType[]; // Multiple medications support
  customMedications?: string[]; // Optional user-defined medication names
  trackGlutenCasein: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NutrientPlan {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  proteinKcal: number;
  fatGrams: number;
  fatKcal: number;
  carbGrams: number;
  carbKcal: number;
  carbWarning?: string; // e.g. T3 & dopamine warning if carbs < 50g
  fiberGrams: number;
  
  // Micronutrient Targets tailored to profile
  omega3TotalMg: number;
  omega3EpaMg: number;
  omega3DhaMg: number;
  ironMg: number;
  magnesiumMg: number;
  zincMg: number;
  copperMg: number;
  vitaminB6Mg: number;
  vitaminB9Ugf: number;
  vitaminB12Ug: number;
  vitaminD3Iu: number;
  vitaminK2Ug: number;
  vitaminCMg: number;
  cholineMg: number;
  seleniumUg: number;
  
  // Rule-based timing & lifestyle reminders
  specialGuidelines: string[];
}

export type NutrientCategory =
  | 'macronutrient'
  | 'neuro-vitamin'
  | 'mineral'
  | 'trace-element'
  | 'amino-acid'
  | 'electrolyte';

export interface NutrientLexiconEntry {
  id: string;
  titleDe: string;
  titleEn: string;
  category: NutrientCategory;
  tagsDe: string[];
  tagsEn: string[];
  laymanDe: string;
  laymanEn: string;
  whyImportantDe: string[];
  whyImportantEn: string[];
  intakeRecommendations: {
    standard: string;
    adhd?: string;
    asd?: string;
    upperLimit?: string;
  };
  sourcesDe: {
    animal: string[];
    plant: string[];
  };
  sourcesEn: {
    animal: string[];
    plant: string[];
  };
  tipsDe: string[];
  tipsEn: string[];
  deepDiveDe: {
    biochemistry: string;
    neuroscience: string;
    receptorsTransporters: string;
  };
  deepDiveEn: {
    biochemistry: string;
    neuroscience: string;
    receptorsTransporters: string;
  };
  scientificReferences: string[];
}

export interface FoodItem {
  id: string;
  nameDe: string;
  nameEn: string;
  servingSizeGrams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  omega3Mg: number;
  omega3EpaMg?: number;
  omega3DhaMg?: number;
  vitaminB6Mg: number;
  vitaminB9Ug: number;
  vitaminB12Ug: number;
  vitaminD3Iu: number;
  vitaminK2Ug: number;
  vitaminCMg: number;
  magnesiumMg: number;
  ironMg: number;
  zincMg: number;
  copperMg: number;
  cholineMg?: number;
  seleniumUg?: number;
  isGlutenFree?: boolean;
  isCaseinFree?: boolean;
  isCustom?: boolean;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'supplement' | 'medication';

export interface LogEntry {
  id: string;
  timestamp: string; // ISO string e.g. 2026-09-24T08:00:00
  mealType: MealType;
  title: string;
  foodItemId?: string;
  servings: number;
  
  // Nutrients provided in this entry
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  omega3Mg: number;
  omega3EpaMg: number;
  omega3DhaMg: number;
  vitaminB6Mg: number;
  vitaminB9Ug: number;
  vitaminB12Ug: number;
  vitaminD3Iu: number;
  vitaminK2Ug: number;
  vitaminCMg: number;
  magnesiumMg: number;
  ironMg: number;
  zincMg: number;
  copperMg: number;
  
  // Medication specifics
  medicationName?: string;
  dosage?: string;
  
  // Validation status
  timingVerified?: boolean;
  warningNote?: string;
}

export interface DailySymptomLog {
  date: string; // YYYY-MM-DD
  focusScore: number; // 1 - 10
  energyScore: number; // 1 - 10
  fatigueScore: number; // 1 - 10
  gutComfortScore: number; // 1 - 10
  sleepQualityScore: number; // 1 - 10
  reboundSeverityScore?: number; // 1 - 10 (for stimulant users)
  notes?: string;
}

export interface DailyLogSummary {
  date: string; // YYYY-MM-DD
  entries: LogEntry[];
  symptomLog?: DailySymptomLog;
  totals: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG: number;
    omega3EpaMg: number;
    omega3DhaMg: number;
    vitaminB6Mg: number;
    vitaminB9Ug: number;
    vitaminB12Ug: number;
    vitaminD3Iu: number;
    vitaminK2Ug: number;
    vitaminCMg: number;
    magnesiumMg: number;
    ironMg: number;
    zincMg: number;
    copperMg: number;
  };
  scorePct: number;
  cofactorsMet: {
    iron: boolean;
    magnesium: boolean;
    p5pB6: boolean;
    zinc: boolean;
    omega3Epa: boolean;
    vitaminB12: boolean;
    fiber: boolean;
  };
  alerts: InteractionAlert[];
}

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL_LOCK';

export interface InteractionAlert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  substanceA: string;
  substanceB: string;
  titleDe: string;
  titleEn: string;
  messageDe: string;
  messageEn: string;
  actionRecommendationDe: string;
  actionRecommendationEn: string;
  isDismissed?: boolean;
}

export interface PlanRecommendation {
  id: string;
  detectedTrendDe: string;
  detectedTrendEn: string;
  correlationStats?: string;
  recommendationDe: string;
  recommendationEn: string;
  proposedChanges: {
    targetKey: string;
    targetLabelDe: string;
    targetLabelEn: string;
    oldValue: number | string;
    newValue: number | string;
    unit: string;
  }[];
  applied: boolean;
}
