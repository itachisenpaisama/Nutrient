import React, { useState } from 'react';
import { NUTRIENT_LEXICON } from '../../data/lexicon';
import { NutrientLexiconEntry, NutrientCategory } from '../../types';
import { Language, TRANSLATIONS } from '../../i18n/translations';
import {
  Search,
  BookOpen,
  Atom,
  Zap,
  Tag,
  Dna,
  ExternalLink,
  ChevronRight,
  Layers,
  X,
  AlertOctagon
} from 'lucide-react';

interface LexiconViewProps {
  lang: Language;
}

export const LexiconView: React.FC<LexiconViewProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDeepDiveEntry, setActiveDeepDiveEntry] = useState<NutrientLexiconEntry | null>(null);
  const [activeCardTab, setActiveCardTab] = useState<{ [entryId: string]: 'layman' | 'deep' }>({});

  const toggleCardTab = (id: string, tab: 'layman' | 'deep') => {
    setActiveCardTab((prev) => ({ ...prev, [id]: tab }));
  };

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: t.allCategories },
    { id: 'macronutrient', label: t.categoryMacronutrient },
    { id: 'neuro-vitamin', label: t.categoryNeuroVitamin },
    { id: 'mineral', label: t.categoryMineral },
    { id: 'trace-element', label: t.categoryTraceElement }
  ];

  const filteredEntries = NUTRIENT_LEXICON.filter((entry) => {
    const matchesCat = selectedCategory === 'all' || entry.category === selectedCategory;
    const term = searchTerm.toLowerCase().trim();

    if (!term) return matchesCat;

    const inTitle =
      entry.titleDe.toLowerCase().includes(term) ||
      entry.titleEn.toLowerCase().includes(term);
    const inTags =
      entry.tagsDe.some((tg) => tg.toLowerCase().includes(term)) ||
      entry.tagsEn.some((tg) => tg.toLowerCase().includes(term));
    const inLayman =
      entry.laymanDe.toLowerCase().includes(term) ||
      entry.laymanEn.toLowerCase().includes(term);
    const inDeep =
      entry.deepDiveDe.biochemistry.toLowerCase().includes(term) ||
      entry.deepDiveDe.neuroscience.toLowerCase().includes(term) ||
      entry.deepDiveDe.receptorsTransporters.toLowerCase().includes(term);

    return matchesCat && (inTitle || inTags || inLayman || inDeep);
  });

  return (
    <div className="space-y-6">
      {/* Header and Search Hero */}
      <div className="bg-gradient-to-r from-cyan-900/10 via-slate-900/5 to-emerald-900/10 dark:from-slate-900 dark:to-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 text-xs font-semibold mb-3 border border-cyan-200 dark:border-cyan-800">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Evidenzbasierte Nährstoff-Wissensdatenbank</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Nährstoff-Lexikon & Neurobiologie
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
            Verstehe die exakten biochemischen Mechanismen, Kofaktoren und Transporter-Kinetiken hinter jedem Nährstoff. Wechsle jederzeit zwischen verständlicher Laien-Erklärung und tiefgehendem ZNS-Deep-Dive.
          </p>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchNutrients}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Nutrient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEntries.map((entry) => {
          const currentTab = activeCardTab[entry.id] || 'layman';
          const title = lang === 'de' ? entry.titleDe : entry.titleEn;
          const tags = lang === 'de' ? entry.tagsDe : entry.tagsEn;
          const laymanText = lang === 'de' ? entry.laymanDe : entry.laymanEn;
          const sources = lang === 'de' ? entry.sourcesDe : entry.sourcesEn;
          const tips = lang === 'de' ? entry.tipsDe : entry.tipsEn;
          const deepDive = lang === 'de' ? entry.deepDiveDe : entry.deepDiveEn;

          return (
            <div
              key={entry.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:border-cyan-500/50 transition-colors"
            >
              <div className="p-5">
                {/* Header of card */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {entry.category}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {title}
                    </h2>
                  </div>

                  {/* Deep Dive Action Button */}
                  <button
                    onClick={() => setActiveDeepDiveEntry(entry)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400 transition cursor-pointer"
                    title="Vollständigen ZNS-Deep-Dive öffnen"
                  >
                    <Dna className="w-4 h-4" />
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tags.map((tg) => (
                    <span
                      key={tg}
                      className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-medium"
                    >
                      #{tg}
                    </span>
                  ))}
                </div>

                {/* Layman vs Deep Dive Mode Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800 mb-3 text-xs font-semibold">
                  <button
                    onClick={() => toggleCardTab(entry.id, 'layman')}
                    className={`pb-2 px-3 border-b-2 transition cursor-pointer ${
                      currentTab === 'layman'
                        ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400 font-bold'
                        : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    {t.laymanTab}
                  </button>
                  <button
                    onClick={() => toggleCardTab(entry.id, 'deep')}
                    className={`pb-2 px-3 border-b-2 transition cursor-pointer flex items-center space-x-1 ${
                      currentTab === 'deep'
                        ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    <Atom className="w-3.5 h-3.5" />
                    <span>{t.deepDiveTab}</span>
                  </button>
                </div>

                {/* Content based on tab */}
                {currentTab === 'layman' ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {laymanText}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                        <Zap className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{t.recommendedIntake}:</span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Standard: </span>
                        {entry.intakeRecommendations.standard}
                      </div>
                      {entry.intakeRecommendations.adhd && (
                        <div className="text-slate-600 dark:text-slate-300">
                          <span className="font-semibold text-cyan-600 dark:text-cyan-400">ADHS / Neuro: </span>
                          {entry.intakeRecommendations.adhd}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-slate-700 dark:text-slate-300 space-y-2">
                      <div>
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                          Biochemischer Wirkmechanismus:
                        </span>
                        <p className="text-[11px] leading-relaxed">
                          {deepDive.biochemistry}
                        </p>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                          Neurobiologie & ZNS-Rezeptoren:
                        </span>
                        <p className="text-[11px] leading-relaxed">
                          {deepDive.neuroscience}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Top-Quellen: </span>
                  {sources.plant.slice(0, 2).concat(sources.animal.slice(0, 1)).join(', ')}
                </div>

                <button
                  onClick={() => setActiveDeepDiveEntry(entry)}
                  className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Mehr Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal / Deep Dive Details Drawer */}
      {activeDeepDiveEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
                  {activeDeepDiveEntry.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {lang === 'de' ? activeDeepDiveEntry.titleDe : activeDeepDiveEntry.titleEn}
                </h3>
              </div>
              <button
                onClick={() => setActiveDeepDiveEntry(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Biochemistry Section */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <Atom className="w-4 h-4 text-cyan-500" />
                  <span>Biochemische Kaskade & Kinetik</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  {lang === 'de'
                    ? activeDeepDiveEntry.deepDiveDe.biochemistry
                    : activeDeepDiveEntry.deepDiveEn.biochemistry}
                </p>
              </div>

              {/* Neuroscience Section */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <Dna className="w-4 h-4 text-emerald-500" />
                  <span>Neurobiologie & ZNS-Signalübertragung</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  {lang === 'de'
                    ? activeDeepDiveEntry.deepDiveDe.neuroscience
                    : activeDeepDiveEntry.deepDiveEn.neuroscience}
                </p>
              </div>

              {/* Receptors and Transporters */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>Transporter & Rezeptoren</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-mono p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  {lang === 'de'
                    ? activeDeepDiveEntry.deepDiveDe.receptorsTransporters
                    : activeDeepDiveEntry.deepDiveEn.receptorsTransporters}
                </p>
              </div>

              {/* Clinical Practice Tips & Pitfalls */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <AlertOctagon className="w-4 h-4 text-amber-500" />
                  <span>{t.tipsAndPitfalls}</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {(lang === 'de' ? activeDeepDiveEntry.tipsDe : activeDeepDiveEntry.tipsEn).map(
                    (tip, idx) => (
                      <li
                        key={idx}
                        className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40"
                      >
                        {tip}
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Scientific Peer-Reviewed Literature */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {t.scientificReferences}
                </h4>
                <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {activeDeepDiveEntry.scientificReferences.map((ref, i) => (
                    <div key={i} className="truncate">
                      • {ref}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveDeepDiveEntry(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 cursor-pointer transition"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
