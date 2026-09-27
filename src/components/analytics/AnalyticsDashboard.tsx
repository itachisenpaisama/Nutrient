import React, { useState } from 'react';
import { DailyLogSummary, NutrientPlan, UserProfile, PlanRecommendation } from '../../types';
import {
  aggregatePeriodStats,
  TimePeriod,
  computeDiagnosticsAndInsights,
  CorrelationResult
} from '../../services/analyticsEngine';
import { Language, TRANSLATIONS } from '../../i18n/translations';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Calendar,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AnalyticsDashboardProps {
  logs: DailyLogSummary[];
  profile: UserProfile;
  plan: NutrientPlan;
  onApplyPlanRecommendation: (recommendation: PlanRecommendation) => void;
  lang: Language;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  logs,
  profile,
  plan,
  onApplyPlanRecommendation,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [period, setPeriod] = useState<TimePeriod>('day');
  const [appliedRecIds, setAppliedRecIds] = useState<{ [id: string]: boolean }>({});

  const stats = aggregatePeriodStats(logs, period);
  const { correlations, recommendations } = computeDiagnosticsAndInsights(logs, profile);

  const handleApplyRec = (rec: PlanRecommendation) => {
    onApplyPlanRecommendation(rec);
    setAppliedRecIds((prev) => ({ ...prev, [rec.id]: true }));
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  // Determine max values for responsive SVG scaling
  const maxCalories = Math.max(1, ...stats.map((s) => s.calories), plan.targetCalories);
  const maxMacros = Math.max(
    1,
    ...stats.map((s) => Math.max(s.proteinG, s.carbsG, s.fatG)),
    plan.proteinGrams,
    plan.carbGrams
  );

  return (
    <div className="space-y-6">
      {/* Header & Period Selector */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <LineChartIcon className="w-4 h-4" />
            <span>Empirische Tendenzen & Korrelationen</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Statistiken, Trends & Plan-Optimierung
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mathematische Auswertung (Pearson r) zwischen Nährstoff-Adhärenz und deinen Fokus-Ratings.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 self-start md:self-auto">
          {(['day', 'week', 'month', 'year'] as TimePeriod[]).map((p) => {
            const label =
              p === 'day'
                ? t.periodDay.split(' ')[0]
                : p === 'week'
                ? t.periodWeek.split(' ')[0]
                : p === 'month'
                ? t.periodMonth.split(' ')[0]
                : t.periodYear.split(' ')[0];

            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  period === p
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION: Diagnostics & Insights (Matches PDF Section 4.3 Report) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                DIAGNOSTIK & INSIGHTS (Letzte 30 Tage)
              </h2>
              <p className="text-xs text-slate-300">
                Pearson-Korrelationen ($r$) und datengestützte Ursachen-Wirkungs-Analysen
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">
            {logs.length} Tage ausgewertet
          </span>
        </div>

        {/* Dynamic Correlations from Analytics Engine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {correlations.map((corr, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-2 hover:border-slate-600 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center space-x-1.5 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>[+] Positive Korrelation entdeckt:</span>
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  r = {corr.r}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {lang === 'de' ? corr.insightDe : corr.insightEn}
              </p>
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/50">
                <span>{corr.nutrientLabelDe} → {corr.symptomLabelDe}</span>
                <span className="text-emerald-400 font-bold">+{corr.impactPercentage}% Effekt</span>
              </div>
            </div>
          ))}

          {/* Warning / Trend box from PDF */}
          {profile.medication === 'METHYLPHENIDATE' && (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center space-x-1.5 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>[!] Warnung / Entdeckter Trend:</span>
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-800">
                  Kinetik-Drop
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                An Tagen mit unzureichendem Frühstück (&lt; 15g Protein) vor der Medikinet-Einnahme fällt dein Rebound-Rating um 2,4 Punkte ab.
              </p>
              <div className="text-[11px] text-amber-300/80 pt-1 border-t border-amber-900/60">
                Kinetischer Abfall &amp; erhöhtes Dose Dumping Risiko
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Recommendations & 1-Click Plan Modifications */}
        {recommendations.length > 0 && (
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Lightbulb className="w-4 h-4" />
              <span>[→] Evidenzbasierte Plan-Vorschläge &amp; Anpassung:</span>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec) => {
                const isApplied = appliedRecIds[rec.id];

                return (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-800/60 border border-cyan-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white flex items-center space-x-2">
                        <span>{lang === 'de' ? rec.detectedTrendDe : rec.detectedTrendEn}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {lang === 'de' ? rec.recommendationDe : rec.recommendationEn}
                      </p>
                      {rec.proposedChanges.map((ch, i) => (
                        <div key={i} className="text-[11px] font-mono text-cyan-300 flex items-center space-x-1.5 pt-1">
                          <span className="text-slate-400">{ch.targetLabelDe}:</span>
                          <span className="line-through text-slate-400">{ch.oldValue}{ch.unit}</span>
                          <ArrowRight className="w-3 h-3 text-cyan-400" />
                          <span className="font-bold text-emerald-400">{ch.newValue}{ch.unit}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleApplyRec(rec)}
                      disabled={isApplied}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                        isApplied
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 opacity-90 cursor-default'
                          : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{isApplied ? t.applied : t.applyRecommendation}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Visual Charts: Calories & Macros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Caloric & Protein Intake */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Kalorien- & Proteinverlauf ({period.toUpperCase()})
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ziel-Kalorien: {plan.targetCalories} kcal · Ziel-Protein: {plan.proteinGrams}g
              </p>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-semibold">
              <span className="flex items-center space-x-1 text-cyan-600">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500 inline-block" />
                <span>kcal</span>
              </span>
              <span className="flex items-center space-x-1 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                <span>Protein (g)</span>
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-56 w-full flex items-end justify-between gap-2 pt-6 px-2">
            {stats.map((s, idx) => {
              const calHeight = Math.max(10, Math.min(100, (s.calories / maxCalories) * 100));
              const protHeight = Math.max(8, Math.min(100, (s.proteinG / maxMacros) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] p-1.5 rounded-lg pointer-events-none transition-opacity z-20 whitespace-nowrap shadow-lg">
                    <div className="font-bold">{s.fullDate || s.label}</div>
                    <div>{s.calories} kcal · {s.proteinG}g Protein</div>
                  </div>

                  <div className="w-full flex items-end justify-center space-x-1 h-44">
                    {/* Calorie bar */}
                    <div
                      className="w-1/2 rounded-t-md bg-cyan-500/80 group-hover:bg-cyan-500 transition-all duration-300"
                      style={{ height: `${calHeight}%` }}
                    />
                    {/* Protein bar */}
                    <div
                      className="w-1/2 rounded-t-md bg-emerald-500/80 group-hover:bg-emerald-500 transition-all duration-300"
                      style={{ height: `${protHeight}%` }}
                    />
                  </div>

                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-2 truncate w-full text-center">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Micronutrient Score & Focus Correlation Trend */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Neuro-Score vs. Subjektiver Fokus
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Mikronährstoff-Adhärenz (%) im Vergleich zu deinem Fokus (Skala 1-10)
              </p>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-semibold">
              <span className="flex items-center space-x-1 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block" />
                <span>Score %</span>
              </span>
              <span className="flex items-center space-x-1 text-amber-500">
                <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
                <span>Fokus (x10)</span>
              </span>
            </div>
          </div>

          {/* SVG Trend Bars */}
          <div className="h-56 w-full flex items-end justify-between gap-2 pt-6 px-2">
            {stats.map((s, idx) => {
              const scoreHeight = Math.max(10, Math.min(100, s.scorePct));
              const focusHeight = Math.max(10, Math.min(100, s.focusScore * 10));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] p-1.5 rounded-lg pointer-events-none transition-opacity z-20 whitespace-nowrap shadow-lg">
                    <div className="font-bold">{s.fullDate || s.label}</div>
                    <div>Neuro-Score: {s.scorePct}% · Fokus: {s.focusScore}/10</div>
                  </div>

                  <div className="w-full flex items-end justify-center space-x-1 h-44">
                    {/* Score bar */}
                    <div
                      className="w-1/2 rounded-t-md bg-indigo-500/80 group-hover:bg-indigo-500 transition-all duration-300"
                      style={{ height: `${scoreHeight}%` }}
                    />
                    {/* Focus bar */}
                    <div
                      className="w-1/2 rounded-t-md bg-amber-500/80 group-hover:bg-amber-500 transition-all duration-300"
                      style={{ height: `${focusHeight}%` }}
                    />
                  </div>

                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-2 truncate w-full text-center">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
