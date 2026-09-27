import { MedicationType } from '../types';

export interface MedicationMetadata {
  id: MedicationType;
  nameDe: string;
  nameEn: string;
  tradeNames: string;
  category:
    | 'ADHD_STIMULANT'
    | 'ADHD_NON_STIMULANT'
    | 'ANTIDEPRESSANT'
    | 'MOOD_STABILIZER'
    | 'CHRONOBIOLOGY'
    | 'SUPPLEMENT_HORMONE'
    | 'OTHER';
  categoryLabelDe: string;
  categoryLabelEn: string;
  defaultDosage: string;
  mechanismDe: string;
  mechanismEn: string;
  kineticInstructionsDe: string;
  kineticInstructionsEn: string;
  dietaryInteractionsDe: string[];
}

export const MEDICATION_DATABASE: MedicationMetadata[] = [
  {
    id: 'METHYLPHENIDATE',
    nameDe: 'Methylphenidat (MPH)',
    nameEn: 'Methylphenidate (MPH)',
    tradeNames: 'Medikinet adult, Ritalin adult, Concerta, Equasym',
    category: 'ADHD_STIMULANT',
    categoryLabelDe: 'ADHS-Stimulanzien',
    categoryLabelEn: 'ADHD Stimulants',
    defaultDosage: '20mg',
    mechanismDe:
      'Dopamin- und Noradrenalin-Wiederaufnahmehemmer (NDRI / DAT-Blocker) im präfrontalen Kortex und Striatum.',
    mechanismEn:
      'Dopamine and norepinephrine reuptake inhibitor (DAT & NET blocker) in prefrontal cortex.',
    kineticInstructionsDe:
      'Wichtig für Medikinet: Immer zu oder direkt nach einem festen Frühstück mit mindestens 15g Protein und 8g Fett einnehmen, um unkontrolliertes Anfluten (Dose Dumping) und Rebound-Crashes zu dämpfen.',
    kineticInstructionsEn:
      'Take with or right after a solid breakfast (>=15g protein, >=8g fat) to buffer kinetic release and prevent severe rebound crashes.',
    dietaryInteractionsDe: [
      'Mindestens 90–120 Minuten Abstand zu Vitamin C / Fruchtsäuren einhalten (vermeidet vorzeitige renale Ausscheidung).',
      'Keine Nüchterneinnahme bei Medikinet adult.',
      'Hydratation & Elektrolyte (Kalium, Natrium) im Blick behalten.'
    ]
  },
  {
    id: 'LISDEXAMFETAMINE',
    nameDe: 'Lisdexamfetamin (LDX)',
    nameEn: 'Lisdexamfetamine (LDX)',
    tradeNames: 'Elvanse adult, Vyvanse, Attentin (D-Amphetamin)',
    category: 'ADHD_STIMULANT',
    categoryLabelDe: 'ADHS-Stimulanzien',
    categoryLabelEn: 'ADHD Stimulants',
    defaultDosage: '30mg',
    mechanismDe:
      'Prodrug von D-Amphetamin. Wird enzymatisch an Erythrozyten durch Spaltung der L-Lysin-Bindung kontinuierlich freigesetzt.',
    mechanismEn:
      'D-amphetamine prodrug enzymatically cleaved in erythrocytes, providing stable extended pharmacokinetics.',
    kineticInstructionsDe:
      'Kann nüchtern oder mit dem Essen eingenommen werden. Eine proteinreiche Mahlzeit stabilisiert den Neurotransmitter-Nachschub den Tag über.',
    kineticInstructionsEn:
      'Can be taken with or without food. Protein-rich meals support sustained catecholamine substrate synthesis.',
    dietaryInteractionsDe: [
      'Ascorbinsäure (Vitamin C) und säurehaltige Getränke ansäuernd: beschleunigen die renale D-Amphetamin-Clearance.',
      'Magnesium-Zufuhr abends kann motorische Anspannung dämpfen.',
      'Ausreichende Wasserzufuhr gegen Mundtrockenheit und Appetitsuppression.'
    ]
  },
  {
    id: 'ATOMOXETINE',
    nameDe: 'Atomoxetin',
    nameEn: 'Atomoxetine',
    tradeNames: 'Strattera',
    category: 'ADHD_NON_STIMULANT',
    categoryLabelDe: 'ADHS Nicht-Stimulanzien',
    categoryLabelEn: 'ADHD Non-Stimulants',
    defaultDosage: '40mg',
    mechanismDe:
      'Selektiver Noradrenalin-Wiederaufnahmehemmer (SNRI) mit sekundärer Dopaminerhöhung im präfrontalen Kortex.',
    mechanismEn:
      'Selective norepinephrine reuptake inhibitor (NET blocker) with prefrontal dopamine elevation.',
    kineticInstructionsDe:
      'Unbedingt mit einer vollwertigen Mahlzeit einnehmen, um gastrointestinale Beschwerden (Übelkeit, Magenreizung) zu minimieren.',
    kineticInstructionsEn:
      'Administer strictly with a complete meal to minimize gastrointestinal discomfort and nausea.',
    dietaryInteractionsDe: [
      'Gleichzeitige Nahrungsaufnahme dämpft gastrointestinale Peaks.',
      'Vermeidung von Johanniskraut (CYP2D6-Metabolisierungsinteraktion).'
    ]
  },
  {
    id: 'GUANFACINE',
    nameDe: 'Guanfacin',
    nameEn: 'Guanfacine',
    tradeNames: 'Intuniv (retardiert)',
    category: 'ADHD_NON_STIMULANT',
    categoryLabelDe: 'ADHS Nicht-Stimulanzien',
    categoryLabelEn: 'ADHD Non-Stimulants',
    defaultDosage: '2mg',
    mechanismDe:
      'Selektiver Alpha-2A-Adrenozeptor-Agonist. Stärkt den präfrontalen Netzwerkfokus und moduliert Rejection Sensitive Dysphoria (RSD).',
    mechanismEn:
      'Selective alpha-2A adrenergic receptor agonist enhancing prefrontal cortical signal-to-noise ratio.',
    kineticInstructionsDe:
      'Meist abends eingenommen wegen sedierender Komponente. Nicht mit extrem fettreichen Mahlzeiten kombinieren (erhöht Cmax drastisch).',
    kineticInstructionsEn:
      'Typically taken in the evening due to sedation. Avoid excessively high-fat meals (substantially increases Cmax).',
    dietaryInteractionsDe: [
      'Vermeidung von Grapefruitsaft (CYP3A4-Hemmung).',
      'Flüssigkeits- und Elektrolythaushalt stabil halten (Blutdrucksenkung).'
    ]
  },
  {
    id: 'BUPROPION',
    nameDe: 'Bupropion',
    nameEn: 'Bupropion',
    tradeNames: 'Wellbutrin, Elontril',
    category: 'ADHD_NON_STIMULANT',
    categoryLabelDe: 'ADHS Nicht-Stimulanzien / NDRI',
    categoryLabelEn: 'ADHD Non-Stimulants / NDRI',
    defaultDosage: '150mg',
    mechanismDe:
      'Noradrenalin- und Dopamin-Wiederaufnahmehemmer (NDRI) sowie Antagonist an nikotinergen Acetylcholinrezeptoren.',
    mechanismEn:
      'Norepinephrine-dopamine reuptake inhibitor (NDRI) and nicotinic acetylcholine receptor antagonist.',
    kineticInstructionsDe:
      'Morgens als Retardtablette unzerkaut mit Flüssigkeit einnehmen. Nicht abends einnehmen (starke Einschlafverzögerung).',
    kineticInstructionsEn:
      'Take in the morning whole. Avoid evening administration due to activating chronobiological effects.',
    dietaryInteractionsDe: [
      'Vorsicht bei übermäßigem Koffeinkonsum (senkt Krampfschwelle, erhöht Agitiertheit).',
      'Alkoholabbau und Neurotoxizitäts-Sensitivität beachten.'
    ]
  },
  {
    id: 'SSRI',
    nameDe: 'SSRI (Serotonin-Wiederaufnahmehemmer)',
    nameEn: 'SSRI (Selective Serotonin Reuptake Inhibitor)',
    tradeNames: 'Sertralin, Escitalopram, Citalopram, Fluoxetin, Paroxetin',
    category: 'ANTIDEPRESSANT',
    categoryLabelDe: 'Antidepressiva & Neuro-Modulatoren',
    categoryLabelEn: 'Antidepressants & Neuro-Modulators',
    defaultDosage: '50mg',
    mechanismDe:
      'Selektive Blockade des Serotonin-Transporters (SERT), Erhöhung des synaptischen Serotoninspiegels.',
    mechanismEn:
      'Selective blockade of serotonin transporter (SERT) increasing synaptic serotonin neurotransmission.',
    kineticInstructionsDe:
      'Konstante tägliche Einnahme zur gleichen Tageszeit (oft morgens mit dem Frühstück zur Magenverträglichkeit).',
    kineticInstructionsEn:
      'Consistent daily dosing at the same time, preferably with breakfast for gastric tolerability.',
    dietaryInteractionsDe: [
      'STRENGSTE KONTRAINDIKATION: Keine Serotonin-Vorstufen (5-HTP, L-Tryptophan) und kein Johanniskraut/SAMe (Lebensgefahr durch Serotonin-Syndrom).',
      'Omega-3 Dosierungen über 2.000 mg EPA/DHA ärztlich abklären (Thrombozytenfunktion).'
    ]
  },
  {
    id: 'SNRI',
    nameDe: 'SNRI (Serotonin-Noradrenalin-Wiederaufnahmehemmer)',
    nameEn: 'SNRI (Serotonin-Norepinephrine Reuptake Inhibitor)',
    tradeNames: 'Venlafaxin, Duloxetin',
    category: 'ANTIDEPRESSANT',
    categoryLabelDe: 'Antidepressiva & Neuro-Modulatoren',
    categoryLabelEn: 'Antidepressants & Neuro-Modulators',
    defaultDosage: '75mg',
    mechanismDe:
      'Duale Wiederaufnahmehemmung von Serotonin (SERT) und Noradrenalin (NET).',
    mechanismEn:
      'Dual reuptake inhibition of serotonin and norepinephrine.',
    kineticInstructionsDe:
      'Immer mit einer Mahlzeit einnehmen, um anfängliche Übelkeit zu verhindern.',
    kineticInstructionsEn:
      'Always take with food to minimize nausea.',
    dietaryInteractionsDe: [
      'STRENGSTE KONTRAINDIKATION: Kein 5-HTP, kein Tryptophan, kein Johanniskraut (Serotonin-Syndrom).',
      'Blutdruck- und Hydratationsmonitoring.'
    ]
  },
  {
    id: 'LAMOTRIGINE',
    nameDe: 'Lamotrigin',
    nameEn: 'Lamotrigine',
    tradeNames: 'Lamictal',
    category: 'MOOD_STABILIZER',
    categoryLabelDe: 'Stimmungsstabilisatoren',
    categoryLabelEn: 'Mood Stabilizers',
    defaultDosage: '100mg',
    mechanismDe:
      'Blockade spannungsabhängiger Natrium-Kanäle und Dämpfung pathologischer präsynaptischer Glutamat-Freisetzung.',
    mechanismEn:
      'Voltage-gated sodium channel inhibitor suppressing presynaptic glutamate overdrive.',
    kineticInstructionsDe:
      'Regelmäßige Einnahme morgens oder in geteilter Dosis.',
    kineticInstructionsEn:
      'Consistent administration once or twice daily.',
    dietaryInteractionsDe: [
      'Ausreichende Folsäure- und B-Vitamin-Versorgung sicherstellen.',
      'Hautveränderungen (Exanthem-Monitoring) beachten.'
    ]
  },
  {
    id: 'MELATONIN',
    nameDe: 'Melatonin',
    nameEn: 'Melatonin',
    tradeNames: 'Circadin (retardiert), Melatonin Tropfen / Kapseln',
    category: 'CHRONOBIOLOGY',
    categoryLabelDe: 'Schlaf & Chronobiologie',
    categoryLabelEn: 'Sleep & Chronobiology',
    defaultDosage: '2mg',
    mechanismDe:
      'Aktivierung der MT1- und MT2-Rezeptoren im suprachiasmatischen Nukleus (SCN); Phasenverschiebung des zirkadianen Rhythmus.',
    mechanismEn:
      'Activates MT1/MT2 receptors in suprachiasmatic nucleus; modulates circadian phase shift.',
    kineticInstructionsDe:
      'Chronobiologisches Timing: 30 bis 60 Minuten vor dem gewünschten Einschlafen bei gedimmtem Licht einnehmen.',
    kineticInstructionsEn:
      'Chronobiological timing: 30 to 60 minutes prior to intended bedtime under dim lighting.',
    dietaryInteractionsDe: [
      'Keine koffeinhaltigen Getränke oder Blaulichtexposition nach der Einnahme.',
      'Synergie mit Magnesium-Bisglycinat am Abend.'
    ]
  },
  {
    id: 'IRON_SUPPLEMENT',
    nameDe: 'Eisen-Präparat (Fe2+ / Fe3+)',
    nameEn: 'Iron Supplement (Fe2+ / Fe3+)',
    tradeNames: 'Ferro Sanol duodenal, Eisenchelat, Floradix',
    category: 'SUPPLEMENT_HORMONE',
    categoryLabelDe: 'Supplemente & Mineralstoffe',
    categoryLabelEn: 'Supplements & Minerals',
    defaultDosage: '50mg',
    mechanismDe:
      'Erhöhung der Serum-Eisen- und Ferritin-Werte; Kofaktor für die Tyrosin-Hydroxylase (Dopamin-Rate-Limiting Enzyme).',
    mechanismEn:
      'Replenishes systemic ferritin; crucial cofactor for tyrosine hydroxylase in dopamine biosynthesis.',
    kineticInstructionsDe:
      'Optimal nüchtern morgens oder 2 Stunden vor einer Mahlzeit mit Vitamin C (z. B. Orangensaft oder Ascorbinsäure).',
    kineticInstructionsEn:
      'Best absorbed in fasting state with Vitamin C; maximize acidic gastric environment.',
    dietaryInteractionsDe: [
      'STRIKT: Mindestens 2 Stunden Abstand zu Kaffee, schwarzem/grünem Tee (Tannine) und Milchprodukten (Calcium).',
      'Keine zeitgleiche Gabe mit Zink- oder Calcium-Supplements (DMT1-Transporter-Konkurrenz).'
    ]
  },
  {
    id: 'MAGNESIUM_SUPPLEMENT',
    nameDe: 'Magnesium (Bisglycinat / Malat / Citrat)',
    nameEn: 'Magnesium (Bisglycinate / Malate / Citrate)',
    tradeNames: 'Magnesium-Chelat, Magnesium-L-Threonat',
    category: 'SUPPLEMENT_HORMONE',
    categoryLabelDe: 'Supplemente & Mineralstoffe',
    categoryLabelEn: 'Supplements & Minerals',
    defaultDosage: '300mg',
    mechanismDe:
      'Physiologischer NMDA-Rezeptor-Blocker, Kofaktor für über 300 enzymatische Reaktionen, Neuroprotektion.',
    mechanismEn:
      'Physiological NMDA receptor blocker, cofactor for >300 enzymatic reactions.',
    kineticInstructionsDe:
      'Morgens: Malat für Mitochondrien & Energie. Abends: Bisglycinat für GABAerge Dämpfung und Schlafqualität.',
    kineticInstructionsEn:
      'Morning: Malate for ATP support. Evening: Glycinate for GABAergic relaxation and sleep architecture.',
    dietaryInteractionsDe: [
      'Nicht in Mega-Einzeldosen mit hochdosiertem Zink oder Eisen mischen.',
      'Gute Verträglichkeit mit einer leichten Mahlzeit.'
    ]
  },
  {
    id: 'THYROID_HORMONE',
    nameDe: 'L-Thyroxin (Schilddrüsenhormon T4)',
    nameEn: 'Levothyroxine (Thyroid Hormone T4)',
    tradeNames: 'L-Thyroxin Henning, Euthyrox',
    category: 'SUPPLEMENT_HORMONE',
    categoryLabelDe: 'Hormone & Schilddrüse',
    categoryLabelEn: 'Hormones & Thyroid',
    defaultDosage: '75µg',
    mechanismDe:
      'Substituiert endogenes L-Thyroxin (T4), wird peripher in aktives T3 konvertiert.',
    mechanismEn:
      'Exogenous synthetic T4, converted peripherally to active T3 supporting metabolic rate.',
    kineticInstructionsDe:
      'Strikte Nüchterneinnahme: Morgens mindestens 30 bis 60 Minuten vor dem Frühstück nur mit einem Glas reinem Wasser einnehmen.',
    kineticInstructionsEn:
      'Strict fasting rule: Take in morning >=30-60 min before breakfast with plain water only.',
    dietaryInteractionsDe: [
      'Kein Kaffee innerhalb von 30-45 Minuten nach Einnahme.',
      'Mindestens 4 Stunden zeitlicher Abstand zu Eisen- und Calcium-Präparaten sowie Sojaprodukten.'
    ]
  },
  {
    id: 'OTHER',
    nameDe: 'Sonstige / Freitext-Medikation',
    nameEn: 'Other / Custom Medication',
    tradeNames: 'Individuelle Verordnung',
    category: 'OTHER',
    categoryLabelDe: 'Sonstige',
    categoryLabelEn: 'Other',
    defaultDosage: '1x tgl.',
    mechanismDe: 'Individuell verordnete Medikation.',
    mechanismEn: 'Individually prescribed pharmacotherapy.',
    kineticInstructionsDe: 'Gemäß ärztlicher Verordnung einnehmen.',
    kineticInstructionsEn: 'Take as prescribed by medical professional.',
    dietaryInteractionsDe: ['Interaktionen bei Bedarf mit dem Arzt abklären.']
  }
];

export function getMedicationMetadata(type: MedicationType): MedicationMetadata | undefined {
  return MEDICATION_DATABASE.find((m) => m.id === type);
}
