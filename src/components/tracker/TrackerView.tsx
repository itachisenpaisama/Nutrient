import React from 'react';
import { DailyLogSummary, NutrientPlan, UserProfile, LogEntry } from '../../types';
import { Language, TRANSLATIONS } from '../../i18n/translations';
import {
  UtensilsCrossed,
  Plus,
  Pill,
  Sparkles,
  Trash2,
  Calendar,
  Clock,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface TrackerViewProps {
  logs: DailyLogSummary[];
  profile: UserProfile;
  plan: NutrientPlan;
  lang: Language;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onAddMeal: () => void;
  onAddMedication: () => void;
  onAddSupplement: () => void;
  onLogSymptoms: () => void;
  onDeleteEntry: (entryId: string) => void;
}

export const TrackerView: React.FC<TrackerViewProps> = ({
  logs,
  profile,
  plan,
  lang,
  selectedDate,
  onDateChange,
  onAddMeal,
  onAddMedication,
  onAddSupplement,
  onLogSymptoms,
  onDeleteEntry
}) => {
  const t = TRANSLATIONS[lang];

  const currentLog = logs.find((l) => l.date === selectedDate) || {
    date: selectedDate,
    entries: [],
    totals: {
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
    },
    scorePct: 0,
    cofactorsMet: {
      iron: false,
      magnesium: false,
      p5pB6: false,
      zinc: false,
      omega3Epa: false,
      vitaminB12: false,
      fiber: false
    },
    alerts: []
  };

  const { entries, totals, symptomLog } = currentLog;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Detailliertes Mahlzeiten- &amp; Nährstoff-Tracking</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tages-Tracker &amp; Protokoll ({selectedDate})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Erfasse Mahlzeiten, Stimulanzien-Dosen und Mikronährstoffe mit automatischer Kinetik-Validierung.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onAddMeal}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white transition shadow-sm shadow-cyan-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Mahlzeit</span>
          </button>
          <button
            onClick={onAddMedication}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm shadow-indigo-600/20 cursor-pointer"
          >
            <Pill className="w-4 h-4" />
            <span>Medikation</span>
          </button>
          <button
            onClick={onAddSupplement}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm shadow-emerald-600/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Supplement</span>
          </button>
          <button
            onClick={onLogSymptoms}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <Activity className="w-4 h-4 text-cyan-500" />
            <span>Symptome</span>
          </button>
        </div>
      </div>

      {/* Grid: Entries List & Micronutrient Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Log Entries */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Protokollierte Einträge am {selectedDate} ({entries.length})
            </h2>

            {entries.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Keine Einträge für diesen Tag. Klicke oben auf Mahlzeit, Medikation oder Supplement erfassen.
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => {
                  const isMed = entry.mealType === 'medication';
                  const isSupp = entry.mealType === 'supplement';
                  const time = entry.timestamp.slice(11, 16);

                  return (
                    <div
                      key={entry.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-start justify-between gap-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold shrink-0 mt-0.5">
                          {time}
                        </span>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {entry.title}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {entry.mealType}
                            </span>
                          </div>

                          {!isMed && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-2">
                              <span><strong>{entry.calories}</strong> kcal</span>
                              <span>•</span>
                              <span>P: <strong>{entry.proteinG}g</strong></span>
                              <span>•</span>
                              <span>KH: <strong>{entry.carbsG}g</strong></span>
                              <span>•</span>
                              <span>F: <strong>{entry.fatG}g</strong></span>
                              {entry.fiberG > 0 && <span>(Ballaststoffe: {entry.fiberG}g)</span>}
                            </div>
                          )}

                          {entry.warningNote && (
                            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                              ⚠ {entry.warningNote}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer shrink-0"
                        title="Eintrag löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Micronutrient Status Card */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
              Tages-Mikronährstoffe vs. Ziel
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-700 dark:text-slate-300">Omega-3 EPA:</span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {Math.round(totals.omega3EpaMg)} / {plan.omega3EpaMg} mg
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-700 dark:text-slate-300">Magnesium:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {Math.round(totals.magnesiumMg)} / {plan.magnesiumMg} mg
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-700 dark:text-slate-300">Eisen:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {totals.ironMg.toFixed(1)} / {plan.ironMg} mg
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-700 dark:text-slate-300">Zink:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {totals.zincMg.toFixed(1)} / {plan.zincMg} mg
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-700 dark:text-slate-300">Vitamin B6 (P5P):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {totals.vitaminB6Mg.toFixed(1)} / {plan.vitaminB6Mg} mg
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-700 dark:text-slate-300">Vitamin C:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {totals.vitaminCMg.toFixed(0)} / {plan.vitaminCMg} mg
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-700 dark:text-slate-300">Vitamin D3:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {totals.vitaminD3Iu.toFixed(0)} / {plan.vitaminD3Iu} IE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
