# NutriNeuro – Scientific Nutrient Tracking & Neuro-Profiling Engine

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Evidenzbasierte Nährstoff-Tracking- & Neuro-Profiling-Anwendung mit klinischer Wissensdatenbank (Laie & Deep-Dive), Pearson-Symptom-Korrelationen, Kinetik-Sicherheits-Engine, 30-Tage Toxikologie-Monitoring und strukturierter Datenablage.

---

## 🌟 Highlights & Funktionen

### 1. Nährstoff-Wissensdatenbank (Lexikon)
- **Zwei umschaltbare Informationsebenen:**
  - **Laie**: Schnelle, anschauliche Zusammenfassung von Funktionen, Alltagsrelevanz, Verzehrempfehlungen und besten Quellen.
  - **Deep Dive (Biochemie & ZNS)**: Detaillierte Fachinformationen zu Enzymkaskaden (mTORC1, Sestrin2, Tyrosin-Hydroxylase, SVCT2, DBH, GAD, AADC, COMT), Transportern (LAT1, DMT1, TRPM6) und Rezeptoren (NMDA-Porenblock, DAT-Allosterie).
- **Vollständige Nährstoffabdeckung**:
  - **Makronährstoffe**: Proteine & Aminosäuren, Kohlenhydrate & Ballaststoffe (Inulin, Pektin, resistente Stärke Typ 3), Fette & Omega-3 (EPA/DHA 3:1).
  - **Neuro-Vitamine**: Vitamin B6 (P5P), B9 Folat (5-MTHF) & B12 (Methylcobalamin), Vitamin D3 & K2 (MK-7 all-trans), Vitamin C (Ascorbinsäure).
  - **Mineralstoffe & Spurenelemente**: Magnesium (Bisglycinat/L-Threonat), Eisen ($Fe^{2+}$ vs. $Fe^{3+}$, DMT1), Zink & Kupfer (DAT-Modulation, Metallothionein-Balance).
  - **Erweiterungen**: Cholin (Acetylcholin, Vagusnerv) und Selen (Glutathion-Peroxidase, Dejodasen).

### 2. Biometrisches Profiling-System & Mathematische Berechnungen
- **Anthropometrische Erfassung**: Alter, Geschlecht (m/w/d), Größe, Gewicht, optionaler KFA%.
- **Lean Body Mass (LBM)**: $LBM = kg \times (1 - \frac{KFA}{100})$.
- **Dynamische BMR-Formel**: Katch-McArdle ($370 + 21,6 \times LBM$) bei bekanntem KFA, sonst Mifflin-St Jeor.
- **TDEE & Ziel-Kalorien**: $TDEE = BMR \times PAL$ (-20% bei Fettabbau, 100% Maintenance, +7,5% Muskelaufbau).
- **Kaskaden-Makroallokation**:
  1. Protein: 2,0–2,4 g/kg LBM (Fettabbau) bzw. 1,7 g/kg KG (Maintenance).
  2. Fett: Hormonschutz-Untergrenze mind. 20% kcal oder 1,0 g/kg KG.
  3. Kohlenhydrate: Restkalorien für Gehirn-Glukosebedarf. Warnung bei $< 50$ g/Tag bezüglich T3-Konvertierung und Dopaminsynthese.

### 3. Neurodivergenz-Modifikatoren & Kinetik-Sicherheits-Engine
- **ADHS**: Dopamin-Kofaktoren (Ferritin $> 50$ µg/l), Omega-3 EPA:DHA 3:1 (1.500–2.000 mg/Tag), Magnesium & Zink $+20\%$, bioaktives P5P.
- **Autismus (ASD)**: Mikrobiom-Fokus mit 35–40 g/Tag Ballaststoffen (Inulin, Pektin, resistente Stärke) für Butyrat (SCFA) und Reizdarm-Filter (Gluten-/Kasein-Tracking).
- **Medikinet / Ritalin**: Kinetik-Prüfung vor Einnahme (mind. 15g Protein und 8g Fett gegen "Dose Dumping" und Rebound-Crashes). Warnung bei Vitamin C / Säuren innerhalb von 90–120 Min wegen renaler Ausscheidung.
- **SSRI**: `CRITICAL_LOCK`-Blockade gegen 5-HTP, L-Tryptophan, Johanniskraut oder SAMe (Lebensgefahr durch Serotonin-Syndrom).

### 4. Tracking, Statistiken & Pearson-Korrelations-Engine
- **Tages-, Wochen-, Monats- und Jahres-Übersichten** mit responsiven Diagrammen.
- **Toxikologie- & Akkumulations-Audit (30 Tage)**: Überwachung gegen EFSA Upper Limits (B6, Eisen, Selen, Zink, D3).
- **Pearson-Korrelation ($r$)**:
  $$r = \frac{\sum (X - \bar{X})(Y - \bar{Y})}{\sqrt{\sum (X - \bar{X})^2 \sum (Y - \bar{Y})^2}}$$
- **1-Klick Plananpassung**: Empirisch erkannte Optimierungsvorschläge können mit 1 Klick direkt bestätigt und in das Profil übernommen werden.

### 5. Strukturierter Datei-Tresor (Ordner-Hierarchie & Backup)
- Standardisierter JSON-Dateibaum (`nutri_vault/profiles/`, `plans/`, `logs/YYYY/MM/`, `toxicology/`, `analytics/`).
- Integrierter JSON-Viewer, Single-File-Downloads und vollständiger JSON-Backup-Export/-Import.

### 6. Modernes UI/UX, Themes & Lokalisierung
- Entwickelt nach den Leitlinien des **ui-ux-pro-max**-Standards.
- **Dark Mode & Light Mode**: Jederzeit umschaltbar mit butterweichem Wechsel.
- **Zweisprachig (Deutsch & Englisch)**: Vollständige Lokalisierung aller UI-Texte, Nährstoffe und Warnungen.

---

## 🚀 Installation & Lokaler Start

### Voraussetzungen
- Node.js (>= 18.x oder 20+)
- npm (>= 9.x)

### Schritte
1. Repository klonen:
   ```bash
   git clone https://github.com/itachisenpaisama/Nutrient.git
   cd Nutrient
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

3. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```
   Die Anwendung öffnet sich unter `http://localhost:5173/`.

4. Produktions-Build erstellen:
   ```bash
   npm run build
   ```

---

## 📂 Projektstruktur

```
├── public/
│   └── favicon.svg               # SVG-Favicon
├── src/
│   ├── types/                    # TypeScript Typdefinitionen
│   ├── i18n/                     # Zweisprachiges Wörterbuch (DE / EN)
│   ├── data/                     # Wissensdatenbank, Lebensmittel & Regeln
│   │   ├── lexicon.ts
│   │   ├── foodDatabase.ts
│   │   ├── interactionMatrix.ts
│   │   └── demoDataset.ts
│   ├── services/                 # Mathematische & statistische Engines
│   │   ├── calculationEngine.ts  # BMR, TDEE, Kaskaden
│   │   ├── interactionEngine.ts  # Kinetik-Checks & Locks
│   │   ├── toxicologyEngine.ts   # 30-Tage EFSA Audit
│   │   ├── analyticsEngine.ts    # Pearson-Korrelationen
│   │   └── storageService.ts     # Datei-Vault & LocalStorage
│   ├── components/               # UI-Komponenten (Dashboard, Tracker, etc.)
│   ├── App.tsx                   # Hauptkomponente
│   ├── main.tsx
│   └── index.css                 # Tailwind v4 Styles & Themes
└── package.json
```

---

## 📜 Lizenz
MIT License.
