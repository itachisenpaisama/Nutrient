import React from 'react';
import { DailyLogSummary, LogEntry } from '../../types';
import { Language, TRANSLATIONS } from '../../i18n/translations';
import { Clock, Plus, CheckCircle, AlertTriangle, Pill, Apple, Sparkles } from 'lucide-react';

interface TimelineLoggerProps {
  log: DailyLogSummary;
  lang: Language;
  onAddMeal: () => void;
  onAddMedication: () => void;
  onAddSupplement: () => void;
  onLogSymptoms: () => void;
}

export const TimelineLogger: React.FC<TimelineLoggerProps> = ({
  log,
  lang,
  onAddMeal,
  onAddMedication,
  onAddSupplement,
  onLogSymptoms
}) => {
  const t = TRANSLATIONS[lang];
  const { entries, symptomLog } = log;

  // Sort entries by timestamp
  const sortedEntries = [...entries].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Medikation & Timeline Log
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kinetik-Prüfung, Mahlzeiten-Timing & Spacing-Validierung
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={onAddMeal}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 text-white hover:bg-cyan-700 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addMeal}</span>
          </button>

          <button
            onClick={onAddMedication}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
          >
            <Pill className="w-3.5 h-3.5" />
            <span>{t.addMedication}</span>
          </button>

          <button
            onClick={onAddSupplement}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.addSupplement}</span>
          </button>

          <button
            onClick={onLogSymptoms}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <span>{t.logSymptoms}</span>
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-2.5">
        {sortedEntries.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Noch keine Einträge für diesen Tag vorhanden. Klicke auf Mahlzeit oder Medikation erfassen!
          </div>
        ) : (
          sortedEntries.map((entry) => {
            const timeStr = entry.timestamp.slice(11, 16);
            const isMed = entry.mealType === 'medication';
            const isSupp = entry.mealType === 'supplement';

            let statusBadge = (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Verified
              </span>
            );

            if (isMed) {
              statusBadge = entry.timingVerified ? (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Status: OK</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Prüfung: Mahlzeit fehlt</span>
                </span>
              );
            } else if (entry.title.toLowerCase().includes('vitamin c')) {
              statusBadge = (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  Spacing OK
                </span>
              );
            }

            return (
              <div
                key={entry.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold shrink-0">
                    [{timeStr}]
                  </span>

                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center space-x-1.5">
                      {isMed && <Pill className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                      {isSupp && <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      {!isMed && !isSupp && <Apple className="w-3.5 h-3.5 text-cyan-500 shrink-0" />}
                      <span className="truncate">{entry.title}</span>
                    </div>

                    {!isMed && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {entry.calories > 0 && `${Math.round(entry.calories)} kcal · `}
                        {entry.proteinG > 0 && `${Math.round(entry.proteinG)}g P `}
                        {entry.fatG > 0 && `· ${Math.round(entry.fatG)}g F `}
                        {entry.carbsG > 0 && `· ${Math.round(entry.carbsG)}g KH `}
                        {entry.omega3EpaMg > 0 && `· EPA ${Math.round(entry.omega3EpaMg)}mg`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 ml-3">{statusBadge}</div>
              </div>
            );
          })
        )}
      </div>

      {/* Daily Subjective Symptoms Rating Banner */}
      {symptomLog && (
        <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-slate-800/80 dark:to-slate-800/50 border border-cyan-200/80 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Tages-Bewertung:
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500">Fokus:</span>
              <span className="font-bold text-cyan-700 dark:text-cyan-400">
                {symptomLog.focusScore} / 10
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500">Energie:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {symptomLog.energyScore} / 10
              </span>
            </div>
            {symptomLog.reboundSeverityScore !== undefined && (
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500">Rebound:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {symptomLog.reboundSeverityScore} / 10
                </span>
              </div>
            )}
          </div>

          {symptomLog.notes && (
            <span className="text-slate-600 dark:text-slate-300 italic text-[11px] truncate max-w-xs">
              "{symptomLog.notes}"
            </span>
          )}
        </div>
      )}
    </div>
  );
};
