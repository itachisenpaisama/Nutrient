import { UserProfile, NutrientPlan } from '../types';

export function calculateNutrientPlan(profile: UserProfile): NutrientPlan {
  const {
    gender,
    age,
    heightCm,
    weightKg,
    bodyFatPct,
    activityLevel,
    goal,
    neuroModifier,
    medication,
    trackGlutenCasein
  } = profile;

  // 1. Calculate Lean Body Mass (LBM) if bodyFatPct is provided
  let lbm: number | undefined;
  if (bodyFatPct !== undefined && bodyFatPct > 0 && bodyFatPct < 100) {
    lbm = weightKg * (1 - bodyFatPct / 100);
  }

  // 2. Basal Metabolic Rate (BMR)
  // Dynamic formula selection: Katch-McArdle if LBM known, else Mifflin-St Jeor
  let bmr: number;
  if (lbm !== undefined) {
    // Katch-McArdle Formula
    bmr = 370 + 21.6 * lbm;
  } else {
    // Mifflin-St Jeor Formula
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else if (gender === 'female') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    } else {
      // Divergent: average of male & female
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 78;
    }
  }

  // 3. Total Daily Energy Expenditure (TDEE) & Target Calories
  const tdee = bmr * activityLevel;

  let deltaGoal = 0;
  if (goal === 'FAT_LOSS') {
    deltaGoal = -0.20; // -20% standard deficit
  } else if (goal === 'HYPERTROPHY') {
    deltaGoal = 0.075; // +7.5% surplus
  } else {
    deltaGoal = 0.0; // Maintenance
  }

  const targetCalories = Math.round(tdee * (1 + deltaGoal));

  // 4. Cascade Allocation of Macronutrients
  // Step 1: Protein Allocation
  let proteinGrams = 0;
  if (goal === 'FAT_LOSS') {
    proteinGrams = lbm !== undefined ? 2.2 * lbm : 2.0 * weightKg;
  } else if (goal === 'HYPERTROPHY') {
    proteinGrams = 2.0 * weightKg;
  } else {
    proteinGrams = 1.7 * weightKg;
  }
  proteinGrams = Math.round(proteinGrams);
  const proteinKcal = proteinGrams * 4;

  // Step 2: Fat Allocation (Hormone Protection Floor)
  // Minimum: 20% of Target Calories or 1.0 g/kg bodyweight
  const fatMinKcal = targetCalories * 0.20;
  const fatFromWeight = weightKg * 1.0;
  const fatFromMinKcal = fatMinKcal / 9;
  const fatGrams = Math.round(Math.max(fatFromWeight, fatFromMinKcal));
  const fatKcal = fatGrams * 9;

  // Step 3: Carbohydrate Allocation (Thyroid & Neuro Substrate)
  const remainingKcal = targetCalories - (proteinKcal + fatKcal);
  const carbKcal = Math.max(0, remainingKcal);
  const carbGrams = Math.round(carbKcal / 4);

  // Safety check: Carbs < 50g triggers T3 conversion and dopamine synthesis alert
  let carbWarning: string | undefined;
  if (carbGrams < 50) {
    carbWarning = 'Warnung: Kohlenhydrate liegen unter 50g/Tag! Gefahr reduzierter T3-Schilddrüsenkonvertierung und gestörter Tyrosin-Hydroxylase/Dopaminsynthese.';
  }

  // 5. Neurodivergence & Clinical Adjustments
  const isAdhd = neuroModifier === 'ADHD' || neuroModifier === 'AUDHD';
  const isAsd = neuroModifier === 'ASD' || neuroModifier === 'AUDHD';

  // Fiber target
  const fiberGrams = isAsd ? 38 : 30; // 35-40g for ASD microbiome support

  // Omega-3 Targets (EPA / DHA)
  let omega3TotalMg = 1000;
  let omega3EpaMg = 600;
  let omega3DhaMg = 400;

  if (isAdhd) {
    // ADHD: 1.500 - 2.000 mg/day, high EPA (ratio >= 2:1, ideal 3:1)
    omega3TotalMg = 1800;
    omega3EpaMg = 1350;
    omega3DhaMg = 450;
  }

  // Minerals & Trace Elements
  let magnesiumMg = 350;
  let zincMg = gender === 'female' ? 8 : 11;
  const copperMg = 1.2;

  if (isAdhd) {
    // ADHD: +20% for increased catecholamine turnover & sympathetic tone
    magnesiumMg = Math.round(magnesiumMg * 1.25); // ~440 mg
    zincMg = 18; // Elevated target for DAT modulation
  }

  const ironMg = gender === 'female' && age < 52 ? 15 : 10;

  // Neuro-Vitamins
  const vitaminB6Mg = isAdhd ? 8.0 : 1.5; // P5P bioactive form
  const vitaminB9Ugf = 400; // L-5-MTHF
  const vitaminB12Ug = 4.5;
  const vitaminD3Iu = isAdhd ? 3000 : 2000;
  const vitaminK2Ug = 120; // MK-7
  const vitaminCMg = isAdhd ? 350 : 150;
  const cholineMg = isAdhd ? 600 : 500;
  const seleniumUg = 70;

  // Special Clinical Reminders & Guidelines based on all active medications
  const specialGuidelines: string[] = [];

  const meds = profile.medications || (medication && medication !== 'NONE' ? [medication] : []);
  const hasMph = meds.includes('METHYLPHENIDATE');
  const hasLdx = meds.includes('LISDEXAMFETAMINE');
  const hasSsri = meds.includes('SSRI');
  const hasSnri = meds.includes('SNRI');
  const hasBupropion = meds.includes('BUPROPION');
  const hasAtomoxetine = meds.includes('ATOMOXETINE');
  const hasGuanfacine = meds.includes('GUANFACINE');
  const hasLamotrigine = meds.includes('LAMOTRIGINE');
  const hasMelatonin = meds.includes('MELATONIN');
  const hasIron = meds.includes('IRON_SUPPLEMENT');
  const hasThyroid = meds.includes('THYROID_HORMONE');

  if (hasMph) {
    specialGuidelines.push(
      'Frühstücks-Check (Medikinet): Vor oder mit der Einnahme mindestens 15g Protein und 8g Fett zuführen, um Dose Dumping und Rebound-Crashes zu dämpfen.'
    );
    specialGuidelines.push(
      'Vitamin C Spacing: Säurehaltige Säfte und Vitamin-C-Supplements mindestens 90–120 Minuten zeitlich versetzt zu Stimulanzien einnehmen (renale Clearance!).'
    );
    specialGuidelines.push(
      'Elektrolyt-Booster: Bei Stimulanzien-Einnahme auf ausreichende Hydratation und Kalium/Natrium-Zufuhr achten.'
    );
  }

  if (hasLdx) {
    specialGuidelines.push(
      'Lisdexamfetamin (Elvanse): Auf kontinuierliche Flüssigkeitszufuhr achten. Vitamin C / säurehaltige Getränke meiden, um die renale Ausscheidung nicht zu beschleunigen.'
    );
  }

  if (hasAtomoxetine) {
    specialGuidelines.push(
      'Atomoxetin: Zur Vermeidung gastrointestinaler Nebenwirkungen (Übelkeit) immer mit einer vollwertigen Mahlzeit einnehmen.'
    );
  }

  if (hasBupropion) {
    specialGuidelines.push(
      'Bupropion (Wellbutrin): Morgens einnehmen. Koffeinkonsum moderieren, um vegetative Unruhe und Krampfschwellen-Absenkung zu vermeiden.'
    );
  }

  if (hasGuanfacine) {
    specialGuidelines.push(
      'Guanfacin: Wegen Sedierung bevorzugt abends einnehmen. Nicht mit extrem fettreichen Mahlzeiten kombinieren (Cmax-Peak).'
    );
  }

  if (hasSsri || hasSnri) {
    specialGuidelines.push(
      'STRIKTE SICHERHEITSSPERRE: Keine gleichzeitige Gabe von 5-HTP, L-Tryptophan, Johanniskraut oder SAMe (Lebensgefahr durch Serotonin-Syndrom!).'
    );
    specialGuidelines.push(
      'Omega-3 Monitoring: Dosierungen über 2.000 mg EPA/DHA wegen additiver Thrombozytenaggregationshemmung mit dem Arzt abstimmen.'
    );
  }

  if (hasMelatonin) {
    specialGuidelines.push(
      'Melatonin Chronobiologie: 30–60 Minuten vor der Ziel-Schlafzeit bei gedimmtem Licht einnehmen. Synergie mit Magnesium-Bisglycinat.'
    );
  }

  if (hasIron) {
    specialGuidelines.push(
      'Eisen-Resorption: Mindestens 2 Stunden Abstand zu Kaffee, Tee (Tannine) und Milch (Calcium) einhalten. Synergie mit Vitamin C nutzen.'
    );
  }

  if (hasThyroid) {
    specialGuidelines.push(
      'L-Thyroxin: Strikte Nüchterneinnahme 30–60 Min. vor dem Frühstück mit Wasser. Mindestens 4 Std. Abstand zu Calcium- und Eisen-Präparaten.'
    );
  }

  if (isAdhd) {
    specialGuidelines.push(
      'Dopamin-Kofaktoren: Tyrosin-Hydroxylase benötigt aktives Eisen (Serum-Ferritin > 50 µg/l anstreben) sowie Vitamin C und BH4.'
    );
    specialGuidelines.push(
      'Magnesium-Split: Morgens Malat oder L-Threonat für kognitive Klarheit, abends Magnesium-Bisglycinat zur Dämpfung der NMDA-Rezeptoren.'
    );
  }

  if (isAsd) {
    specialGuidelines.push(
      'Mikrobiom & SCFA: Fokus auf resistente Stärke (z. B. abgekühlter Reis/Kartoffeln) und lösliche Ballaststoffe zur Butyrat-Synthese.'
    );
    if (trackGlutenCasein) {
      specialGuidelines.push(
        'Reizdarm-Filter aktiviert: Monitoring von Weizengluten und A1-Kasein zur Vermeidung sensorischer und intestinaler Reizungen.'
      );
    }
  }

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories,
    proteinGrams,
    proteinKcal,
    fatGrams,
    fatKcal,
    carbGrams,
    carbKcal,
    carbWarning,
    fiberGrams,
    omega3TotalMg,
    omega3EpaMg,
    omega3DhaMg,
    ironMg,
    magnesiumMg,
    zincMg,
    copperMg,
    vitaminB6Mg,
    vitaminB9Ugf,
    vitaminB12Ug,
    vitaminD3Iu,
    vitaminK2Ug,
    vitaminCMg,
    cholineMg,
    seleniumUg,
    specialGuidelines
  };
}
