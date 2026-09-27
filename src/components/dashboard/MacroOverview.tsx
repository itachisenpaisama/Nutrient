import React from 'react';
import { NutrientPlan, DailyLogSummary } from '../../types';
import { Language, TRANSLATIONS } from '../../i18n/translations';
import { Flame, ShieldAlert, Award } from 'lucide-react';

interface MacroOverviewProps {
  plan: NutrientPlan;
  log: DailyLogSummary;
  lang: Language;
}

export const MacroOverview: React.FC<MacroOverviewProps> = ({ plan, log, lang }) => {
  const t = TRANSLATIONS[lang];
  const { totals } = log;

  const calPct = Math.min(150, Math.round((totals.calories / Math.max(1, plan.targetCalories)) * 100));
  const protPct = Math.min(150, Math.round((totals.proteinG / Math.max(1, plan.proteinGrams)) * 100));
  const carbPct = Math.min(150, Math.round((totals.carbsG / Math.max(1, plan.carbGrams)) * 100));
  const fatPct = Math.min(150, Math.round((totals.fatG / Math.max(1, plan.fatGrams)) * 100));
  const fiberPct = Math.min(150, Math.round((totals.fiberG / Math.max(1, plan.fiberGrams)) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Kalorien- & Makro-Overview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zielwerte aus Kaskaden-Berechnung
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-extrabold text-slate-900 dark:text-white">
            {totals.calories.toLocaleString()} / {plan.targetCalories.toLocaleString()} <span className="text-xs font-normal text-slate-500">kcal</span>
          </div>
          <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
            {calPct}% des Tagesziels
          </div>
        </div>
      </div>

      {/* Primary Calorie Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mb-6">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            calPct > 105 ? 'bg-amber-500' : 'bg-cyan-600 dark:bg-cyan-500'
          }`}
          style={{ width: `${Math.min(100, calPct)}%` }}
        />
      </div>

      {/* Grid of 4 Macros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Protein */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
            <span>{t.protein}</span>
            <span className="text-cyan-600 dark:text-cyan-400">{protPct}%</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">
            {Math.round(totals.proteinG)}g <span className="text-xs font-normal text-slate-400">/ {plan.proteinGrams}g</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, protPct)}%` }}
            />
          </div>
        </div>

        {/* Carbohydrates */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
            <span>{t.carbs}</span>
            <span className="text-cyan-600 dark:text-cyan-400">{carbPct}%</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">
            {Math.round(totals.carbsG)}g <span className="text-xs font-normal text-slate-400">/ {plan.carbGrams}g</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, carbPct)}%` }}
            />
          </div>
        </div>

        {/* Fats */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
            <span>{t.fats}</span>
            <span className="text-cyan-600 dark:text-cyan-400">{fatPct}%</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">
            {Math.round(totals.fatG)}g <span className="text-xs font-normal text-slate-400">/ {plan.fatGrams}g</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, fatPct)}%` }}
            />
          </div>
        </div>

        {/* Fiber */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
            <span>{t.fiber}</span>
            <span className="text-cyan-600 dark:text-cyan-400">{fiberPct}%</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">
            {Math.round(totals.fiberG)}g <span className="text-xs font-normal text-slate-400">/ {plan.fiberGrams}g</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, fiberPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Safety warning if carbs < 50g */}
      {plan.carbWarning && (
        <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 flex items-start space-x-2.5 text-xs text-amber-800 dark:text-amber-300">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <span>{plan.carbWarning}</span>
        </div>
      )}
    </div>
  );
};
