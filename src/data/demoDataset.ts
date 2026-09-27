import { UserProfile, DailyLogSummary, LogEntry, DailySymptomLog } from '../types';
import { calculateNutrientPlan } from '../services/calculationEngine';

export const DEMO_PROFILE: UserProfile = {
  id: 'profile-alex-01',
  name: 'Alex Neumann',
  age: 29,
  gender: 'male',
  heightCm: 182,
  weightKg: 78,
  bodyFatPct: 15,
  leanBodyMassKg: 66.3,
  activityLevel: 1.55,
  goal: 'MAINTENANCE',
  neuroModifier: 'ADHD',
  medication: 'METHYLPHENIDATE',
  medications: ['METHYLPHENIDATE'],
  trackGlutenCasein: true,
  notes: 'Medikinet adult 20mg morgens. Fokus auf Dopamin-Synthese, Kinetik-Glättung und Vermeidung von Rebound-Crashes.',
  createdAt: '2026-08-28T07:30:00.000Z',
  updatedAt: '2026-09-27T08:00:00.000Z'
};

export function generate30DaysDemoLogs(profile: UserProfile): DailyLogSummary[] {
  const plan = calculateNutrientPlan(profile);
  const logs: DailyLogSummary[] = [];

  // Generate 30 days leading up to 2026-09-27
  for (let i = 29; i >= 0; i--) {
    const d = new Date(2026, 8, 27); // Month 8 is September
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);

    // Variation pattern:
    // Every 3rd day Alex forgot to take high protein breakfast before Medikinet
    const lowProteinMorning = i % 3 === 0;
    // Every alternate day Alex took high EPA Omega-3
    const highEpaDay = i % 2 === 0;
    // High magnesium day
    const highMagDay = i % 2 !== 0;

    const breakfastProtein = lowProteinMorning ? 8 : 26;
    const breakfastFat = lowProteinMorning ? 4 : 14;
    const lunchProtein = 42;
    const dinnerProtein = 45;
    const epaDose = highEpaDay ? 1350 : 250;
    const dhaDose = highEpaDay ? 450 : 150;
    const magDose = highMagDay ? 450 : 220;
    const vitCDose = lowProteinMorning ? 500 : 250; // sometimes took Vit C too close

    const entries: LogEntry[] = [
      {
        id: `entry-${dateStr}-1`,
        timestamp: `${dateStr}T08:00:00`,
        mealType: 'medication',
        title: 'Medikinet adult 20mg',
        medicationName: 'Medikinet adult',
        dosage: '20mg',
        servings: 1,
        calories: 0,
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
        fiberG: 0,
        omega3Mg: 0,
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
        copperMg: 0,
        timingVerified: !lowProteinMorning
      },
      {
        id: `entry-${dateStr}-2`,
        timestamp: `${dateStr}T08:15:00`,
        mealType: 'breakfast',
        title: lowProteinMorning ? 'Kaffee mit Toast & Marmelade' : 'Bio-Eier Omelett mit Spinat & Haferflocken',
        servings: 1,
        calories: lowProteinMorning ? 290 : 540,
        proteinG: breakfastProtein,
        carbsG: lowProteinMorning ? 52 : 48,
        fatG: breakfastFat,
        fiberG: lowProteinMorning ? 1.5 : 7.2,
        omega3Mg: lowProteinMorning ? 30 : 280,
        omega3EpaMg: lowProteinMorning ? 0 : 60,
        omega3DhaMg: lowProteinMorning ? 0 : 120,
        vitaminB6Mg: lowProteinMorning ? 0.2 : 0.6,
        vitaminB9Ug: lowProteinMorning ? 20 : 180,
        vitaminB12Ug: lowProteinMorning ? 0.2 : 2.5,
        vitaminD3Iu: lowProteinMorning ? 0 : 120,
        vitaminK2Ug: lowProteinMorning ? 0 : 35,
        vitaminCMg: lowProteinMorning ? 2 : 25,
        magnesiumMg: lowProteinMorning ? 25 : 160,
        ironMg: lowProteinMorning ? 1.2 : 4.8,
        zincMg: lowProteinMorning ? 0.8 : 3.6,
        copperMg: 0.2
      },
      {
        id: `entry-${dateStr}-3`,
        timestamp: `${dateStr}T13:00:00`,
        mealType: 'lunch',
        title: 'Wildlachsfilet mit Süßkartoffeln & Brokkoli',
        servings: 1,
        calories: 620,
        proteinG: lunchProtein,
        carbsG: 55,
        fatG: 18,
        fiberG: 8.5,
        omega3Mg: 1600,
        omega3EpaMg: 750,
        omega3DhaMg: 850,
        vitaminB6Mg: 1.2,
        vitaminB9Ug: 80,
        vitaminB12Ug: 4.5,
        vitaminD3Iu: 750,
        vitaminK2Ug: 5,
        vitaminCMg: 45,
        magnesiumMg: 95,
        ironMg: 2.5,
        zincMg: 1.8,
        copperMg: 0.3
      },
      {
        id: `entry-${dateStr}-4`,
        timestamp: `${dateStr}T13:30:00`,
        mealType: 'supplement',
        title: 'Omega-3 Algenöl (EPA/DHA 3:1)',
        servings: highEpaDay ? 1 : 0,
        calories: highEpaDay ? 18 : 0,
        proteinG: 0,
        carbsG: 0,
        fatG: highEpaDay ? 2 : 0,
        fiberG: 0,
        omega3Mg: highEpaDay ? 1500 : 0,
        omega3EpaMg: highEpaDay ? 1100 : 0,
        omega3DhaMg: highEpaDay ? 400 : 0,
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
      {
        id: `entry-${dateStr}-5`,
        timestamp: `${dateStr}T19:30:00`,
        mealType: 'dinner',
        title: 'Hähnchenbrust / Tofu mit Quinoa & Kürbiskernen',
        servings: 1,
        calories: 720,
        proteinG: dinnerProtein,
        carbsG: 65,
        fatG: 22,
        fiberG: 9.8,
        omega3Mg: 120,
        omega3EpaMg: 20,
        omega3DhaMg: 40,
        vitaminB6Mg: 1.4,
        vitaminB9Ug: 95,
        vitaminB12Ug: 0.8,
        vitaminD3Iu: 20,
        vitaminK2Ug: 2,
        vitaminCMg: 15,
        magnesiumMg: 180,
        ironMg: 4.2,
        zincMg: 4.1,
        copperMg: 0.5
      },
      {
        id: `entry-${dateStr}-6`,
        timestamp: `${dateStr}T21:45:00`,
        mealType: 'supplement',
        title: 'Magnesium-Bisglycinat (200mg) + P5P (10mg)',
        servings: highMagDay ? 1 : 0,
        calories: 0,
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
        fiberG: 0,
        omega3Mg: 0,
        omega3EpaMg: 0,
        omega3DhaMg: 0,
        vitaminB6Mg: highMagDay ? 10 : 0,
        vitaminB9Ug: 0,
        vitaminB12Ug: 0,
        vitaminD3Iu: 0,
        vitaminK2Ug: 0,
        vitaminCMg: 0,
        magnesiumMg: highMagDay ? 200 : 0,
        ironMg: 0,
        zincMg: 0,
        copperMg: 0
      }
    ];

    // Compute totals
    const totals = entries.reduce(
      (acc, cur) => {
        acc.calories += cur.calories;
        acc.proteinG += cur.proteinG;
        acc.carbsG += cur.carbsG;
        acc.fatG += cur.fatG;
        acc.fiberG += cur.fiberG;
        acc.omega3EpaMg += cur.omega3EpaMg;
        acc.omega3DhaMg += cur.omega3DhaMg;
        acc.vitaminB6Mg += cur.vitaminB6Mg;
        acc.vitaminB9Ug += cur.vitaminB9Ug;
        acc.vitaminB12Ug += cur.vitaminB12Ug;
        acc.vitaminD3Iu += cur.vitaminD3Iu;
        acc.vitaminK2Ug += cur.vitaminK2Ug;
        acc.vitaminCMg += cur.vitaminCMg;
        acc.magnesiumMg += cur.magnesiumMg;
        acc.ironMg += cur.ironMg;
        acc.zincMg += cur.zincMg;
        acc.copperMg += cur.copperMg;
        return acc;
      },
      {
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
      }
    );

    // Compute cofactor metrics
    const cofactorsMet = {
      iron: totals.ironMg >= plan.ironMg,
      magnesium: totals.magnesiumMg >= plan.magnesiumMg,
      p5pB6: totals.vitaminB6Mg >= plan.vitaminB6Mg,
      zinc: totals.zincMg >= plan.zincMg,
      omega3Epa: totals.omega3EpaMg >= plan.omega3EpaMg,
      vitaminB12: totals.vitaminB12Ug >= plan.vitaminB12Ug,
      fiber: totals.fiberG >= plan.fiberGrams
    };

    const metCount = Object.values(cofactorsMet).filter(Boolean).length;
    const scorePct = Math.round((metCount / Object.keys(cofactorsMet).length) * 100);

    // Realistic symptom ratings influenced by nutrition
    // If high EPA -> Focus is 8 to 9, else 5 to 6
    const baseFocus = highEpaDay ? 8.5 : 5.5;
    const focusScore = Math.min(10, Math.max(2, Math.round(baseFocus + (Math.random() * 1.5 - 0.7))));

    // If low protein morning -> severe rebound (score 7-8), else mild rebound (2-3)
    const reboundSeverityScore = lowProteinMorning ? 7.5 : 2.5;

    const baseEnergy = !lowProteinMorning && highEpaDay ? 8 : 6;
    const energyScore = Math.min(10, Math.max(3, Math.round(baseEnergy + (Math.random() * 1.2 - 0.6))));

    const gutComfortScore = totals.fiberG >= 25 ? 8 : 5;
    const sleepQualityScore = totals.magnesiumMg >= 350 ? 8.5 : 6;

    const symptomLog: DailySymptomLog = {
      date: dateStr,
      focusScore,
      energyScore,
      fatigueScore: Math.round(10 - energyScore),
      gutComfortScore,
      sleepQualityScore,
      reboundSeverityScore,
      notes: lowProteinMorning
        ? 'Morgens wenig Zeit, Rebound am Nachmittag war spürbar zäh.'
        : 'Stabile Konzentration den ganzen Tag über, sanfter Ausklang.'
    };

    logs.push({
      date: dateStr,
      entries,
      symptomLog,
      totals,
      scorePct,
      cofactorsMet,
      alerts: []
    });
  }

  return logs;
}
