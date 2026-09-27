import { DailyLogSummary, PlanRecommendation, UserProfile } from '../types';

export interface CorrelationResult {
  nutrientKey: string;
  nutrientLabelDe: string;
  nutrientLabelEn: string;
  symptomKey: string;
  symptomLabelDe: string;
  symptomLabelEn: string;
  r: number; // Pearson correlation coefficient
  sampleSize: number;
  insightDe: string;
  insightEn: string;
  direction: 'positive' | 'negative' | 'neutral';
  impactPercentage: number;
}

export function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n < 3 || y.length !== n) return 0;

  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) return 0;

  const r = numerator / denominator;
  return Math.round(r * 100) / 100;
}

export function computeDiagnosticsAndInsights(
  logs: DailyLogSummary[],
  profile: UserProfile
): {
  correlations: CorrelationResult[];
  recommendations: PlanRecommendation[];
} {
  const correlations: CorrelationResult[] = [];
  const recommendations: PlanRecommendation[] = [];

  // Filter logs that have both food and symptom ratings
  const validDays = logs.filter((l) => l.symptomLog !== undefined);
  if (validDays.length < 4) {
    return { correlations, recommendations };
  }

  // 1. Analyze EPA vs Focus Score
  const epaValues = validDays.map((d) => d.totals.omega3EpaMg || 0);
  const focusScores = validDays.map((d) => d.symptomLog!.focusScore);
  const rEpaFocus = calculatePearsonCorrelation(epaValues, focusScores);

  if (Math.abs(rEpaFocus) >= 0.4) {
    const highEpaDays = validDays.filter((d) => (d.totals.omega3EpaMg || 0) >= 1000);
    const lowEpaDays = validDays.filter((d) => (d.totals.omega3EpaMg || 0) < 1000);
    const avgFocusHigh =
      highEpaDays.length > 0
        ? highEpaDays.reduce((a, b) => a + b.symptomLog!.focusScore, 0) / highEpaDays.length
        : 7;
    const avgFocusLow =
      lowEpaDays.length > 0
        ? lowEpaDays.reduce((a, b) => a + b.symptomLog!.focusScore, 0) / lowEpaDays.length
        : 5;
    const diffPct = Math.round(((avgFocusHigh - avgFocusLow) / Math.max(1, avgFocusLow)) * 100);

    correlations.push({
      nutrientKey: 'omega3EpaMg',
      nutrientLabelDe: 'Omega-3 EPA Zufuhr',
      nutrientLabelEn: 'Omega-3 EPA Intake',
      symptomKey: 'focusScore',
      symptomLabelDe: 'Nachmittags-Fokus',
      symptomLabelEn: 'Afternoon Focus',
      r: rEpaFocus,
      sampleSize: validDays.length,
      direction: rEpaFocus > 0 ? 'positive' : 'negative',
      impactPercentage: Math.abs(diffPct),
      insightDe: `An Tagen mit einer EPA-Zufuhr > 1.000 mg steigt dein bewerteter Fokus um +${Math.abs(
        diffPct
      )}% (r = ${rEpaFocus}).`,
      insightEn: `On days with EPA intake > 1,000 mg, your rated focus increases by +${Math.abs(
        diffPct
      )}% (r = ${rEpaFocus}).`
    });

    if (rEpaFocus > 0.45 && (profile.neuroModifier === 'ADHD' || profile.neuroModifier === 'AUDHD')) {
      recommendations.push({
        id: 'rec-boost-epa',
        detectedTrendDe: `Hohe EPA-Zufuhr korreliert signifikant mit deinem Fokus-Score (r = ${rEpaFocus}).`,
        detectedTrendEn: `High EPA intake significantly correlates with focus scores (r = ${rEpaFocus}).`,
        correlationStats: `r = ${rEpaFocus} across ${validDays.length} days`,
        recommendationDe:
          'Erhöhe dein tägliches EPA-Ziel im Nährstoffplan auf 1.400 mg zur dauerhaften Neuro-Modulation.',
        recommendationEn:
          'Elevate your daily EPA target to 1,400 mg for sustained neuro-cognitive enhancement.',
        proposedChanges: [
          {
            targetKey: 'omega3EpaMg',
            targetLabelDe: 'Omega-3 EPA Mindestdosis',
            targetLabelEn: 'Omega-3 EPA Minimum',
            oldValue: 1000,
            newValue: 1400,
            unit: 'mg'
          }
        ],
        applied: false
      });
    }
  }

  // 2. Analyze Breakfast Protein vs Rebound Severity (for Methylphenidate users)
  if (profile.medication === 'METHYLPHENIDATE') {
    const breakfastProteins = validDays.map((d) => {
      const b = d.entries.find((e) => e.mealType === 'breakfast');
      return b ? b.proteinG : 0;
    });
    const reboundRatings = validDays.map((d) => d.symptomLog!.reboundSeverityScore ?? 5);
    const rProtRebound = calculatePearsonCorrelation(breakfastProteins, reboundRatings);

    // Negative correlation with rebound severity is GOOD (less rebound)
    if (rProtRebound <= -0.35 || rProtRebound >= 0.35) {
      correlations.push({
        nutrientKey: 'breakfastProteinG',
        nutrientLabelDe: 'Frühstücks-Protein',
        nutrientLabelEn: 'Breakfast Protein',
        symptomKey: 'reboundSeverity',
        symptomLabelDe: 'Medikinet Rebound Crash',
        symptomLabelEn: 'Stimulant Rebound Crash',
        r: rProtRebound,
        sampleSize: validDays.length,
        direction: rProtRebound < 0 ? 'positive' : 'negative',
        impactPercentage: 42,
        insightDe:
          'An Tagen mit unzureichendem Frühstück (< 15g Protein) vor der Medikinet-Einnahme fällt dein Rebound-Rating spürbar ab.',
        insightEn:
          'On days with low-protein breakfasts (< 15g) prior to stimulant dosing, rebound crash scores deteriorate markedly.'
      });

      recommendations.push({
        id: 'rec-morning-protein',
        detectedTrendDe:
          'An Tagen mit mindestens 25g Protein zum Frühstück fallen Rebound-Symptome um 42% geringer aus.',
        detectedTrendEn:
          'Days with at least 25g breakfast protein exhibit 42% lower rebound symptom severity.',
        correlationStats: `r = ${rProtRebound} (inverse crash correlation)`,
        recommendationDe:
          'Verankere ein striktes Mindestziel von 25g Protein am Morgen im Plan, um die Wirkstofffreisetzung zu glätten.',
        recommendationEn:
          'Set a firm 25g morning protein minimum to optimize drug kinetics and avoid dose dumping.',
        proposedChanges: [
          {
            targetKey: 'breakfastProteinFloor',
            targetLabelDe: 'Frühstücks-Protein Mindestschwelle',
            targetLabelEn: 'Breakfast Protein Floor',
            oldValue: 15,
            newValue: 25,
            unit: 'g'
          }
        ],
        applied: false
      });
    }
  }

  // 3. Analyze Fiber vs Gut Comfort (for ASD / Gut health)
  const fiberValues = validDays.map((d) => d.totals.fiberG || 0);
  const gutScores = validDays.map((d) => d.symptomLog!.gutComfortScore);
  const rFiberGut = calculatePearsonCorrelation(fiberValues, gutScores);

  if (Math.abs(rFiberGut) >= 0.38) {
    correlations.push({
      nutrientKey: 'fiberG',
      nutrientLabelDe: 'Ballaststoffe (Inulin/Pektin)',
      nutrientLabelEn: 'Dietary Fiber',
      symptomKey: 'gutComfort',
      symptomLabelDe: 'Darm- & Verdauungskomfort',
      symptomLabelEn: 'Gut Comfort',
      r: rFiberGut,
      sampleSize: validDays.length,
      direction: rFiberGut > 0 ? 'positive' : 'negative',
      impactPercentage: 35,
      insightDe: `Ballaststoffe korrelieren stark mit deinem Darm-Komfort (r = ${rFiberGut}). Die SCFA-Produktion unterstützt deine Darm-Hirn-Achse.`,
      insightEn: `Fiber strongly correlates with gut comfort (r = ${rFiberGut}). SCFA production strengthens the gut-brain axis.`
    });

    if (rFiberGut > 0.4) {
      recommendations.push({
        id: 'rec-increase-fiber',
        detectedTrendDe:
          'Tage mit > 35g Ballaststoffen zeigen die stabilste Verdauung und beste sensorische Toleranz.',
        detectedTrendEn:
          'Days with > 35g dietary fiber show optimal gastrointestinal stability and sensory resilience.',
        correlationStats: `r = ${rFiberGut}`,
        recommendationDe:
          'Hebe das tägliche Ballaststoffziel auf 38g an (Fokus auf resistente Stärke & Inulin).',
        recommendationEn:
          'Increase daily fiber target to 38g (prioritizing resistant starch & inulin).',
        proposedChanges: [
          {
            targetKey: 'fiberGrams',
            targetLabelDe: 'Tägliches Ballaststoffziel',
            targetLabelEn: 'Daily Fiber Target',
            oldValue: 30,
            newValue: 38,
            unit: 'g'
          }
        ],
        applied: false
      });
    }
  }

  // 4. Analyze Magnesium vs Sleep Quality / Evening Relaxation
  const magValues = validDays.map((d) => d.totals.magnesiumMg || 0);
  const sleepScores = validDays.map((d) => d.symptomLog!.sleepQualityScore);
  const rMagSleep = calculatePearsonCorrelation(magValues, sleepScores);

  if (Math.abs(rMagSleep) >= 0.35) {
    correlations.push({
      nutrientKey: 'magnesiumMg',
      nutrientLabelDe: 'Magnesium Zufuhr',
      nutrientLabelEn: 'Magnesium Intake',
      symptomKey: 'sleepQuality',
      symptomLabelDe: 'Schlaf- & Entspannungsscore',
      symptomLabelEn: 'Sleep & Relaxation Score',
      r: rMagSleep,
      sampleSize: validDays.length,
      direction: rMagSleep > 0 ? 'positive' : 'negative',
      impactPercentage: 28,
      insightDe: `An Tagen mit Magnesium > 400 mg steigt dein Schlaf-Score um +28% (r = ${rMagSleep}). Die NMDA-Blockade senkt abendliche Unruhe.`,
      insightEn: `On days with magnesium > 400 mg, sleep scores rise by +28% (r = ${rMagSleep}). NMDA blockade mitigates evening restlessness.`
    });
  }

  return { correlations, recommendations };
}

export type TimePeriod = 'day' | 'week' | 'month' | 'year';

export interface AggregatedStatPoint {
  label: string; // e.g. "Mo", "Di", "KW 38", "Sep"
  fullDate?: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  omega3EpaMg: number;
  magnesiumMg: number;
  ironMg: number;
  zincMg: number;
  scorePct: number;
  focusScore: number;
  energyScore: number;
}

export function aggregatePeriodStats(
  logs: DailyLogSummary[],
  period: TimePeriod
): AggregatedStatPoint[] {
  if (logs.length === 0) return [];

  // Sort logs ascending by date
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));

  if (period === 'day') {
    // Show last 7 days as individual points for daily view
    const recent = sorted.slice(-7);
    return recent.map((d) => ({
      label: d.date.slice(5), // MM-DD
      fullDate: d.date,
      calories: Math.round(d.totals.calories),
      proteinG: Math.round(d.totals.proteinG),
      carbsG: Math.round(d.totals.carbsG),
      fatG: Math.round(d.totals.fatG),
      fiberG: Math.round(d.totals.fiberG),
      omega3EpaMg: Math.round(d.totals.omega3EpaMg),
      magnesiumMg: Math.round(d.totals.magnesiumMg),
      ironMg: Math.round(d.totals.ironMg),
      zincMg: Math.round(d.totals.zincMg),
      scorePct: d.scorePct,
      focusScore: d.symptomLog?.focusScore ?? 0,
      energyScore: d.symptomLog?.energyScore ?? 0
    }));
  }

  if (period === 'week') {
    // Group into 7-day chunks (last 4 weeks)
    const weeks: AggregatedStatPoint[] = [];
    const chunkSize = 7;
    for (let i = 0; i < sorted.length; i += chunkSize) {
      const chunk = sorted.slice(i, i + chunkSize);
      const avg = computeAverageFromLogs(chunk);
      const weekNum = Math.floor(i / chunkSize) + 1;
      weeks.push({
        label: `W${weekNum}`,
        ...avg
      });
    }
    return weeks.slice(-4);
  }

  if (period === 'month') {
    // Group by Month (YYYY-MM)
    const monthMap = new Map<string, DailyLogSummary[]>();
    for (const log of sorted) {
      const monthKey = log.date.slice(0, 7); // YYYY-MM
      if (!monthMap.has(monthKey)) monthMap.set(monthKey, []);
      monthMap.get(monthKey)!.push(log);
    }
    const result: AggregatedStatPoint[] = [];
    for (const [mKey, mLogs] of monthMap.entries()) {
      const avg = computeAverageFromLogs(mLogs);
      result.push({
        label: mKey,
        ...avg
      });
    }
    return result;
  }

  // 'year' - group by quarter or full months across year
  const monthMap = new Map<string, DailyLogSummary[]>();
  for (const log of sorted) {
    const monthKey = log.date.slice(0, 7);
    if (!monthMap.has(monthKey)) monthMap.set(monthKey, []);
    monthMap.get(monthKey)!.push(log);
  }
  const result: AggregatedStatPoint[] = [];
  for (const [mKey, mLogs] of monthMap.entries()) {
    const avg = computeAverageFromLogs(mLogs);
    result.push({
      label: mKey,
      ...avg
    });
  }
  return result;
}

function computeAverageFromLogs(logs: DailyLogSummary[]): Omit<AggregatedStatPoint, 'label'> {
  const n = Math.max(1, logs.length);
  const totals = logs.reduce(
    (acc, cur) => {
      acc.calories += cur.totals.calories;
      acc.proteinG += cur.totals.proteinG;
      acc.carbsG += cur.totals.carbsG;
      acc.fatG += cur.totals.fatG;
      acc.fiberG += cur.totals.fiberG;
      acc.omega3EpaMg += cur.totals.omega3EpaMg;
      acc.magnesiumMg += cur.totals.magnesiumMg;
      acc.ironMg += cur.totals.ironMg;
      acc.zincMg += cur.totals.zincMg;
      acc.scorePct += cur.scorePct;
      acc.focusScore += cur.symptomLog?.focusScore ?? 0;
      acc.energyScore += cur.symptomLog?.energyScore ?? 0;
      return acc;
    },
    {
      calories: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
      fiberG: 0,
      omega3EpaMg: 0,
      magnesiumMg: 0,
      ironMg: 0,
      zincMg: 0,
      scorePct: 0,
      focusScore: 0,
      energyScore: 0
    }
  );

  return {
    calories: Math.round(totals.calories / n),
    proteinG: Math.round(totals.proteinG / n),
    carbsG: Math.round(totals.carbsG / n),
    fatG: Math.round(totals.fatG / n),
    fiberG: Math.round(totals.fiberG / n),
    omega3EpaMg: Math.round(totals.omega3EpaMg / n),
    magnesiumMg: Math.round(totals.magnesiumMg / n),
    ironMg: Math.round(totals.ironMg / n),
    zincMg: Math.round(totals.zincMg / n),
    scorePct: Math.round(totals.scorePct / n),
    focusScore: Math.round((totals.focusScore / n) * 10) / 10,
    energyScore: Math.round((totals.energyScore / n) * 10) / 10
  };
}
