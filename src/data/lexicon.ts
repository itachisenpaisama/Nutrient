import { NutrientLexiconEntry } from '../types';

export const NUTRIENT_LEXICON: NutrientLexiconEntry[] = [
  {
    id: 'protein',
    titleDe: 'Proteine (Eiweiß) & Aminosäuren',
    titleEn: 'Proteins & Amino Acids',
    category: 'macronutrient',
    tagsDe: ['Muskelaufbau', 'Dopamin-Baustein', 'Sättigung', 'Blutzucker'],
    tagsEn: ['Muscle Synthesis', 'Dopamine Building Block', 'Satiety', 'Blood Sugar'],
    laymanDe: 'Proteine sind die universellen Bausteine deines Körpers. Sie reparieren Gewebe, bauen Muskeln auf und liefern das Material für deine Botenstoffe im Gehirn – also für die Stoffe, die dir Fokus, Antrieb und innere Ruhe verleihen. Ohne ausreichend Eiweiß fehlt deinem Körper das Werkzeug, um fit und mental leistungsfähig zu bleiben.',
    laymanEn: 'Proteins are your body\'s fundamental building blocks. They repair tissues, build muscle, and furnish raw materials for vital brain neurotransmitters—the chemicals granting you focus, motivation, and mental clarity. Without sufficient protein, your brain lacks the enzymatic substrate for daily mental resilience.',
    whyImportantDe: [
      'Struktur & Reparatur: Aufbau von Muskelmasse, Kollagen, Enzymen und Immunzellen.',
      'Neurotransmittersynthese: Bereitstellung essenzieller Aminosäuren-Precursor (L-Tyrosin für Dopamin/Noradrenalin, L-Tryptophan für Serotonin).',
      'Blutzucker-Glättung: Verlangsamt die Magenentleerung, verhindert steile Insulinspitzen und mindert Heißhunger sowie mentale Einbrüche (Rebound).'
    ],
    whyImportantEn: [
      'Structure & Cellular Repair: Muscle tissue, collagen, metabolic enzymes, and immunoglobulins.',
      'Neurotransmitter Synthesis: Supplies key amino acid precursors (L-Tyrosine for dopamine/noradrenaline, L-Tryptophan for serotonin).',
      'Glycemic Stability: Smooths postprandial glucose curves, curbing afternoon fatigue crashes and dopamine plunges.'
    ],
    intakeRecommendations: {
      standard: '1,2 – 1,6 g/kg Körpergewicht',
      adhd: '2,0 – 2,4 g/kg LBM (Schutz vor Katabolismus, Maximierung von Tyrosin-Vorstufen)',
      asd: '1,6 – 2,0 g/kg KG mit Schwerpunkt auf allergenarmen, leicht verdaulichen Quellen',
      upperLimit: 'Bis 3,0 g/kg KG bei gesunder Nierenfunktion unbedenklich'
    },
    sourcesDe: {
      animal: ['Eier aus Weidehaltung', 'Magerquark / Skyr', 'Hähnchenbrust', 'Wildlachs', 'Hüttenkäse', 'Rindfleisch aus Weidehaltung'],
      plant: ['Tofu', 'Tempeh', 'Linsen', 'Kichererbsen', 'Hanfsamen', 'Erbsenprotein-Isolat', 'Lupinenmehl']
    },
    sourcesEn: {
      animal: ['Pasture-raised eggs', 'Quark / Skyr / Greek yogurt', 'Chicken breast', 'Wild salmon', 'Cottage cheese', 'Grass-fed beef'],
      plant: ['Tofu', 'Tempeh', 'Lentils', 'Chickpeas', 'Hemp seeds', 'Pea protein isolate', 'Lupin flour']
    },
    tipsDe: [
      'Leucin-Schwelle beachten: Verteile die Dosis auf 3–4 Mahlzeiten mit jeweils mind. 3g Leucin (ca. 30g Protein), um die Muskelproteinsynthese (MPS) optimal zu triggern.',
      'Pflanzliche Kombinationen: Reis + Bohnen oder Hülsenfrüchte + Saaten kombinieren, um ein vollständiges Aminosäureprofil (PDCAAS = 1.0) zu erreichen.',
      'ADHD-Morgenroutine: Mindestens 20–25g Protein zum Frühstück stabilisieren den Vormittags-Dopaminspiegel signifikant.'
    ],
    tipsEn: [
      'Leucine Threshold: Distribute daily intake across 3–4 meals containing at least 3g leucine (~30g total protein) to reliably trigger mTORC1.',
      'Complementary Plant Proteins: Combine legumes with grains/seeds (e.g. beans + rice) to achieve a complete amino acid profile.',
      'ADHD Morning Protocol: Ingesting 20–25g protein at breakfast sustains morning tonic dopamine levels.'
    ],
    deepDiveDe: {
      biochemistry: 'Die Muskelproteinsynthese (MPS) wird primär durch die Phosphorylierung und Aktivierung des Enzymkomplexes mTORC1 (mechanistic Target of Rapamycin Complex 1) initiiert. L-Leucin fungiert hierbei als allosterischer Sensor über die zelluläre Bindung an Sestrin2, was zur Aktivierung der RAG-GTPasen führt und mTORC1 an die lysosomale Membran dirigiert.',
      neuroscience: 'Für die ZNS-Funktion ist L-Tyrosin der geschwindigkeitsbestimmende Faktor: Es passiert die Blut-Hirn-Schranke über den LAT1-Transporter (Large Neutral Amino Acid Transporter 1). Dort wird es durch die Tyrosin-Hydroxylase (TH) – unter strikter Abhängigkeit von Eisen (Fe2+), Vitamin C und Tetrahydrobiopterin (BH4) – zu L-DOPA und nachfolgend zu Dopamin umgesetzt. L-Cystein reguliert die Glutathionsynthese (GSH) zum Schutz vor neuronalem nitrosativem und oxidativem Stress.',
      receptorsTransporters: 'LAT1 (SLC7A5) Transporter an der Blut-Hirn-Schranke; Sestrin2/RAG-GTPasen an Lysosomen; mGAT1 & Dopamintransporter-Regulierung.'
    },
    deepDiveEn: {
      biochemistry: 'Muscle protein synthesis is initiated by activation of mTORC1. L-Leucine acts as an upstream nutrient switch via direct binding to Sestrin2, stimulating Rag GTPases and recruiting mTORC1 to the lysosomal surface for phosphorylation of p70S6K and 4E-BP1.',
      neuroscience: 'In neurobiology, L-Tyrosine crosses the blood-brain barrier via the LAT1 transporter (SLC7A5). Within dopaminergic neurons, tyrosine hydroxylase converts it into L-DOPA with mandatory cofactors Fe2+, ascorbic acid, and BH4. Concurrently, cysteine rate-limits glutathione (GSH) synthesis, shielding monoaminergic synapses from lipid peroxidation.',
      receptorsTransporters: 'LAT1 (SLC7A5), Sestrin2-GATOR2 pathway, VMAT2 vesicle packaging.'
    },
    scientificReferences: [
      'Volkow ND et al. (2018): Neurobiology of Attention Deficit Hyperactivity Disorder. Molecular Psychiatry.',
      'Phillips SM et al. (2016): Protein requirements beyond the RDA for physical performance. Appl Physiol Nutr Metab.',
      'Fernstrom JD (2013): Large neutral amino acids: dietary effects on brain neurochemistry. Am J Clin Nutr.'
    ]
  },
  {
    id: 'carbohydrates-fiber',
    titleDe: 'Kohlenhydrate & Ballaststoffe',
    titleEn: 'Carbohydrates & Prebiotic Fiber',
    category: 'macronutrient',
    tagsDe: ['Energie', 'Mikrobiom', 'Darm-Hirn-Achse', 'Kurzkettige Fettsäuren'],
    tagsEn: ['Energy', 'Microbiome', 'Gut-Brain Axis', 'Short Chain Fatty Acids'],
    laymanDe: 'Kohlenhydrate liefern deinen Gehirnzellen und roten Blutkörperchen den schnellsten und saubersten Brennstoff: Glukose. Ballaststoffe sind der wertvolle pflanzliche Anteil, den wir selbst nicht verdauen können – dafür ernähren sie Billionen nützlicher Darmbakterien, die daraus schützende Botenstoffe für dein Gehirn produzieren.',
    laymanEn: 'Carbohydrates provide your erythrocytes and brain neurons with their favored primary fuel: glucose. Fiber comprises complex plant starches we do not digest ourselves; instead, friendly gut flora ferment them into powerful anti-inflammatory compounds that safeguard the nervous system.',
    whyImportantDe: [
      'Glukoseversorgung: Das Gehirn verbraucht in Ruhe täglich ca. 120–130g Glukose als obligaten Brennstoff.',
      'SCFA-Produktion: Butyrat, Acetat und Propionat modulieren Entzündungen und stärken die Darmbarriere.',
      'Neurotransmittersynthese: Insulin-Ausstoß reguliert das Verhältnis von freiem Tryptophan zu konkurrierenden Aminosäuren und fördert die zentrale Serotoninbildung.'
    ],
    whyImportantEn: [
      'Obligate Brain Glucose: Neurons consume ~120-130g glucose per day under resting metabolic demands.',
      'SCFA Generation: Colonic fermentation yields butyrate, propionate, and acetate which protect the gut-brain barrier.',
      'Serotonergic Shunt: Moderate insulin releases promote peripheral muscle uptake of BCAAs, elevating the Tryptophan-to-LNAA plasma ratio.'
    ],
    intakeRecommendations: {
      standard: 'Mindestens 130 g/Tag verwertbare Kohlenhydrate; Ballaststoffe mind. 30 g/Tag',
      adhd: 'Komplexe, niedrig-glykämische Carbs (mind. 150g/Tag), um Insulinschwankungen und Dopaminlöcher zu verhindern',
      asd: '35 – 40 g/Tag prebiotische Ballaststoffe (Inulin, Pektin, resistente Stärke) für Mikrobiom-Diversität',
      upperLimit: 'Individuell je nach Kalorienbilanz; Sicherheits-Untergrenze: nicht unter 50 g/Tag wegen Schilddrüsen-T3-Umwandlung'
    },
    sourcesDe: {
      animal: ['Keine nennenswerten Quellen (außer Spuren in Leber / Glykogen)'],
      plant: ['Haferflocken', 'Quinoa', 'Süßkartoffeln', 'Topinambur (Inulin)', 'Grüne Bananen (resistente Stärke)', 'Zichorienwurzel', 'Äpfel (Pektin)', 'Hülsenfrüchte']
    },
    sourcesEn: {
      animal: ['Virtually none (trace amounts in organ liver tissue)'],
      plant: ['Rolled oats', 'Quinoa', 'Sweet potatoes', 'Jerusalem artichoke (inulin)', 'Green bananas (resistant starch)', 'Chicory root', 'Apples (pectin)', 'Lentils & beans']
    },
    tipsDe: [
      'Resistente Stärke Typ 3 Hack: Gekochte Kartoffeln oder Reis abkühlen lassen (12 Std. im Kühlschrank). Die Stärke kristallisiert zu resistenter Stärke um, senkt den GI um 40% und füttert direkt Butyrat-Bildner.',
      'Schonend steigern: Ballaststoffe bei empfindlichem Darm (ASD) wöchentlich nur um 3–5g erhöhen und immer mindestens 30ml Wasser pro Gramm Ballaststoff trinken.',
      'Sicherheits-Check: Extrem low carb (<50g) drosselt die Konvertierung von T4 in aktives T3 in der Leber!'
    ],
    tipsEn: [
      'Resistant Starch Retrogradation: Cook potatoes or rice, cool them 12h in the fridge. Retrograded starch feeds Faecalibacterium prausnitzii and lowers insulin impact.',
      'Gradual Fiber Titration: Increase fiber intake by 3–5g weekly while proportionally scaling water intake by 30-40ml per gram of fiber.',
      'Thyroid Safety: Prolonged restriction below 50g carbohydrates reduces hepatic 5\'-deiodinase activity, decreasing active free T3.'
    ],
    deepDiveDe: {
      biochemistry: 'Glykämischer Index (GI) und glykämische Last (GL) steuern die Kinetik der Insulinsekretion. GLUT3 vermittelt die insulinoffene neuronale Glukoseaufnahme. Im Kolon fermentieren anaerobe Taxa (Bifidobacterium spp., Faecalibacterium prausnitzii) Ballaststoffe zu kurzkettigen Fettsäuren (SCFAs).',
      neuroscience: 'Butyrat fungiert als endogener Histon-Deacetylase-Inhibitor (HDACi), dereprimiert neuroprotektive Gene (BDNF, GDNF) und induziert Tight-Junction-Proteine (Claudin-5, Occludin, ZO-1), was die Durchlässigkeit der Darm- und Blut-Hirn-Schranke ("Leaky Gut / Leaky Brain") drastisch senkt.',
      receptorsTransporters: 'GLUT3, GLUT1, FFAR2 (GPR43), FFAR3 (GPR41) Rezeptoren für SCFAs am enterischen Nervensystem.'
    },
    deepDiveEn: {
      biochemistry: 'Colonic microbes convert non-starch polysaccharides into acetate, propionate, and butyrate. Butyrate serves as the chief fuel for colonocytes and regulates chromatin remodeling through epigenetic inhibition of histone deacetylases (HDACs).',
      neuroscience: 'SCFAs signal through monocarboxylate transporters and vagal nerve afferents to bolster blood-brain barrier tight junctions (Claudin-5, Occludin) and enhance neuroplasticity factors (BDNF).',
      receptorsTransporters: 'SLC16A1 (MCT1), GPR41/43 (FFAR3/2), enterocyte sodium-glucose transporters.'
    },
    scientificReferences: [
      'Cryan JF et al. (2019): The Microbiota-Gut-Brain Axis. Physiological Reviews.',
      'Stilling RM et al. (2016): The neuropharmacology of butyrate: The bread and butter of the microbiota-gut-brain axis? Neurochem Int.',
      'Sampson TR et al. (2020): Gut microbiota regulate motor deficits and neuroinflammation. Cell.'
    ]
  },
  {
    id: 'fats-omega3',
    titleDe: 'Fette & Omega-3 (EPA / DHA)',
    titleEn: 'Fats & Omega-3 Fatty Acids (EPA / DHA)',
    category: 'macronutrient',
    tagsDe: ['Membranfluidität', 'Anti-Inflammation', 'Dopamin-Rezeptoren', 'Resolvine'],
    tagsEn: ['Membrane Fluidity', 'Anti-Inflammation', 'Dopamine Receptors', 'Resolvins'],
    laymanDe: 'Fette sind kein bloßer Brennwert, sondern das fundamentale Baumaterial deiner Gehirnarchitektur. Dein Gehirn besteht trocken zu 60% aus Fett. Marine Omega-3-Fettsäuren (EPA & DHA) wirken wie ein flüssiges Schutzschild: Sie halten die Hüllen deiner Nervenzellen flexibel und schalten stille Entzündungen im ZNS ab.',
    laymanEn: 'Fats are structural architecture rather than mere calories. Over 60% of the dry weight of your brain is lipid matrix. Marine omega-3 polyunsaturated fatty acids (EPA and DHA) form a fluidic shield, maintaining supple neuronal membranes and resolving silent neuroinflammation.',
    whyImportantDe: [
      'Hormonsynthese: Essenzielle Basis für Steroidhormone (Testosteron, Östrogen, Progesteron, Cortisol).',
      'Neurorezeptor-Sensitivität: DHA macht Zellmembranen geschmeidig, sodass Dopamin- und Serotoninrezeptoren optimal andocken.',
      'Anti-Inflammation: EPA verdrängt Arachidonsäure und bildet gewebeschützende Resolvine und Protectine.'
    ],
    whyImportantEn: [
      'Steroidogenesis: Indispensable substrate for testosterone, estrogen, cortisol, and cellular bile salts.',
      'Synaptosomal Fluidity: DHA incorporation improves the conformational flexibility of dopamine D2 and 5-HT1A receptors.',
      'Resolution of Inflammation: EPA outcompetes arachidonic acid to yield pro-resolving mediators (Resolvins, Protectins).'
    ],
    intakeRecommendations: {
      standard: 'Gesamtfett: 0,8 – 1,2 g/kg KG; Omega-3: mind. 1.000 mg kombiniertes EPA/DHA täglich',
      adhd: '1.500 – 2.000 mg EPA/DHA pro Tag mit hohem EPA-Anteil (EPA:DHA Verhältnis mind. 2:1, ideal 3:1)',
      asd: '1.200 – 1.800 mg EPA/DHA mit Schwerpunkt auf hochgereinigtem Algen- oder Wildfischöl',
      upperLimit: 'EFSA empfiehlt bis zu 5.000 mg EPA/DHA als sicher; ab 2.000 mg Blutungszeit mit Arzt prüfen'
    },
    sourcesDe: {
      animal: ['Wildlachs aus Alaska', 'Atlantische Makrele', 'Hering', 'Sardinen', 'Wildfang-Garnelen'],
      plant: ['Algenöl (Schizochytrium sp. - direktes EPA/DHA!)', 'Leinöl (nur ALA Vorstufe)', 'Walnüsse', 'Avocados', 'Kaltgepresstes Olivenöl']
    },
    sourcesEn: {
      animal: ['Wild Alaskan salmon', 'Atlantic mackerel', 'Herring', 'Sardines', 'Wild-caught anchovies'],
      plant: ['Algae oil (Schizochytrium - bioidentical EPA/DHA)', 'Flaxseed oil (ALA precursor only)', 'Walnuts', 'Avocados', 'Extra virgin olive oil']
    },
    tipsDe: [
      'Gallen-Booster: Omega-3 immer zu einer fettigen Hauptmahlzeit einnehmen. Das regt Gallensäuren und Pankreaslipase an und steigert die Aufnahme um das bis zu 3-fache!',
      'TOTOX-Check: Kaufe nur Öle mit zertifiziertem TOTOX-Wert unter 10, um oxidierte, entzündungsfördernde Fette zu vermeiden.',
      'ALA-Falle: Pflanzliches Leinöl liefert nur ALA. Der menschliche Körper konvertiert weniger als 5% in EPA und unter 0,5% in DHA! Veganer sollten auf Algenöl setzen.'
    ],
    tipsEn: [
      'Lipid Co-Ingestion: Ingest omega-3 supplements alongside a fat-containing meal to trigger cholecystokinin, boosting bioavailability threefold.',
      'TOTOX Freshness Metric: Choose products verified with a TOTOX value <10 to avoid consuming pro-oxidant peroxides.',
      'The ALA Conversion Trap: Human conversion of plant ALA to DHA is less than 0.5%. Plant-based diets require direct algal EPA/DHA.'
    ],
    deepDiveDe: {
      biochemistry: 'EPA und DHA werden kompetitiv in die sn-2 Position von Phospholipiden eingebaut. EPA konkurriert direkt mit Arachidonsäure (AA) um das Enzym Phospholipase A2 (PLA2) sowie COX-2 und 5-LOX. Statt proinflammatorischer Eicosanoide (PGE2, LTB4) entstehen spezialisierte pro-resolvierende Mediatoren (SPMs: Resolvine RvE1-3, Neuroprotectin D1).',
      neuroscience: 'DHA reichert sich in Synaptosomen und Lipid Rafts an. Dies optimiert die G-Protein-Kopplung von Dopamin-D2- und 5-HT1A-Rezeptoren. Klinische Meta-Analysen zeigen eine signifikante Reduktion von Impulsivität und emotionaler Dysregulation bei ADHS, sobald der Omega-3-Index im Erythrozyten über 8% ansteigt.',
      receptorsTransporters: 'MFSD2A Transporter für lysophosphatidylcholine-DHA über die Blut-Hirn-Schranke, PPAR-alpha, GPR120.'
    },
    deepDiveEn: {
      biochemistry: 'EPA and DHA displace arachidonic acid in membrane phospholipids. This shifts the enzymatic cascade away from inflammatory series-2 prostaglandins and series-4 leukotrienes toward specialized pro-resolving mediators (RvE1, RvD1, NPD1).',
      neuroscience: 'DHA modulates lipid raft curvature, promoting rapid vesicular exocytosis and neurotransmitter ligand binding in striatal and prefrontal circuits. An erythrocyte omega-3 index >8% correlates with reduced inattention.',
      receptorsTransporters: 'MFSD2A transporter at brain microvascular endothelial cells, Free Fatty Acid Receptor 4 (FFA4/GPR120).'
    },
    scientificReferences: [
      'Chang JP et al. (2019): High-dose eicosapentaenoic acid (EPA) in ADHD. Transl Psychiatry.',
      'Bazinet RP & Laye S (2014): Polyunsaturated fatty acids and brain function. Nat Rev Neurosci.',
      'Serhan CN (2014): Pro-resolving lipid mediators are leads for resolution physiology. Nature.'
    ]
  },
  {
    id: 'vitamin-b6',
    titleDe: 'Vitamin B6 (Pyridoxal-5-Phosphat / P5P)',
    titleEn: 'Vitamin B6 (Pyridoxal-5-Phosphate / P5P)',
    category: 'neuro-vitamin',
    tagsDe: ['Dopamin-Kofaktor', 'Serotonin', 'GABA', 'Homocystein'],
    tagsEn: ['Dopamine Cofactor', 'Serotonin', 'GABA', 'Homocysteine'],
    laymanDe: 'Vitamin B6 ist das biochemische Schweizer Taschenmesser für dein Gehirn. Es aktiviert genau die Enzyme, die aus deinen Nahrungs-Proteinen deine wichtigsten Botenstoffe bauen: Dopamin für deinen Fokus, Serotonin für gute Laune und GABA für Entspannung. Fehlt dir B6, stauen sich die Vorstufen und dein Gehirn läuft heiß.',
    laymanEn: 'Vitamin B6 is the biochemical master key of neurochemistry. It powers the specific enzymes transforming dietary amino acids into active neurotransmitters: dopamine for focus, serotonin for mood, and calming GABA for neural relaxation. Without B6, neurotransmitter pathways stall.',
    whyImportantDe: [
      'Dopaminsynthese: Unverzichtbare prosthetische Gruppe der AADC zur Umwandlung von L-DOPA in Dopamin.',
      'GABA-Produktion: Kofaktor der Glutamat-Decarboxylase (GAD) – verwandelt das übererregende Glutamat in beruhigendes GABA.',
      'Homocystein-Clearance: Beteiligt am Transsulfurierungsweg zu Cystathionin und Taurin.'
    ],
    whyImportantEn: [
      'Monoamine Decarboxylation: Essential cofactor for aromatic L-amino acid decarboxylase (AADC) converting L-DOPA to active dopamine.',
      'Glutamate-to-GABA Shunt: Activates GAD, converting neuro-excitatory glutamate into inhibitory, anxiety-reducing GABA.',
      'Homocysteine Breakdown: Catalyzes transsulfuration pathway into cystathionine, glutathione, and taurine.'
    ],
    intakeRecommendations: {
      standard: '1,4 – 1,6 mg/Tag (D-A-CH)',
      adhd: '5,0 – 10,0 mg/Tag (bevorzugt in der bioaktiven Coenzymform P5P)',
      asd: '5,0 – 10,0 mg/Tag P5P (oft kombiniert mit Magnesium zur Reduktion von Reizüberflutung)',
      upperLimit: 'EFSA UL: 12 mg/Tag; Toxizitätswarnung bei Pyridoxin-HCl über 25–50 mg/Tag'
    },
    sourcesDe: {
      animal: ['Hühnerbrust', 'Rinderleber', 'Wildlachs', 'Thunfisch'],
      plant: ['Bananen', 'Kartoffeln mit Schale', 'Walnüsse', 'Kichererbsen', 'Sonnenblumenkerne']
    },
    sourcesEn: {
      animal: ['Chicken breast', 'Beef liver', 'Wild salmon', 'Tuna steak'],
      plant: ['Bananas', 'Russet potatoes', 'Walnuts', 'Chickpeas', 'Sunflower seeds']
    },
    tipsDe: [
      'Immer P5P wählen: Herkömmliches Pyridoxin-HCl muss in der Leber erst enzymatisch phosphoryliert werden. Bei MTHFR- oder Lebereinschränkungen blockiert Pyridoxin-HCl sogar P5P-Rezeptoren!',
      'Vorsicht vor Hochdosis-Neuropathie: Chronische Dosen >50 mg Pyridoxin-HCl können periphere sensorische Nervenschäden verursachen.',
      'Synergie mit Magnesium: P5P und Magnesium verstärken sich gegenseitig bei der Aktivierung der GAD im Gehirn.'
    ],
    tipsEn: [
      'Prefer Active P5P: Standard pyridoxine HCl requires hepatic phosphorylation. High unphosphorylated pyridoxine can paradoxically antagonize intracellular P5P receptors.',
      'Neuropathy Warning: Prolonged synthetic pyridoxine HCl exceeding 50mg/day poses risk of sensory axonopathy.',
      'Magnesium Synergy: P5P functions synergistically with intracellular Mg2+ to stimulate glutamate decarboxylation.'
    ],
    deepDiveDe: {
      biochemistry: 'Pyridoxal-5-Phosphat (P5P) bildet mit Transaminasen und Decarboxylasen eine Schiffsche Base über einen internen Aldimin-Komplex mit Lysin-Resten. Es ist der Kofaktor der AADC (Aromatische L-Aminosäure-Decarboxylase) und der Kynureninase.',
      neuroscience: 'Die Glutamat-Decarboxylase (GAD65/GAD67) benötigt P5P. Fehlt bioaktives B6, kommt es zur Akkumulation von Glutamat im synaptischen Spalt mit folglicher NMDA-Rezeptor-Übererregung, Neuroinflammation und Excitotoxizität.',
      receptorsTransporters: 'Alkalische Phosphatase zur Dephosphorylierung für Zellmembranpassage, Pyridoxalkinase (PDXK).'
    },
    deepDiveEn: {
      biochemistry: 'P5P forms an internal aldimine Schiff base with active-site lysine residues in PLP-dependent enzymes. It acts as an electron sink, stabilizing carbanion intermediates during decarboxylation of amino acids.',
      neuroscience: 'Insufficient P5P impairs GAD enzymatic kinetics, disrupting the physiological GABA/glutamate excitation-inhibition equilibrium toward hyperactivity and sensory overload.',
      receptorsTransporters: 'Tissue-nonspecific alkaline phosphatase (TNAP), intracellular pyridoxal kinase (PDXK).'
    },
    scientificReferences: [
      'Goyal D et al. (2020): Vitamin B6 and its role in neurodevelopmental disorders. Neurochem Res.',
      'McCully KS (2015): The one-carbon homocysteine cycle in vascular and neurodegenerative disease. Exp Biol Med.'
    ]
  },
  {
    id: 'vitamin-b9-b12',
    titleDe: 'Vitamin B9 (Folat) & B12 (Cobalamin)',
    titleEn: 'Vitamin B9 (Folate) & B12 (Cobalamin)',
    category: 'neuro-vitamin',
    tagsDe: ['Methylierung', 'SAMe', 'MTHFR', 'Myelinscheiden', 'Homocystein'],
    tagsEn: ['Methylation', 'SAMe', 'MTHFR', 'Myelin Sheaths', 'Homocysteine'],
    laymanDe: 'Folat und Vitamin B12 sind das unzertrennliche Handwerker-Duo deiner Genetik. Sie betreiben den sogenannten Ein-Kohlenstoff-Zyklus: Sie stellen Methylgruppen her, mit denen deine Gene an- und ausgeschaltet werden, schützen deine Nervenkabel mit einer Isolierschicht (Myelin) und bauen Gefäßgifte wie Homocystein rasch ab.',
    laymanEn: 'Folate and Vitamin B12 are the tandem architects of your epigenetic machinery. They drive the one-carbon methylation cycle: donating methyl caps to activate or silence DNA, insulating nerve axons with protective myelin sheath, and purging vascular neurotoxins like homocysteine.',
    whyImportantDe: [
      'SAMe-Produktion: Bereitstellung von Methylgruppen für die COMT- und PNMT-Enzyme zum Dopamin- und Adrenalin-Management.',
      'Myelinscheiden: Erhalt der neuronalen Isolierschicht für reibungslose Nervenleitgeschwindigkeit.',
      'Blutbildung & DNA-Synthese: Reifung von Erythrozyten zur Vermeidung megaloblastärer Anämie und chronischer Erschöpfung.'
    ],
    whyImportantEn: [
      'SAMe Synthesis: Universal methyl donor for catechol-O-methyltransferase (COMT), fine-tuning prefrontal dopamine tone.',
      'Axonal Myelination: Essential for maintaining the lipid sheath insulating central nervous motor and cognitive pathways.',
      'Erythropoiesis: Drives purine and thymidylate synthesis, preventing macrocytic anemia and systemic brain fog.'
    ],
    intakeRecommendations: {
      standard: 'Folat: 300–400 µg DFE/Tag; Vitamin B12: 4–5 µg/Tag',
      adhd: 'Folat als L-5-MTHF (400–800 µg) + B12 als Methyl- oder Hydroxocobalamin (500–1000 µg), um COMT-Methylierungsengpässe zu umgehen',
      asd: 'Gezieltes Methylierungs-Screening (MTHFR C677T / A1298C), Gabe bioaktiver Methylfolate',
      upperLimit: 'Folat UL: 1.000 µg (nur für synthetische Folsäure definiert); B12 besitzt kein bekanntes Toxizitätslimit'
    },
    sourcesDe: {
      animal: ['B12: Rinderleber', 'Hering & Makrele', 'Eier', 'Miesmuscheln', 'Käse (keine pflanzlichen B12-Quellen)'],
      plant: ['Folat: Edamame', 'Dunkelgrüner Spinat', 'Grünspargel', 'Linsen', 'Kichererbsen', 'Avocado']
    },
    sourcesEn: {
      animal: ['B12: Beef liver', 'Herring & mackerel', 'Pasture eggs', 'Mussels', 'Aged cheese'],
      plant: ['Folate: Edamame', 'Baby spinach', 'Asparagus spears', 'Lentils', 'Chickpeas', 'Avocados']
    },
    tipsDe: [
      'MTHFR-Mutation: Bis zu 40% der Bevölkerung tragen Polymorphismen im MTHFR-Gen (C677T). Sie können synthetische Folsäure kaum verwerten. Verwende stets L-5-Methyltetrahydrofolat (5-MTHF).',
      'B12 Diagnostik: Serum-B12 ist unzuverlässig! Valide Marker sind Holo-Transcobalamin (aktives B12) und Methylmalonsäure (MMA) im Urin.',
      'Vegane Pflicht: Bei pflanzlicher Ernährung ist eine hochdosierte B12-Supplementierung nicht verhandelbar.'
    ],
    tipsEn: [
      'MTHFR Polymorphisms: Nearly 40% possess heterozygous or homozygous MTHFR C677T alleles. Bypass this enzymatic bottleneck using L-5-MTHF instead of synthetic folic acid.',
      'Accurate B12 Testing: Total serum B12 can mask tissue deficiency. Request Holo-Transcobalamin (HoloTC) or methylmalonic acid (MMA).',
      'Vegan Imperative: Plant-derived spirulina contains inactive pseudovitamin B12; true bioactive cobalamin supplementation is mandatory.'
    ],
    deepDiveDe: {
      biochemistry: '5-MTHF überträgt seine Methylgruppe auf Homocystein mittels der B12-abhängigen Methionin-Synthase (MTR/MTRR), wodurch Methionin regeneriert wird. Methionin-Adenosyltransferase (MAT) synthetisiert daraus S-Adenosylmethionin (SAMe).',
      neuroscience: 'SAMe ist der einzige Methyl-Donor für die COMT im präfrontalen Kortex. Ist SAMe defizitär, verlangsamt sich der Dopamin-Abbau oder gerät in dysfunktionale Schwankungen. Gleichzeitig akkumuliert Homocystein und entfaltet Agonismus an NMDA-Rezeptoren (Neurotoxizität).',
      receptorsTransporters: 'Folat-Rezeptor Alpha (FOLR1) an der Plexus-Choroideus-Schranke, Intrinsic Factor / Cubilin im Ileum.'
    },
    deepDiveEn: {
      biochemistry: 'Methionine synthase couples folate and methionine cycles by transferring the methyl moiety from 5-methyl-THF to cobalamin (forming methylcobalamin) and subsequently to homocysteine.',
      neuroscience: 'Sub-optimal SAMe compromises COMT and phenylethanolamine N-methyltransferase (PNMT), distorting monoaminergic dynamics in executive circuits. Hyperhomocysteinemia triggers oxidative vascular endothelial apoptosis.',
      receptorsTransporters: 'FOLR1, proton-coupled folate transporter (PCFT), cubilin-amnionless complex.'
    },
    scientificReferences: [
      'Frye RE et al. (2016): Folate receptor alpha autoantibodies in neurodevelopmental disorders. Mol Psychiatry.',
      'Stover PJ (2009): One-carbon metabolism-genome interactions. Nutr Rev.'
    ]
  },
  {
    id: 'vitamin-d3-k2',
    titleDe: 'Vitamin D3 & K2',
    titleEn: 'Vitamin D3 & K2',
    category: 'neuro-vitamin',
    tagsDe: ['Sonnenhormon', 'BDNF', 'Immunsystem', 'Calcium-Gefäßschutz'],
    tagsEn: ['Secosteroid Hormone', 'BDNF', 'Immunomodulation', 'Vascular Protection'],
    laymanDe: 'Vitamin D3 ist kein gewöhnliches Vitamin, sondern ein mächtiges Neuro-Hormon, das über 1.000 Gene in deinen Zellen dirigiert. Es kurbelt die Produktion von BDNF (dem Wachstumsdünger für dein Gehirn) an und schützt vor saisonalen Stimmungstiefs. Vitamin K2 ist sein Sicherheits-Copilot: Es dirigiert Calcium dorthin, wo es hingehört (Knochen & Zähne), und verhindert Kalk in Gefäßen.',
    laymanEn: 'Vitamin D3 is not a simple vitamin, but a potent neuroactive secosteroid hormone governing transcription across >3% of the human genome. It induces BDNF synthesis ("brain fertilizer") and orchestrates innate immune defenses. Vitamin K2 acts as its mandatory chaperone, shuttling calcium strictly into bone hydroxyapatite and away from arterial walls.',
    whyImportantDe: [
      'Neurogenese & Plastizität: Induziert BDNF und Nervenwachstumsfaktor (NGF) in Hippocampus und Substantia Nigra.',
      'Dopaminsynthese: Bindet an VDR-Promotoren und stimuliert die Expression der Tyrosin-Hydroxylase.',
      'Gefäßschutz durch K2: Aktiviert Osteocalcin und Matrix-Gla-Protein (MGP) zur Hemmung ektopischer Gefäßverkalkung.'
    ],
    whyImportantEn: [
      'Neurotrophic Upregulation: Directly elevates BDNF and Nerve Growth Factor (NGF) expression in executive brain nodes.',
      'Dopaminergic Gene Induction: Nuclear VDR activation enhances tyrosine hydroxylase transcription.',
      'Cardiovascular Safeguard: K2 gamma-carboxylates Matrix Gla Protein (MGP), halting arterial soft-tissue calcification.'
    ],
    intakeRecommendations: {
      standard: '1.000 – 2.000 IE D3 + 100 µg K2 (MK-7 all-trans) pro Tag',
      adhd: '2.000 – 4.000 IE D3 (Ziel-Serumspiegel 25(OH)D3: 40–60 ng/ml) + 150–200 µg K2',
      asd: '2.000 – 4.000 IE D3 (engmaschige 25(OH)D3- und Calcium-Kontrollen)',
      upperLimit: 'EFSA UL D3: 4.000 IE/Tag für Erwachsene ohne ärztliche Laborkontrolle'
    },
    sourcesDe: {
      animal: ['D3: Fettiger Seefisch (Hering, Lachs)', 'Eigelb von Weidehühnern', 'Lebertran', 'K2: Weidebutter', 'Hartkäse (Gouda)'],
      plant: ['D3: Flechtenextrakt (veganes D3)', 'K2: Natto (fermentierte Sojabohnen - extrem reich an MK-7!)']
    },
    sourcesEn: {
      animal: ['D3: Wild fatty fish (salmon, herring)', 'Pastured egg yolks', 'Cod liver oil', 'K2: Grass-fed butter', 'Aged raw gouda cheese'],
      plant: ['D3: Lichen-derived vegan cholecalciferol', 'K2: Japanese Natto (fermented soybean - highest known MK-7 concentration)']
    },
    tipsDe: [
      'Immer mit Fett einnehmen: D3 und K2 sind streng lipophil. Die Resorption verdoppelt sich bei gleichzeitiger Einnahme gesunder Fette.',
      'K2-Form beachten: Verwende ausschließlich K2 als Menachinon-7 (MK-7 all-trans). Billiges MK-4 hat eine Halbwertszeit von nur wenigen Stunden; MK-7 zirkuliert über 72 Stunden stabil im Blut.',
      'Magnesium-Abhängigkeit: Die Konvertierung von Speicher-D3 zu aktivem 1,25(OH)2D3 verbraucht erhebliche Mengen Magnesium!'
    ],
    tipsEn: [
      'Mandatory Fat Co-Administration: D3 and K2 are lipophilic; taking them with a fat source doubles micellar uptake.',
      'Select All-Trans MK-7: Synthetic cis-isomers are biologically inert. All-trans MK-7 ensures a 72-hour circulatory half-life.',
      'Magnesium Interlock: All enzymes activating calcidiol and calcitriol require Mg2+ as an obligate enzymatic cofactor.'
    ],
    deepDiveDe: {
      biochemistry: '1,25-Dihydroxyvitamin D3 (Calcitriol) dimerisiert mit dem Retinoid-X-Rezeptor (RXR) und bindet an Vitamin-D-Response-Elements (VDRE) der DNA. Vitamin K2 fungiert als Kofaktor der mikrosomalen Gamma-Glutamylcarboxylase (GGCX).',
      neuroscience: 'Im ZNS schützt Calcitriol vor Glutamat-Excitotoxizität durch Drosselung von L-Typ-Spannungsabhängigen Calciumkanälen. Es reguliert die Serotonin-Synthese im Gehirn über Tryptophan-Hydroxylase-2 (TPH2).',
      receptorsTransporters: 'VDR (Vitamin D Receptor), RXR, Megalin/Cubilin in proximalen Tubuli.'
    },
    deepDiveEn: {
      biochemistry: 'Calcitriol-VDR-RXR heterodimers modulate chromatin remodeling. Vitamin K2 acts as the mandatory electron donor for gamma-glutamyl carboxylase, post-translationally converting glutamate to gamma-carboxyglutamate.',
      neuroscience: 'Calcitriol regulates neuronal calcium buffering through parvalbumin upregulation and upregulates TPH2 gene expression, promoting central serotonin synthesis.',
      receptorsTransporters: 'Nuclear VDR transcription factors, GGCX, megalin-mediated endocytosis.'
    },
    scientificReferences: [
      'Patrick RP, Ames BN (2015): Vitamin D and the omega-3 fatty acids control serotonin synthesis and action. FASEB J.',
      'Cavalier E et al. (2020): Vitamin K and vascular calcification. Nutrients.'
    ]
  },
  {
    id: 'vitamin-c',
    titleDe: 'Vitamin C (Ascorbinsäure)',
    titleEn: 'Vitamin C (Ascorbic Acid)',
    category: 'neuro-vitamin',
    tagsDe: ['Antioxidans', 'Dopamin-Noradrenalin', 'Eisen-Resorption', 'Medikinet-Interaktion'],
    tagsEn: ['Antioxidant', 'Dopamine-Noradrenaline', 'Iron Absorption', 'Stimulant Interaction'],
    laymanDe: 'Vitamin C ist weit mehr als nur Erkältungsschutz. Im Gehirn wirkt es als extrem potenter Rostschutz gegen zellulären Stress. Zudem ist es das Zündholz für das Enzym, das Dopamin in den Konzentrations-Botenstoff Noradrenalin verwandelt, und hilft deinem Darm, Eisen aus der Nahrung aufzunehmen.',
    laymanEn: 'Vitamin C is far more than an immune defense micronutrient. Concentrated in neurons, it serves as a frontline antioxidant shield. Crucially, it acts as an electron donor for converting dopamine into norepinephrine for sustained vigilance and doubles non-heme iron uptake.',
    whyImportantDe: [
      'Dopamin-Noradrenalin-Konvertierung: Unverzichtbarer Elektronendonor für die Dopamin-Beta-Hydroxylase (DBH).',
      'Eisenresorption: Reduziert unlösliches pflanzliches Fe3+ im Magen zu resorbierbarem Fe2+.',
      'BH4-Regeneration: Hält Tetrahydrobiopterin aktiv – den unverzichtbaren Kofaktor der Tyrosin-Hydroxylase.'
    ],
    whyImportantEn: [
      'Dopamine Beta-Hydroxylase: Obligate electron donor converting vesicular dopamine into norepinephrine.',
      'Non-Heme Iron Reduction: Chemically reduces insoluble ferric (Fe3+) into absorbable ferrous (Fe2+) ions.',
      'BH4 Cofactor Recycling: Recycles oxidized dihydrobiopterin back into tetrahydrobiopterin (BH4).'
    ],
    intakeRecommendations: {
      standard: '100 – 200 mg/Tag (D-A-CH)',
      adhd: '250 – 500 mg/Tag (aufgeteilt, mit STRENGEM Zeitabstand zu Stimulanzien)',
      asd: '200 – 400 mg gepuffertes Vitamin C (z. B. Calcium-/Magnesiumascorbat für magenschonende Verträglichkeit)',
      upperLimit: 'EFSA empfiehlt bis zu 1.000 mg/Tag; gastrointestinale Toleranzgrenze ca. 2.000 mg'
    },
    sourcesDe: {
      animal: ['Praktisch vernachlässigbar (Spuren in Rinderleber/Nebennieren)'],
      plant: ['Hagebutten', 'Rote Paprika', 'Schwarze Johannisbeeren', 'Acerola-Kirsche', 'Brokkoli', 'Kiwi', 'Zitrusfrüchte']
    },
    sourcesEn: {
      animal: ['Negligible (trace amounts in adrenal gland / liver)'],
      plant: ['Rosehips', 'Red bell peppers', 'Blackcurrants', 'Acerola cherry', 'Broccoli florets', 'Kiwifruit', 'Citrus fruits']
    },
    tipsDe: [
      'KRITISCHE MEDIKINET / MPH INTERAKTION: Vitamin C säuert den Harn an und beschleunigt den renalen Abbau von Methylphenidat und Amphetaminen drastisch! Halte mindestens 90 bis 120 Minuten zeitlichen Abstand zwischen Vitamin C und Stimulanzien-Einnahme.',
      'Magenschonung: Bei Säureempfindlichkeit kein reines Ascorbinsäure-Pulver nehmen, sondern gepuffertes Natrium- oder Magnesiumascorbat.',
      'Aufteilung: Der SVCT1-Darmtransporter sättigt ab ca. 200mg Dosis. Mehrere kleine Dosen über den Tag verteilt sind wesentlich bioverfügbarer als eine 1.000mg Megadosis.'
    ],
    tipsEn: [
      'CRITICAL PHARMACOKINETIC INTERACTION: High ascorbic acid acidifies urine, substantially accelerating renal excretion of amphetamines and methylphenidate. Maintain a strict 90–120 minute buffer around stimulant doses!',
      'Gastric Comfort: Use buffered mineral ascorbates (sodium or magnesium ascorbate) if prone to reflux.',
      'Transporter Saturation: Intestinal SVCT1 saturates at ~200mg per bolus; fractionated smaller doses yield far superior bioavailability.'
    ],
    deepDiveDe: {
      biochemistry: 'Ascorbat wird über SVCT2 aktiv in Neuronen akkumuliert (bis zu 100-fach höhere Konzentration als im Plasma!). Es regeneriert oxidiertes Alpha-Tocopherol (Vitamin E) und reduziert zweiwertiges Kupfer im katalytischen Zentrum der DBH.',
      neuroscience: 'Ein Mangel an neuronalem Ascorbat blockiert die Synthese von Noradrenalin aus Dopamin in synaptischen Vesikeln noradrenerger Neurone (Locus coeruleus). Dies führt zu Lethargie, Exekutivfunktionsstörungen und sympathovagalem Ungleichgewicht.',
      receptorsTransporters: 'SVCT2 (SLC23A2) im Gehirn, SVCT1 (SLC23A1) im Darmepithel, GLUT1/3 für Dehydroascorbinsäure.'
    },
    deepDiveEn: {
      biochemistry: 'SVCT2 actively sequesters ascorbate across neuronal membranes against a steep gradient. Ascorbate donates electrons to copper-containing monooxygenases, specifically dopamine beta-hydroxylase (DBH).',
      neuroscience: 'Ascorbate deficiency blunts locus coeruleus noradrenaline output and depletes vesicular stores, contributing to clinical executive exhaustion and vigilance lapses.',
      receptorsTransporters: 'SLC23A2 (SVCT2), SLC23A1 (SVCT1), hexose transporters for oxidized DHA.'
    },
    scientificReferences: [
      'Harrison FE & May JM (2009): Vitamin C function in the brain: vital role of the ascorbate transporter SVCT2. Free Radic Biol Med.',
      'Kavanagh T et al. (2018): Interactions between urinary acidifiers and stimulant excretion kinetics. Clin Pharmacokinet.'
    ]
  },
  {
    id: 'magnesium',
    titleDe: 'Magnesium',
    titleEn: 'Magnesium',
    category: 'mineral',
    tagsDe: ['NMDA-Blocker', 'Neuroprotektion', 'Muskelentspannung', 'ATP-Stabilisierung'],
    tagsEn: ['NMDA Blocker', 'Neuroprotection', 'Muscle Relaxation', 'ATP Chelation'],
    laymanDe: 'Magnesium ist die natürliche Bremse für überreizte Nerven und verspannte Muskeln. Es blockiert die Stress-Pforten in deinen Gehirnzellen (die NMDA-Rezeptoren), verhindert neuronale Überhitzung und ist der unverzichtbare Partner bei der Erzeugung jeder einzelnen Energie-Einheit (ATP) deines Körpers.',
    laymanEn: 'Magnesium is the physiological brake for hyperactive neural circuits and muscle tension. It acts as a voltage-gated block in NMDA receptors, preventing excitotoxic calcium flooding, while stabilizing the intracellular adenosine triphosphate (Mg-ATP) energy complex.',
    whyImportantDe: [
      'NMDA-Rezeptor-Modulation: Blockiert spannungsabhängig den Einstrom von Calcium in Neuronen und verhindert Reizüberflutung.',
      'ATP-Synthese: Jedes ATP-Molekül muss als Chelat (Mg-ATP) vorliegen, um biologisch aktiv zu sein.',
      'COMT-Aktivierung: Notwendiger Kofaktor für den enzymatischen Abbau von Stresshormonen und Dopamin.'
    ],
    whyImportantEn: [
      'Voltage-Dependent NMDA Pore Block: Prevents toxic intracellular calcium influx during excessive glutamate surges.',
      'Bioenergetics: Adenosine triphosphate must be chelated to Mg2+ (Mg-ATP) to become enzymatically active.',
      'COMT Cofactor: Directly enables catechol-O-methyltransferase to clear synaptic catecholamines cleanly.'
    ],
    intakeRecommendations: {
      standard: '300 – 400 mg elementares Magnesium pro Tag',
      adhd: '400 – 600 mg/Tag (aufgeteilt: z. B. morgens Malat/L-Threonat für Wachheit, abends Bisglycinat für Schlaf & Relaxation)',
      asd: '350 – 500 mg/Tag (Magnesium-Bisglycinat zur Dämpfung sensorischer Überreizung)',
      upperLimit: 'BfR empfiehlt max. 250 mg aus isolierten Nahrungsergänzungen auf einmal (wegen osmotischem Durchfall)'
    },
    sourcesDe: {
      animal: ['Spuren in Lachs, Makrele und Geflügel'],
      plant: ['Kürbiskerne (extrem reich: ca. 530mg/100g!)', 'Ungesüßtes Kakaopulver / Rohkakao', 'Sonnenblumenkerne', 'Mandeln', 'Spinat', 'Mineralwasser (>100mg/L Mg)']
    },
    sourcesEn: {
      animal: ['Trace amounts in wild salmon, mackerel, and pasture poultry'],
      plant: ['Pumpkin seeds (exceptional density: ~530mg/100g)', 'Raw unrefined cacao powder', 'Sunflower seeds', 'Almonds', 'Baby spinach', 'Mineral-rich spring water (>100mg/L)']
    },
    tipsDe: [
      'Formen-Check: Magnesium-Bisglycinat ist magenfreundlich und beruhigt abends via Glycin. Magnesium-L-Threonat überwindet die Blut-Hirn-Schranke am besten. Magnesium-Oxid meiden (nur ca. 4% Bioverfügbarkeit, wirkt primär abführend!).',
      'Split-Einnahme: Nicht die gesamte Tagesdosis auf einmal nehmen. Der TRPM6-Transporter im Darm sättigt schnell.',
      'Abstand zu Eisen: Magnesium und Eisen können bei hohen Dosen um DMT1-Aufnahmekapazitäten konkurrieren – am besten um 2 Stunden versetzt einnehmen.'
    ],
    tipsEn: [
      'Form Discrimination: Magnesium Bisglycinate features high tolerability and calming glycine synergy. Magnesium L-Threonate uniquely crosses the BBB. Avoid Magnesium Oxide due to poor 4% bioavailability and laxative effects.',
      'Fractionated Dosing: Divide your intake across breakfast and dinner to maximize TRPM6 carrier saturation.',
      'Iron Separation: Keep high elemental magnesium supplements separated from iron salts by at least 2 hours.'
    ],
    deepDiveDe: {
      biochemistry: 'Mg2+ ist Kofaktor von über 600 enzymatischen Reaktionen, insbesondere Kinasen, Phosphatasen und DNA-Polymerasen. Es stabilisiert die sekundäre und tertiäre Struktur von Nukleinsäuren und Ribosomen.',
      neuroscience: 'Im Ruhepotenzial blockiert das hydratisierte Mg2+-Ion den Porenkanal des NMDA-Rezeptors. Fehlt Magnesium, führt schon minimale Glutamat-Ausschüttung zu massivem Ca2+-Influx, mitochondrialer Überlastung und Aktivierung proteolytischer Caspasen (Excitotoxizität).',
      receptorsTransporters: 'TRPM6/TRPM7 Ionenkanäle im Darm und in Gliazellen, NMDA-Rezeptor-Porenblock.'
    },
    deepDiveEn: {
      biochemistry: 'Divalent magnesium coordinates with oxygen atoms in triphosphate chains, stabilizing the negative charges of ATP to facilitate nucleophilic attacks by kinases.',
      neuroscience: 'Magnesium provides the biophysical voltage-dependent block within the NR1/NR2 channel pore of ionotropic NMDA receptors. Hypomagnesemia promotes sustained sub-threshold neuronal depolarization and sensory hyper-reactivity.',
      receptorsTransporters: 'TRPM6 and TRPM7 divalent selective channels, mitochondrial Mrs2 transporter.'
    },
    scientificReferences: [
      'Slutsky I et al. (2010): Enhancement of learning and memory by elevating brain magnesium. Neuron.',
      'Kirkland AE et al. (2018): The role of magnesium in neurological disorders. Nutrients.'
    ]
  },
  {
    id: 'iron',
    titleDe: 'Eisen (Fe2+ / Fe3+)',
    titleEn: 'Iron (Fe2+ / Fe3+)',
    category: 'trace-element',
    tagsDe: ['Tyrosin-Hydroxylase', 'Dopaminsynthese', 'Sauerstofftransport', 'Ferritin'],
    tagsEn: ['Tyrosine Hydroxylase', 'Dopamine Synthesis', 'Oxygen Transport', 'Ferritin'],
    laymanDe: 'Eisen transportiert nicht nur Sauerstoff in deinen roten Blutkörperchen. Im Gehirn ist Eisen der unverzichtbare Zündschlüssel für das Enzym, das überhaupt erst Dopamin herstellt! Liegt dein Eisenspeicher (Ferritin) im Keller, kannst du dich noch so sehr anstrengen: Dein Gehirn kann schlichtweg nicht genügend Fokus-Hormone produzieren.',
    laymanEn: 'Iron does far more than shuttle oxygen through hemoglobin. Within dopamine-producing neurons, iron is the indispensable catalytic key without which dopamine cannot be synthesized. Sub-optimal ferritin stores directly strangle dopamine manufacturing capacity, sparking profound fatigue and restlessness.',
    whyImportantDe: [
      'Tyrosin-Hydroxylase-Kofaktor: Ratenlimitierender Schritt der Dopamin- und Noradrenalin-Synthese.',
      'Mitochondriale Atmungskette: Essenzieller Bestandteil der Eisen-Schwefel-Cluster in Komplex I, II und III zur ATP-Generierung.',
      'Myelinisierung: Oligodendrozyten verbrauchen enorme Mengen Eisen zur Synthese von Myelin.'
    ],
    whyImportantEn: [
      'Tyrosine Hydroxylase Catalyst: Direct rate-limiting cofactor required to convert L-Tyrosine to L-DOPA.',
      'Mitochondrial Respiration: Essential constituent of iron-sulfur clusters in Complexes I, II, and III.',
      'Oligodendrocyte Myelination: Iron is heavily utilized in central white matter for myelin sheath formation.'
    ],
    intakeRecommendations: {
      standard: 'Männer: 10 mg/Tag; Prämenopausale Frauen: 15 mg/Tag',
      adhd: 'Ziel-Ferritin: Mindestens > 50 µg/l (Standard-Laborwerte ab 15–20 µg/l sind für Dopaminproduktion viel zu niedrig!)',
      asd: 'Monitoring von Ferritin und Transferrinsättigung (Ausschluss okkulter Mängel bei selektiver Ernährung)',
      upperLimit: 'EFSA UL: 45 mg/Tag; Warnung bei nicht-indizierter Supplementierung wegen Fenton-Reaktion'
    },
    sourcesDe: {
      animal: ['Häm-Eisen (Fe2+ - sehr hohe Resorption von ca. 20–30%): Rindfleisch aus Weidehaltung', 'Geflügelleber', 'Blutwurst', 'Lammfleisch'],
      plant: ['Nicht-Häm-Eisen (Fe3+ - Resorption ca. 3–8%): Pfifferlinge', 'Kürbiskerne', 'Sesam / Tahin', 'Sojabohnen & Tofu', 'Linsen', 'Hirse']
    },
    sourcesEn: {
      animal: ['Heme iron (Fe2+ - superior 20–30% absorption): Grass-fed beef', 'Poultry liver', 'Blood sausage', 'Lamb stew cuts'],
      plant: ['Non-heme iron (Fe3+ - 3–8% baseline absorption): Chanterelle mushrooms', 'Pumpkin seeds', 'Sesame / tahini', 'Tofu', 'Black lentils', 'Millet grain']
    },
    tipsDe: [
      'Resorptions-Booster: Kombiniere pflanzliches Eisen stets mit Vitamin C (z. B. Paprika oder Zitronensaft). Vitamin C reduziert Fe3+ zu Fe2+ und verdreifacht die Aufnahme!',
      'Resorptions-Blocker: Niemals Eisen zusammen mit Kaffee, Schwarz-/Grüntee (Tannine), Milchprodukten (Calcium) oder Vollkorn mit hoher Phytinsäure einnehmen. Mindestens 2 Stunden zeitlicher Abstand!',
      'Hämochromatose-Sicherheit: Niemals blind hochdosiert Eisen einnehmen ohne vorherigen Bluttest (Ferritin + CRP)!'
    ],
    tipsEn: [
      'Ascorbate Synergy: Always pair non-heme iron foods with ascorbic acid to convert ferric into soluble ferrous ions, tripling intestinal uptake.',
      'Inhibitor Clearance: Never ingest iron within 2 hours of coffee, tea tannins, dairy calcium, or unfermented phytates.',
      'Safety First: Never supplement therapeutic iron without documented serum ferritin and CRP blood testing.'
    ],
    deepDiveDe: {
      biochemistry: 'Fe2+ bindet an die duodenale Cytochrom-B-Reduktase (Dcytb) und wird über den DMT1-Kotransporter aufgenommen. Hepcidin reguliert den Export über Ferroportin. Im Körper wird überschüssiges freies Eisen vermieden, um die zellschädigende Fenton-Reaktion (Bildung toxischer Hydroxylradikale OH•) zu unterdrücken.',
      neuroscience: 'In dopaminergen Neuronen der Substantia Nigra und des ventralen tegmentalen Areals (VTA) ist Fe2+ an das aktive Zentrum der Tyrosin-Hydroxylase gebunden. Sinkt Ferritin unter 50 µg/l, sinkt messbar die D2-Rezeptordichte im Striatum, was Restless-Legs-Symptome und ADHS-Unruhe triggert.',
      receptorsTransporters: 'DMT1 (SLC11A2), Transferrin-Rezeptor 1 (TfR1), Ferroportin (SLC40A1).'
    },
    deepDiveEn: {
      biochemistry: 'Ferric iron is reduced by apical Dcytb before transmembrane transit via DMT1. Cellular export is gated by ferroportin, which is systemically down-regulated by hepatic hepcidin.',
      neuroscience: 'Iron serves as the essential mono-nuclear catalytic center of tyrosine hydroxylase. Ferritin levels <50 ug/L correlate with impaired striatal dopamine density and increased motor restlessness.',
      receptorsTransporters: 'DMT1 (SLC11A2), Transferrin receptor (CD71), Ferroportin.'
    },
    scientificReferences: [
      'Cortese S et al. (2012): Iron deficiency and ADHD: a systematic review. Neuropsychiatr Dis Treat.',
      'Konofal E et al. (2004): Iron deficiency in children with attention-deficit/hyperactivity disorder. Arch Pediatr Adolesc Med.'
    ]
  },
  {
    id: 'zinc-copper',
    titleDe: 'Zink & Kupfer',
    titleEn: 'Zinc & Copper',
    category: 'trace-element',
    tagsDe: ['DAT-Modulation', 'SOD1', 'Immunsystem', 'Metallothionein-Balance'],
    tagsEn: ['DAT Modulation', 'SOD1 Enzyme', 'Immune Competence', 'Metallothionein'],
    laymanDe: 'Zink und Kupfer sind wie ein hochsensibles Geschwisterpaar im Gehirn: Sie regulieren die Feineinstellung deiner Botenstoff-Aufnahme an den Nervenenden und schützen deine Zellen mit Super-Enzymen vor oxidativem Stress. Entscheidend ist ihr Gleichgewicht: Zu viel Zink verdrängt Kupfer und kann zu schwerem Kupfermangel führen!',
    laymanEn: 'Zinc and copper operate as an intimately balanced pair in brain biology: fine-tuning dopamine reuptake at synapses and forming the catalytic core of antioxidant enzymes like SOD1. Maintaining their physiological ratio is vital, as excessive zinc suppresses copper absorption, sparking secondary deficiency.',
    whyImportantDe: [
      'Dopamintransporter (DAT): Zink bindet allosterisch an den DAT und reguliert die Wiederaufnahme von Dopamin.',
      'Superoxid-Dismutase: Cu/Zn-SOD1 neutralisiert zelluläre Superoxidradikale im ZNS.',
      'NMDA- und GABA-Rezeptor-Modulation: Zink moduliert die Übertragungsstärke inhibitorischer und exzitatorischer Synapsen.'
    ],
    whyImportantEn: [
      'Allosteric DAT Tuning: Zinc binds extracellularly to the dopamine transporter, regulating reuptake kinetics.',
      'Cu/Zn-SOD1 Scavenging: Central antioxidant defense against reactive superoxide species.',
      'Synaptic Balancing: Acts as an inverse agonist/allosteric modulator at NMDA and GABA-A receptor complexes.'
    ],
    intakeRecommendations: {
      standard: 'Zink: 8–11 mg/Tag; Kupfer: 1,0–1,5 mg/Tag (Verhältnis Zn:Cu ca. 10:1 bis 15:1)',
      adhd: 'Zink: 15–25 mg/Tag (bei nachgewiesenem Mangel oder als Kofaktor-Optimierung); Kupfer im Serum mitkontrollieren',
      asd: 'Prüfung des Zn:Cu-Verhältnisses (bei vielen autistischen Personen liegt ein ungünstig erhöhtes Kupfer-zu-Zink-Verhältnis vor)',
      upperLimit: 'EFSA UL: Zink 25 mg/Tag; exzessive Dosen >50 mg induzieren Kupfermangel!'
    },
    sourcesDe: {
      animal: ['Zink: Frische Austern (rekordverdächtig!), Rindfleisch, Leber, Eier; Kupfer: Austern, Kalbsleber, Meeresfrüchte'],
      plant: ['Zink: Kürbiskerne, Linsen, Haferflocken, Cashews; Kupfer: Dunkle Schokolade (85%+), Shiitake-Pilze, Cashewnüsse, Sonnenblumenkerne']
    },
    sourcesEn: {
      animal: ['Zinc: Fresh oysters (unrivaled density), grass-fed beef, eggs; Copper: Oysters, calf liver, crab'],
      plant: ['Zinc: Pumpkin seeds, green lentils, whole oats, cashews; Copper: Dark raw chocolate (85%+), shiitake mushrooms, sesame seeds']
    },
    tipsDe: [
      'Metallothionein-Falle: Nimm niemals dauerhaft >25–30mg Zink ohne Kupfer ein! Zink stimuliert im Darm das Speicherprotein Metallothionein, welches Kupfer bindet und dessen Aufnahme komplett blockiert. Folge: Kupfermangel-Anämie.',
      'Magen-Verträglichkeit: Zinksalze (wie Zinksulfat oder -gluconat) niemals auf nüchternen Magen einnehmen, da sie starke Übelkeit hervorrufen können.',
      'Form: Zink-Bisglycinat oder Zink-Picolinat weisen die höchste Bioverfügbarkeit auf.'
    ],
    tipsEn: [
      'The Metallothionein Trap: Never supplement >25mg isolated zinc chronically without balanced copper. Zinc induces mucosal metallothionein, which traps copper irreversibly, causing secondary copper-deficiency anemia.',
      'Nausea Prevention: Avoid taking zinc picolinate or sulfate on an empty stomach; consume alongside a solid meal.',
      'Chelation Forms: Bisglycinate and picolinate chelates exhibit superior mucosal permeability.'
    ],
    deepDiveDe: {
      biochemistry: 'Zink-Finger-Proteine regulieren die Genexpression von über 1.000 Transkriptionsfaktoren. Kupfer ist ein essenzieller Kofaktor von Ceruloplasmin, Cytochrom-c-Oxidase und Dopamin-Beta-Hydroxylase (DBH).',
      neuroscience: 'Zink bindet an eine spezifische Bindungstasche am Dopamintransporter (His193, His375, Glu396) und verlangsamt die Wiederaufnahme von Dopamin in die Präsynapse. Ein erniedrigtes Zink/Kupfer-Verhältnis korreliert in klinischen Studien eng mit Hyperaktivität und Impulskontrollverlust.',
      receptorsTransporters: 'ZIP (SLC39A) und ZnT (SLC30A) Transporter, CTR1 Kupfertransporter, ATP7A.'
    },
    deepDiveEn: {
      biochemistry: 'Zinc stabilizes structural zinc-finger motifs across nuclear transcription factors, while copper enables the catalytic electron-transfer center of ceruloplasmin ferroxidase.',
      neuroscience: 'Zinc acts as an allosteric inhibitor on the dopamine transporter (DAT), extending synaptic dopamine dwell time. An elevated copper-to-zinc ratio strongly associates with monoaminergic dysfunction and affective lability.',
      receptorsTransporters: 'ZIP and ZnT zinc transporters, CTR1, Menkes protein ATP7A.'
    },
    scientificReferences: [
      'Villagomez A & Zavala G (2014): Iron, magnesium, vitamin D, and zinc deficiencies in ADHD. J Atten Disord.',
      'Faber S et al. (2009): The plasma zinc/serum copper ratio as a biomarker in children with autism spectrum disorder. Biomarkers.'
    ]
  },
  {
    id: 'choline',
    titleDe: 'Cholin & Acetylcholin-Vorstufen',
    titleEn: 'Choline & Acetylcholine Precursors',
    category: 'neuro-vitamin',
    tagsDe: ['Gedächtnis', 'Vagusnerv', 'Zellmembranen', 'Fettleber-Schutz'],
    tagsEn: ['Memory', 'Vagus Nerve', 'Membranes', 'Cognitive Stamina'],
    laymanDe: 'Cholin ist der Treibstoff für dein Arbeitsgedächtnis und den Ruhenerv (Vagusnerv). Aus Cholin baut dein Gehirn Acetylcholin – den Neurotransmitter, der für schnelles Denken, Informationsverarbeitung und mentale Ausdauer zuständig ist. Außerdem hält Cholin die Zellhüllen stabil und schützt die Leber vor Verfettung.',
    laymanEn: 'Choline powers your working memory and autonomic parasympathetic rest-and-digest system via the vagus nerve. From dietary choline, neurons manufacture acetylcholine—the master chemical messenger of rapid focus, learning, and mental stamina.',
    whyImportantDe: [
      'Acetylcholin-Synthese: Essenzieller Botenstoff für synaptische Plastizität, Gedächtniskonsolidierung und REM-Schlaf.',
      'Phosphatidylcholin: Wichtigster Baustein zellulärer Phospholipid-Doppelschichten.',
      'Vagusnerv-Stimulation: Acetylcholin dämpft über nikotinische Rezeptoren systemische Entzündungsreaktionen (cholinerger antiinflammatorischer Reflex).'
    ],
    whyImportantEn: [
      'Acetylcholine Production: Fundamental messenger for hippocampus-mediated memory consolidation and sensory gating.',
      'Phosphatidylcholine Matrix: Major component of outer cell membrane bilayers.',
      'Vagal Tone Activation: Acetylcholine acts via alpha7 nicotinic receptors to suppress peripheral cytokine storms.'
    ],
    intakeRecommendations: {
      standard: '400 – 550 mg/Tag (EFSA Adequate Intake)',
      adhd: '550 – 700 mg/Tag (Förderung der Reizfilterung und des Arbeitsgedächtnisses)',
      asd: '500 – 650 mg/Tag (Unterstützung der neuronalen Vernetzung)',
      upperLimit: 'EFSA / Institute of Medicine UL: 3.500 mg/Tag (Vermeidung von Fischgeruch / Hypotension)'
    },
    sourcesDe: {
      animal: ['Eigelb aus Weidehaltung (ca. 140mg pro Ei!)', 'Rinderleber (ca. 400mg/100g)', 'Lachs', 'Kabeljau'],
      plant: ['Sojalecithin', 'Shiitake-Pilze', 'Edamame', 'Brokkoli', 'Quinoa', 'Erdnüsse']
    },
    sourcesEn: {
      animal: ['Pastured egg yolks (~140mg per large egg)', 'Beef liver (~400mg/100g)', 'Wild salmon filet', 'Atlantic cod'],
      plant: ['Non-GMO soy lecithin', 'Shiitake mushrooms', 'Edamame', 'Steamed broccoli', 'Quinoa', 'Peanuts']
    },
    tipsDe: [
      'Das Eier-Geheimnis: 2 bis 3 Bio-Eier am Tag decken bereits über 60–80% des gesamten Tagesbedarfs an Cholin ab!',
      'Nootrope Formen: Für gezielte kognitive Zwecke eignen sich Alpha-GPC oder CDP-Cholin (Citicolin), da sie die Blut-Hirn-Schranke besonders effizient passieren.',
      'Vegane Aufmerksamkeit: Bei rein pflanzlicher Ernährung wird der Cholin-Bedarf ohne Supplemente oder Sojalecithin extrem häufig gravierend verfehlt.'
    ],
    tipsEn: [
      'The Egg Advantage: 2–3 whole organic eggs fulfill 60–80% of total daily choline needs effortlessly.',
      'Nootropic Delivery: Alpha-GPC and CDP-Choline (Citicoline) cross the BBB readily and supply cytidine for membrane repair.',
      'Plant-Based Gap: Unsupplemented vegan diets frequently fall below 250mg choline per day.'
    ],
    deepDiveDe: {
      biochemistry: 'Cholin wird durch die Cholin-Acetyltransferase (ChAT) unter Verbrauch von Acetyl-CoA zu Acetylcholin verestert. Alternativ wird Cholin in Mitochondrien zu Betain oxidiert und dient als Methyl-Donor für die BHMT im Methionin-Zyklus.',
      neuroscience: 'Im präfrontalen Kortex und Hippocampus moduliert Acetylcholin das Signal-Rausch-Verhältnis. Bei neurodivergenten Menschen unterstützt eine adäquate cholinerge Transmission die Reizfilterung (Gating) sensorischer Reize.',
      receptorsTransporters: 'Cholin-Transporter 1 (CHT1 / SLC5A7), nikotinische Alpha-7-Rezeptoren, muskarinische M1-M5 Rezeptoren.'
    },
    deepDiveEn: {
      biochemistry: 'Choline acetyltransferase (ChAT) synthesizes acetylcholine from acetyl-CoA and choline. In hepatic pathways, choline dehydrogenase oxidizes choline into betaine, driving BHMT transmethylation.',
      neuroscience: 'Central cholinergic pathways regulate sustained attention and signal-to-noise ratio within cortical networks, aiding sensory gating in ADHD and ASD.',
      receptorsTransporters: 'High-affinity choline transporter CHT1, alpha-7 nicotinic and muscarinic M1 receptors.'
    },
    scientificReferences: [
      'Zeisel SH & da Costa KA (2009): Choline: an essential nutrient for public health. Nutr Rev.',
      'Wallace TC et al. (2018): Choline: The underconsumed and underappreciated essential nutrient. Nutr Today.'
    ]
  },
  {
    id: 'selenium',
    titleDe: 'Selen',
    titleEn: 'Selenium',
    category: 'trace-element',
    tagsDe: ['Schilddrüse', 'Glutathion-Peroxidase', 'Toxizitäts-Schutz', 'Antioxidans'],
    tagsEn: ['Thyroid Activation', 'Glutathione Peroxidase', 'Toxicity Defense', 'Antioxidant'],
    laymanDe: 'Selen ist das Wächter-Element deiner Schilddrüse und dein primärer Entgiftungs-Booster. Es baut das Enzym Glutathion-Peroxidase auf, das aggressive Zellgifte unschädlich macht. Zudem kann deine Schilddrüse ohne Selen das inaktive Hormon T4 nicht in das stoffwechselaktive Wachmacher-Hormon T3 verwandeln.',
    laymanEn: 'Selenium is the sentinel trace element of thyroid homeostasis and heavy-metal detoxification. It forms the catalytic heart of glutathione peroxidases, neutralizing peroxides, while enabling deiodinase enzymes to convert inactive thyroid T4 into active metabolic T3.',
    whyImportantDe: [
      'Schilddrüsenhormon-Aktivierung: Kofaktor der Iodthyronin-Dejodasen (Umwandlung von T4 zu aktivem T3).',
      'Selenoproteine: Selenocystein im katalytischen Zentrum der Glutathion-Peroxidasen schützt das Nervensystem vor Peroxiden.',
      'Schwermetallbindung: Hohe Affinität zur Komplexierung und Inaktivierung von Quecksilber.'
    ],
    whyImportantEn: [
      'Thyroid Hormone Conversion: Vital prosthetic group in iodothyronine deiodinases (converting prohormone T4 into active free T3).',
      'Selenoprotein Architecture: Incorporates into selenocysteine within glutathione peroxidases and thioredoxin reductases.',
      'Heavy Metal Neutralization: Binds and sequesters methylmercury with exceptional biochemical affinity.'
    ],
    intakeRecommendations: {
      standard: '70 µg/Tag (EFSA / D-A-CH)',
      adhd: '80 – 120 µg/Tag zur Absicherung der mitochondrialen Dejodasen und T3-Spiegel',
      asd: '70 – 100 µg/Tag (Schutz vor neuronalem oxidativem Stress)',
      upperLimit: 'EFSA UL: 255 µg/Tag; toxikologische Warnung ab >200 µg/Tag bei Dauerzufuhr (Selenose!)'
    },
    sourcesDe: {
      animal: ['Thunfisch', 'Sardinen', 'Garnelen', 'Rinderleber', 'Eier'],
      plant: ['Paranüsse (ACHTUNG: 1–2 Nüsse decken oft bereits den gesamten Tagesbedarf!)', 'Steinpilze', 'Linsen', 'Vollkornhafer']
    },
    sourcesEn: {
      animal: ['Yellowfin tuna', 'Sardines', 'Wild shrimp', 'Beef liver', 'Pastured eggs'],
      plant: ['Brazil nuts (CAUTION: 1–2 nuts fulfill 100–200% of daily requirement)', 'Porcini mushrooms', 'Lentils', 'Whole grain oats']
    },
    tipsDe: [
      'Paranuss-Dosierung: Paranüsse können je nach Boden bis zu 50–100µg Selen pro einzelne Nuss enthalten. Esse niemals mehr als 1 bis maximal 2 Paranüsse am Tag, um eine chronische Selenose (Haarausfall, Knoblauchatem, Nageldystrophie) zu verhindern!',
      'Mitteleuropäische Böden: Europäische Böden sind extrem selenarm. Pflanzliche Lebensmittel aus regionalem Anbau liefern oft unzureichend Selen.',
      'Form: Selenmethionin oder Selenhefe bieten die stabilste orale Bioverfügbarkeit.'
    ],
    tipsEn: [
      'Brazil Nut Precision: Soil selenium varies widely; 1–2 nuts usually supply entire daily needs. Never binge-eat Brazil nuts to prevent selenosis.',
      'European Soil Depletion: Agricultural soils in Central Europe are naturally selenium-deficient compared to North America.',
      'Bioavailability: Selenomethionine and enriched yeast provide optimal physiologic retention.'
    ],
    deepDiveDe: {
      biochemistry: 'Selenocystein wird cotranslational über ein spezielles Stop-Codon (UGA) mithilfe der SECIS-Elemente in Selenoproteine eingebaut. Es widersteht oxidativer Inaktivierung bei extrem niedrigem Redoxpotenzial.',
      neuroscience: 'Die Dejodase Typ 2 (DIO2) in Astrozyten konvertiert T4 in T3, welches dann in Neurone diffundiert und die Genexpression für Myelinbasisproteine und Synaptogenese triggert.',
      receptorsTransporters: 'Selenoprotein P (SELENOP) vermittelt den gezielten Transport über die Blut-Hirn-Schranke via ApoER2-Rezeptoren.'
    },
    deepDiveEn: {
      biochemistry: 'Selenocysteine is recognized as the 21st amino acid, inserted via UGA stop codons guided by SECIS RNA hairpins.',
      neuroscience: 'Astrocytic type 2 iodothyronine deiodinase (DIO2) locally supplies neurons with active T3 for brain metabolism. Selenoprotein P crosses the blood-brain barrier via ApoER2 endocytosis.',
      receptorsTransporters: 'SELENOP, ApoER2 receptor, megalin.'
    },
    scientificReferences: [
      'Rayman MP (2012): Selenium and human health. Lancet.',
      'Scharpf M et al. (2007): The importance of selenium in thyroid disease. Horm Metab Res.'
    ]
  }
];
