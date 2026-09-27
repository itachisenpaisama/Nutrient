import { LogEntry, UserProfile, InteractionAlert } from '../types';

export interface ValidationCheckResult {
  canAdd: boolean;
  alert?: InteractionAlert;
}

export function validateItemAddition(
  profile: UserProfile,
  itemNameOrId: string,
  entryTimestamp: string,
  existingEntries: LogEntry[]
): ValidationCheckResult {
  const normName = itemNameOrId.toLowerCase();
  const meds = profile.medications || (profile.medication && profile.medication !== 'NONE' ? [profile.medication] : []);
  const hasSsriOrSnri = meds.includes('SSRI') || meds.includes('SNRI');
  const hasStimulant = meds.includes('METHYLPHENIDATE') || meds.includes('LISDEXAMFETAMINE');
  const hasIronMed = meds.includes('IRON_SUPPLEMENT');

  // 1. CRITICAL_LOCK: SSRI / SNRI + 5-HTP or L-Tryptophan
  if (hasSsriOrSnri) {
    if (
      normName.includes('5-htp') ||
      normName.includes('tryptophan') ||
      normName.includes('5-hydroxy')
    ) {
      return {
        canAdd: false,
        alert: {
          id: `lock-5htp-${Date.now()}`,
          timestamp: entryTimestamp,
          severity: 'CRITICAL_LOCK',
          substanceA: 'SSRI (Antidepressivum)',
          substanceB: '5-HTP / L-Tryptophan',
          titleDe: 'LEBENSGEFAHR: Serotonin-Syndrom',
          titleEn: 'LETHAL RISK: Serotonin Syndrome',
          messageDe:
            'Die gleichzeitige Einnahme von SSRI mit 5-HTP oder hochdosiertem Tryptophan kann ein potenziell tödliches Serotonin-Syndrom (Hyperthermie, Krämpfe, Klonus) auslösen!',
          messageEn:
            'Concurrent administration of SSRIs with 5-HTP or L-Tryptophan provokes central serotonin toxicity which is medically life-threatening!',
          actionRecommendationDe:
            'Eingabe verweigert: Dieses Präparat darf unter SSRI-Medikation keinesfalls eingenommen werden.',
          actionRecommendationEn:
            'Addition blocked: This supplement must never be co-administered with SSRIs.'
        }
      };
    }

    // CRITICAL_LOCK: SSRI + St. John's Wort / SAMe
    if (
      normName.includes('johanniskraut') ||
      normName.includes("st. john") ||
      normName.includes('st john') ||
      normName.includes('same') ||
      normName.includes('adenosylmethionin')
    ) {
      return {
        canAdd: false,
        alert: {
          id: `lock-stjohn-${Date.now()}`,
          timestamp: entryTimestamp,
          severity: 'CRITICAL_LOCK',
          substanceA: 'SSRI (Antidepressivum)',
          substanceB: 'Johanniskraut / SAMe',
          titleDe: 'LEBENSGEFAHR: CYP3A4 & Serotonin Interaktion',
          titleEn: 'LETHAL RISK: CYP3A4 & Serotonin Interaction',
          messageDe:
            'Johanniskraut und SAMe führen in Kombination mit SSRIs zu unkontrollierter Serotonin-Akkumulation und Enzyminduktion.',
          messageEn:
            'St. John\'s Wort and SAMe cause dangerous serotonin accumulation and hepatic enzyme induction with SSRIs.',
          actionRecommendationDe:
            'Eingabe verweigert: Johanniskraut und SAMe sind streng kontraindiziert.',
          actionRecommendationEn:
            'Addition blocked: St. John\'s Wort and SAMe are strictly contraindicated.'
        }
      };
    }
  }

  // 2. WARNING: Stimulants + Vitamin C or Citrus within 90-120 minutes
  if (hasStimulant) {
    const isVitC =
      normName.includes('vitamin c') ||
      normName.includes('ascorb') ||
      normName.includes('citrus') ||
      normName.includes('zitrone') ||
      normName.includes('orange');

    if (isVitC) {
      // Check if medication was logged in last 120 minutes or next 120 minutes
      const entryTime = new Date(entryTimestamp).getTime();
      const medEntry = existingEntries.find((e) => {
        if (e.mealType === 'medication' || e.medicationName) {
          const t = new Date(e.timestamp).getTime();
          const diffMinutes = Math.abs(t - entryTime) / (1000 * 60);
          return diffMinutes <= 120;
        }
        return false;
      });

      if (medEntry) {
        return {
          canAdd: true,
          alert: {
            id: `warn-vitc-mph-${Date.now()}`,
            timestamp: entryTimestamp,
            severity: 'WARNING',
            substanceA: 'Methylphenidat / Stimulans',
            substanceB: 'Vitamin C / Säuren',
            titleDe: 'Kinetik-Warnung: Urin-Ansäuerung',
            titleEn: 'Kinetic Warning: Urinary Acidification',
            messageDe:
              'Vitamin C säuert den Urin an und beschleunigt die renale Ausscheidung des Wirkstoffs erheblich. Dadurch bricht die Wirkdauer ein!',
            messageEn:
              'Vitamin C lowers urinary pH and significantly accelerates renal clearance of your stimulant, causing premature drop-off.',
            actionRecommendationDe:
              'Verschiebungstipp: Nimm Vitamin C erst 2 Stunden nach oder 2 Stunden vor deiner Medikation ein.',
            actionRecommendationEn:
              'Spacing tip: Ingest Vitamin C at least 2 hours before or after stimulant dosing.'
          }
        };
      }
    }
  }

  // 3. WARNING: Iron + Coffee/Tea/Calcium within 120 minutes
  const isIron =
    normName.includes('eisen') ||
    normName.includes('iron') ||
    normName.includes('ferro');

  if (isIron) {
    const entryTime = new Date(entryTimestamp).getTime();
    const coffeeOrCalcium = existingEntries.find((e) => {
      const lower = e.title.toLowerCase();
      const hasBlocker =
        lower.includes('kaffee') ||
        lower.includes('coffee') ||
        lower.includes('espresso') ||
        lower.includes('tee') ||
        lower.includes('tea') ||
        lower.includes('milch') ||
        lower.includes('milk') ||
        lower.includes('calcium');
      if (hasBlocker) {
        const t = new Date(e.timestamp).getTime();
        return Math.abs(t - entryTime) / (1000 * 60) <= 120;
      }
      return false;
    });

    if (coffeeOrCalcium) {
      return {
        canAdd: true,
        alert: {
          id: `warn-iron-block-${Date.now()}`,
          timestamp: entryTimestamp,
          severity: 'WARNING',
          substanceA: 'Eisen (Fe2+)',
          substanceB: 'Kaffee / Tee / Calcium',
          titleDe: 'Resorptions-Blockade am DMT1-Kanal',
          titleEn: 'DMT1 Carrier Blockade Alert',
          messageDe:
            'Tannine aus Kaffee/Tee oder Calcium aus Milch chelieren Eisen und blockieren die intestinale Aufnahme nahezu vollständig.',
          messageEn:
            'Tannins in coffee/tea or calcium in dairy chelate iron and severely inhibit intestinal DMT1 transport.',
          actionRecommendationDe:
            'Timer-Setzung: Bitte 2 Stunden zeitlichen Abstand zwischen Eisen und Kaffee/Milchprodukten einhalten.',
          actionRecommendationEn:
            'Spacing tip: Maintain a 2-hour interval between iron and coffee/dairy.'
        }
      };
    }
  }

  return { canAdd: true };
}

export function evaluateDailyInteractions(
  profile: UserProfile,
  entries: LogEntry[]
): InteractionAlert[] {
  const alerts: InteractionAlert[] = [];
  const meds = profile.medications || (profile.medication && profile.medication !== 'NONE' ? [profile.medication] : []);
  const hasMph = meds.includes('METHYLPHENIDATE');
  const hasSsriOrSnri = meds.includes('SSRI') || meds.includes('SNRI');

  // 1. Check if Methylphenidate was taken with adequate breakfast
  if (hasMph) {
    const medEntries = entries.filter(
      (e) => e.mealType === 'medication' || (e.medicationName && e.medicationName.length > 0)
    );

    for (const m of medEntries) {
      const medTime = new Date(m.timestamp).getTime();
      // Look for breakfast or meals within 60 minutes
      const nearbyMeals = entries.filter((e) => {
        if (e.id === m.id) return false;
        const t = new Date(e.timestamp).getTime();
        return Math.abs(t - medTime) / (1000 * 60) <= 60;
      });

      const totalProtein = nearbyMeals.reduce((acc, curr) => acc + (curr.proteinG || 0), 0);
      const totalFat = nearbyMeals.reduce((acc, curr) => acc + (curr.fatG || 0), 0);

      if (totalProtein < 15 || totalFat < 8) {
        alerts.push({
          id: `alert-mph-breakfast-${m.id}`,
          timestamp: m.timestamp,
          severity: 'WARNING',
          substanceA: 'Methylphenidat (z. B. Medikinet adult)',
          substanceB: 'Nüchtern-Einnahme / Mageres Frühstück',
          titleDe: 'Kinetik-Alarm: Mahlzeit unzureichend',
          titleEn: 'Kinetic Alert: Insufficient Meal',
          messageDe: `Mahlzeit zur Medikation erfasst nur ${totalProtein.toFixed(0)}g Protein und ${totalFat.toFixed(0)}g Fett. Es drohen "Dose Dumping" (zu schnelles Anfluten) und ein vorzeitiger Rebound-Crash!`,
          messageEn: `Meal accompanying medication only contains ${totalProtein.toFixed(0)}g protein and ${totalFat.toFixed(0)}g fat. Risk of erratic dose-dumping and steep rebound crash!`,
          actionRecommendationDe:
            'Empfehlung: Mindestens 15g Protein und 8g Fett zur Einnahme protokollieren (z. B. 2 Bio-Eier oder Quark mit Nüssen).',
          actionRecommendationEn:
            'Recommendation: Consume at least 15g protein and 8g healthy fat with your stimulant dose.'
        });
      }
    }
  }

  // 2. High-Dose Omega-3 + SSRI/SNRI check
  if (hasSsriOrSnri) {
    const totalOmega3 = entries.reduce(
      (acc, curr) => acc + (curr.omega3EpaMg || 0) + (curr.omega3DhaMg || 0) + (curr.omega3Mg || 0),
      0
    );

    if (totalOmega3 > 2000) {
      alerts.push({
        id: `alert-ssri-omega3-${Date.now()}`,
        timestamp: new Date().toISOString(),
        severity: 'WARNING',
        substanceA: 'SSRI Antidepressivum',
        substanceB: `Hochdosis Omega-3 (${Math.round(totalOmega3)} mg)`,
        titleDe: 'Hinweis: Blutungszeit & Thrombozyten',
        titleEn: 'Notice: Hemostasis & Platelet Function',
        messageDe:
          'Kombination aus SSRI und > 2.000 mg Omega-3 hemmt additiv die Thrombozytenaggregation. Dies kann Hämatome (blaue Flecken) und Nasenbluten begünstigen.',
        messageEn:
          'Combination of SSRIs and >2,000 mg Omega-3 exerts additive platelet aggregation inhibition, occasionally increasing bruising.',
        actionRecommendationDe:
          'Mit Arzt abstimmen und bei geplanten chirurgischen Eingriffen pausieren.',
        actionRecommendationEn:
          'Consult physician and discontinue prior to planned surgical procedures.'
      });
    }
  }

  return alerts;
}
