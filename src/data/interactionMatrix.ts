import { AlertSeverity } from '../types';

export interface InteractionRule {
  id: string;
  triggerMedication: string[];
  conflictingItem: string[];
  conflictTypeDe: string;
  conflictTypeEn: string;
  severity: AlertSeverity;
  titleDe: string;
  titleEn: string;
  messageDe: string;
  messageEn: string;
  recommendationDe: string;
  recommendationEn: string;
  minTimeSpacingMinutes?: number;
  thresholdValue?: number;
}

export const INTERACTION_RULES: InteractionRule[] = [
  {
    id: 'mph-empty-stomach',
    triggerMedication: ['METHYLPHENIDATE'],
    conflictingItem: ['EMPTY_STOMACH_FLAG'],
    conflictTypeDe: 'Kinetischer Abfall / "Dose Dumping"',
    conflictTypeEn: 'Kinetic Crash / "Dose Dumping"',
    severity: 'WARNING',
    titleDe: 'Mahlzeiten-Prüfung vor Medikinet',
    titleEn: 'Meal Check Prior to Methylphenidate',
    messageDe: 'Mahlzeit fehlt oder enthält zu wenig Makronährstoffe! Bei retardiertem Methylphenidat (z. B. Medikinet adult) führt Nüchterneinnahme zu unkontrolliertem Anfluten ("Dose Dumping") und heftigem Rebound.',
    messageEn: 'Meal missing or insufficient! Retarded methylphenidate without food causes erratic drug release ("dose dumping") followed by a harsh midday rebound crash.',
    recommendationDe: 'Alarm: Vor oder zeitgleich mit der Einnahme mindestens 15g Protein und 8g Fett protokollieren.',
    recommendationEn: 'Action: Log at least 15g protein and 8g fat with or immediately preceding your dose.'
  },
  {
    id: 'mph-vitamin-c-spacing',
    triggerMedication: ['METHYLPHENIDATE', 'LISDEXAMFETAMINE'],
    conflictingItem: ['vitamin-c', 'ascorbic-acid', 'citrus', 'sour-juice'],
    conflictTypeDe: 'Renale Clearance-Erhöhung durch Harnansäuerung',
    conflictTypeEn: 'Accelerated Renal Clearance via Urinary Acidification',
    severity: 'WARNING',
    titleDe: 'Stimulanzien & Vitamin C Zeitabstand',
    titleEn: 'Stimulants & Vitamin C Time Buffer',
    messageDe: 'Vitamin C oder stark säurehaltige Säfte säuern den Urin an und beschleunigen die Ausscheidung deines ADHS-Medikaments über die Nieren um ein Vielfaches.',
    messageEn: 'Vitamin C and high-acid beverages lower urinary pH, drastically hastening renal filtration and shortening stimulant therapeutic duration.',
    recommendationDe: 'Verschiebungstipp: Halte mindestens 90 bis 120 Minuten Abstand zwischen Vitamin C und Stimulanzien-Einnahme.',
    recommendationEn: 'Spacing Tip: Keep at least 90–120 minutes of clearance between Vitamin C intake and stimulant dosing.',
    minTimeSpacingMinutes: 120
  },
  {
    id: 'ssri-tryptophan-5htp',
    triggerMedication: ['SSRI'],
    conflictingItem: ['5-htp', '5-hydroxytryptophan', 'l-tryptophan', 'tryptophan-supplement'],
    conflictTypeDe: 'Serotonin-Syndrom (Hyperthermie, Klonus, Tremor)',
    conflictTypeEn: 'Serotonin Syndrome (Hyperthermia, Clonus, Tremor)',
    severity: 'CRITICAL_LOCK',
    titleDe: 'LEBENSGEFAHR: Serotonin-Syndrom Risiko!',
    titleEn: 'LETHAL HAZARD: Serotonin Syndrome Risk!',
    messageDe: 'Die gleichzeitige Einnahme von SSRI-Antidepressiva mit Serotonin-Vorstufen (5-HTP oder L-Tryptophan) kann eine lebensgefährliche Serotonin-Toxizität im Gehirn auslösen!',
    messageEn: 'Combining SSRI medications with serotonergic precursors (5-HTP, L-Tryptophan) provokes central serotonin toxicity which can be life-threatening.',
    recommendationDe: 'System-Sperre: Das Supplement kann nicht hinzugefügt werden und darf keinesfalls eingenommen werden!',
    recommendationEn: 'Critical Lock: Supplement cannot be added and must NEVER be consumed concurrently!'
  },
  {
    id: 'ssri-st-johns-wort-same',
    triggerMedication: ['SSRI'],
    conflictingItem: ['st-johns-wort', 'johanniskraut', 'same', 's-adenosylmethionine'],
    conflictTypeDe: 'CYP3A4-Induktion / Serotonin-Syndrom',
    conflictTypeEn: 'CYP3A4 Induction / Serotonergic Overdrive',
    severity: 'CRITICAL_LOCK',
    titleDe: 'LEBENSGEFAHR: Johanniskraut / SAMe Sperre',
    titleEn: 'CRITICAL: St. John\'s Wort / SAMe Interlock',
    messageDe: 'Johanniskraut induziert hepatische Cytochrom-P450-Enzyme und potenziert gleichzeitig die serotonerge Wirkung von SSRI unkalkulierbar.',
    messageEn: 'St. John\'s Wort induces CYP enzymes and unpredictably amplifies synaptic serotonin concentrations when paired with SSRIs.',
    recommendationDe: 'System-Sperre: Supplementierung unter SSRI streng kontraindiziert.',
    recommendationEn: 'Critical Lock: Concomitant administration strictly contraindicated.'
  },
  {
    id: 'ssri-high-dose-omega3',
    triggerMedication: ['SSRI'],
    conflictingItem: ['omega3-high-dose'],
    conflictTypeDe: 'Thrombozytenaggregationshemmung (Blutungsneigung)',
    conflictTypeEn: 'Platelet Aggregation Inhibition (Bleeding Tendency)',
    severity: 'WARNING',
    titleDe: 'SSRI & Hochdosis Omega-3 Hinweis',
    titleEn: 'SSRI & High-Dose Omega-3 Notice',
    messageDe: 'Sowohl SSRI als auch hochdosierte Omega-3-Fettsäuren (>2.000 mg EPA/DHA) hemmen die Thrombozytenfunktion und können Hämatome oder verlängerte Blutungszeiten begünstigen.',
    messageEn: 'Both SSRIs and high-dose omega-3 (>2,000 mg EPA/DHA) mildly inhibit platelet activation, potentially increasing bruising or minor bleeding.',
    recommendationDe: 'Hinweis: Erhöhte Neigung zu blauen Flecken/Blutungen. Dosierung über 2.000 mg mit dem behandelnden Arzt abstimmen.',
    recommendationEn: 'Notice: Monitor for easy bruising. Clear omega-3 doses exceeding 2,000mg with your prescribing physician.',
    thresholdValue: 2000
  },
  {
    id: 'iron-calcium-coffee',
    triggerMedication: ['IRON_SUPPLEMENT'],
    conflictingItem: ['coffee', 'tea', 'milk', 'calcium-supplement'],
    conflictTypeDe: 'Resorptions-Blockade am DMT1-Transporter',
    conflictTypeEn: 'Absorption Blockade at DMT1 Carrier',
    severity: 'WARNING',
    titleDe: 'Eisen-Resorptions-Hemmer',
    titleEn: 'Iron Absorption Inhibitor Alert',
    messageDe: 'Kaffee, schwarzer/grüner Tee (Tannine) und Milchprodukte (Calcium) bilden im Darm unlösliche Chelate mit Eisen und verhindern die Aufnahme fast vollständig.',
    messageEn: 'Coffee, tea tannins, and dairy calcium chelate iron ions, rendering them insoluble and collapsing intestinal bioavailability.',
    recommendationDe: 'Timer-Setzung: Bitte mindestens 2 Stunden Abstand zwischen Eisen und Kaffee/Milch/Tee einhalten.',
    recommendationEn: 'Timing Rule: Maintain a strict 2-hour interval between iron and coffee/tea/calcium.',
    minTimeSpacingMinutes: 120
  },
  {
    id: 'iron-zinc-antagonism',
    triggerMedication: ['IRON_SUPPLEMENT'],
    conflictingItem: ['zinc-supplement', 'calcium-supplement'],
    conflictTypeDe: 'Kompetitiver DMT1-Antagonismus',
    conflictTypeEn: 'Competitive DMT1 Carrier Antagonism',
    severity: 'WARNING',
    titleDe: 'Eisen & Zink/Calcium Split-Tipp',
    titleEn: 'Iron & Zinc/Calcium Split Strategy',
    messageDe: 'Zink, Calcium und Eisen nutzen denselben DMT1-Transporter im Duodenum. Gleichzeitige Einnahme führt zu gegenseitiger Verdrängung.',
    messageEn: 'Zinc, calcium, and iron compete directly for the DMT1 transporter channel. Simultaneous dosing reduces absorption of both.',
    recommendationDe: 'Split-Tipp: Nimm Zink/Calcium morgens zum Frühstück und Eisen abends (oder umgekehrt) mit 3 Stunden Abstand ein.',
    recommendationEn: 'Split Strategy: Ingest zinc/calcium in the morning and iron in the evening with at least 3 hours buffer.'
  }
];

export interface ToxicologyThreshold {
  nutrientId: string;
  nameDe: string;
  nameEn: string;
  efsaUpperLimit: string;
  warnThresholdValue: number;
  unit: string;
  durationRuleDe: string;
  durationRuleEn: string;
  riskDe: string;
  riskEn: string;
}

export const TOXICOLOGY_THRESHOLDS: ToxicologyThreshold[] = [
  {
    nutrientId: 'vitamin-b6',
    nameDe: 'Vitamin B6',
    nameEn: 'Vitamin B6',
    efsaUpperLimit: '12 mg / Tag',
    warnThresholdValue: 10,
    unit: 'mg/Tag',
    durationRuleDe: 'Kumulativ > 10 mg/Tag über 14 Tage',
    durationRuleEn: 'Cumulative > 10 mg/day over 14 days',
    riskDe: 'Periphere sensorische Neuropathie, Parästhesien, Ataxie (besonders bei Pyridoxin-HCl).',
    riskEn: 'Peripheral sensory axonopathy, paresthesia, ataxia (primarily linked to pyridoxine HCl).'
  },
  {
    nutrientId: 'iron',
    nameDe: 'Eisen',
    nameEn: 'Iron',
    efsaUpperLimit: '45 mg / Tag',
    warnThresholdValue: 40,
    unit: 'mg/Tag',
    durationRuleDe: '> 40 mg/Tag ohne ärztlich diagnostizierten Mangel',
    durationRuleEn: '> 40 mg/day without confirmed iron deficiency anemia',
    riskDe: 'Hämochromatose, oxidative Gewebeschäden über die Fenton-Reaktion (Bildung freier Radikale).',
    riskEn: 'Hemochromatosis, lipid peroxidation via Fenton chemistry generating hydroxyl radicals.'
  },
  {
    nutrientId: 'selenium',
    nameDe: 'Selen',
    nameEn: 'Selenium',
    efsaUpperLimit: '255 µg / Tag',
    warnThresholdValue: 200,
    unit: 'µg/Tag',
    durationRuleDe: '> 200 µg/Tag dauerhaft',
    durationRuleEn: '> 200 µg/day chronic sustained intake',
    riskDe: 'Chronische Selenose: Haarausfall, brüchige Nägel (Dystrophie), Knoblauchatem, Polyneuropathie.',
    riskEn: 'Chronic selenosis: alopecia, nail dystrophy, garlic odor on breath, peripheral paresthesia.'
  },
  {
    nutrientId: 'zinc',
    nameDe: 'Zink',
    nameEn: 'Zinc',
    efsaUpperLimit: '25 mg / Tag',
    warnThresholdValue: 25,
    unit: 'mg/Tag',
    durationRuleDe: '> 25 mg/Tag über mehr als 30 Tage',
    durationRuleEn: '> 25 mg/day sustained past 30 days',
    riskDe: 'Induzierter sekundärer Kupfermangel via intestinale Metallothionein-Sättigung, Dyslipidämie, Immunsuppression.',
    riskEn: 'Secondary copper deficiency via mucosal metallothionein trapping, dyslipidemia, immune suppression.'
  },
  {
    nutrientId: 'vitamin-d3',
    nameDe: 'Vitamin D3',
    nameEn: 'Vitamin D3',
    efsaUpperLimit: '4.000 IE / Tag',
    warnThresholdValue: 4000,
    unit: 'IE/Tag',
    durationRuleDe: '> 4.000 IE/Tag ohne regelmäßige 25(OH)D3- und Calcium-Serumkontrolle',
    durationRuleEn: '> 4,000 IU/day without regular serum calcidiol & ionized calcium labs',
    riskDe: 'Hypercalcämie, Kalzinose (Gefäß- und Nierenverkalkung), Nephrolithiasis.',
    riskEn: 'Hypercalcemia, metastatic soft tissue calcification, nephrolithiasis.'
  }
];
