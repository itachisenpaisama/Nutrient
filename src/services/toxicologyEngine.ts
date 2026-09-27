import { DailyLogSummary } from '../types';
import { TOXICOLOGY_THRESHOLDS, ToxicologyThreshold } from '../data/interactionMatrix';

export interface ToxicologyAuditItem {
  threshold: ToxicologyThreshold;
  average30DayValue: number;
  highestDayValue: number;
  daysAboveWarning: number;
  status: 'SAFE' | 'ELEVATED' | 'TOXIC_RISK';
  noteDe: string;
  noteEn: string;
}

export interface ToxicologyReport {
  generatedAt: string;
  daysAnalyzed: number;
  overallStatus: 'SAFE' | 'ATTENTION' | 'CRITICAL';
  items: ToxicologyAuditItem[];
}

export function perform30DayToxicologyAudit(logs: DailyLogSummary[]): ToxicologyReport {
  const count = Math.max(1, logs.length);
  const items: ToxicologyAuditItem[] = [];

  for (const t of TOXICOLOGY_THRESHOLDS) {
    let sum = 0;
    let maxVal = 0;
    let daysAbove = 0;

    for (const day of logs) {
      let val = 0;
      if (t.nutrientId === 'vitamin-b6') val = day.totals.vitaminB6Mg || 0;
      if (t.nutrientId === 'iron') val = day.totals.ironMg || 0;
      if (t.nutrientId === 'selenium') val = 70; // fallback standard or tracked selenium
      if (t.nutrientId === 'zinc') val = day.totals.zincMg || 0;
      if (t.nutrientId === 'vitamin-d3') val = day.totals.vitaminD3Iu || 0;

      sum += val;
      if (val > maxVal) maxVal = val;
      if (val >= t.warnThresholdValue) daysAbove++;
    }

    const avg = sum / count;

    let status: 'SAFE' | 'ELEVATED' | 'TOXIC_RISK' = 'SAFE';
    let noteDe = `Im physiologisch sicheren Bereich (Durchschnitt: ${avg.toFixed(1)} ${t.unit}).`;
    let noteEn = `Within physiologically safe limits (Average: ${avg.toFixed(1)} ${t.unit}).`;

    if (t.nutrientId === 'vitamin-b6') {
      if (daysAbove >= 14 || avg > 12) {
        status = 'TOXIC_RISK';
        noteDe = `Achtung: An ${daysAbove} Tagen lag die B6-Zufuhr über 10mg! Risiko peripherer Nervenreizungen. Dosis reduzieren!`;
        noteEn = `Warning: B6 intake exceeded 10mg across ${daysAbove} days! Risk of peripheral neuropathy. Reduce dosage!`;
      } else if (daysAbove > 0) {
        status = 'ELEVATED';
        noteDe = `Einzelne Spitzen bis ${maxVal.toFixed(1)} mg. Bei dauerhafter Einnahme auf aktive P5P-Form achten.`;
        noteEn = `Occasional spikes up to ${maxVal.toFixed(1)} mg. Ensure active P5P form is used.`;
      }
    } else if (t.nutrientId === 'zinc') {
      if (avg >= 25 || daysAbove > 10) {
        status = 'TOXIC_RISK';
        noteDe = `Achtung: Zinkzufuhr liegt chronisch bei ${avg.toFixed(1)} mg/Tag (Grenze 25mg). Gefahr von Kupfermangel und Anämie!`;
        noteEn = `Caution: Zinc intake averages ${avg.toFixed(1)} mg/day (limit 25mg). Risk of secondary copper deficiency!`;
      } else if (daysAbove > 0) {
        status = 'ELEVATED';
        noteDe = `Zinkzufuhr temporär erhöht (${maxVal.toFixed(1)} mg). Kupfer-Kofaktor sicherstellen.`;
        noteEn = `Zinc intake temporarily elevated (${maxVal.toFixed(1)} mg). Ensure copper balance.`;
      }
    } else if (t.nutrientId === 'vitamin-d3') {
      if (avg > 4000) {
        status = 'TOXIC_RISK';
        noteDe = `Achtung: D3-Zufuhr liegt dauerhaft bei ${avg.toFixed(0)} IE/Tag! Ohne 25(OH)D3-Laborwert droht Hypercalcämie!`;
        noteEn = `Caution: D3 intake averages ${avg.toFixed(0)} IU/day! Unmonitored high doses risk hypercalcemia!`;
      } else if (maxVal > 4000) {
        status = 'ELEVATED';
        noteDe = `Hohe Einzeldosen registriert (${maxVal.toFixed(0)} IE). Mit Vitamin K2 (MK-7) kombinieren.`;
        noteEn = `High single doses logged (${maxVal.toFixed(0)} IU). Ensure Vitamin K2 (MK-7) co-administration.`;
      }
    } else if (t.nutrientId === 'iron') {
      if (avg > 40) {
        status = 'TOXIC_RISK';
        noteDe = `Dauerhafte Zufuhr von ${avg.toFixed(1)} mg/Tag überschreitet den EFSA-Schwellenwert. Ferritin kontrollieren!`;
        noteEn = `Sustained intake of ${avg.toFixed(1)} mg/day exceeds upper guidance. Check serum ferritin!`;
      } else if (daysAbove > 0) {
        status = 'ELEVATED';
        noteDe = `Tageshöchstwert bei ${maxVal.toFixed(1)} mg. Abstand zu Kaffee/Calcium einhalten.`;
        noteEn = `Peak daily intake at ${maxVal.toFixed(1)} mg. Maintain clearance from coffee/calcium.`;
      }
    } else {
      if (avg > t.warnThresholdValue) {
        status = 'TOXIC_RISK';
        noteDe = `Dosis über Schwellenwert (${avg.toFixed(1)} ${t.unit}). Risiko: ${t.riskDe}`;
        noteEn = `Dose above threshold (${avg.toFixed(1)} ${t.unit}). Risk: ${t.riskEn}`;
      }
    }

    items.push({
      threshold: t,
      average30DayValue: Math.round(avg * 10) / 10,
      highestDayValue: Math.round(maxVal * 10) / 10,
      daysAboveWarning: daysAbove,
      status,
      noteDe,
      noteEn
    });
  }

  const hasToxic = items.some((i) => i.status === 'TOXIC_RISK');
  const hasElevated = items.some((i) => i.status === 'ELEVATED');
  const overallStatus = hasToxic ? 'CRITICAL' : hasElevated ? 'ATTENTION' : 'SAFE';

  return {
    generatedAt: new Date().toISOString(),
    daysAnalyzed: count,
    overallStatus,
    items
  };
}
