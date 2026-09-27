import React, { useState } from 'react';
import { DailyLogSummary, NutrientPlan, UserProfile, LogEntry, InteractionAlert, DailySymptomLog } from '../../types';
import { Language, TRANSLATIONS } from '../../i18n/translations';
import { MacroOverview } from './MacroOverview';
import { NeuroScoreCard } from './NeuroScoreCard';
import { TimelineLogger } from './TimelineLogger';
import { ToxicologyAlertsCard } from './ToxicologyAlertsCard';
import { perform30DayToxicologyAudit } from '../../services/toxicologyEngine';
import { evaluateDailyInteractions } from '../../services/interactionEngine';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  Info
} from 'lucide-react';

interface DailyDashboardProps {
  logs: DailyLogSummary[];
  profile: UserProfile;
  plan: NutrientPlan;
  lang: Language;
  onAddMeal: () => void;
  onAddMedication: () => void;
  onAddSupplement: () => void;
  onLogSymptoms: () => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const DailyDashboard: React.FC<DailyDashboardProps> = ({
  logs,
  profile,
  plan,
  lang,
  onAddMeal,
  onAddMedication,
  onAddSupplement,
  onLogSymptoms,
  selectedDate,
  onDateChange
}) => {
  const t = TRANSLATIONS[lang];

  // Find log for currently selected date or generate blank template
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

  // Run live daily interactions
  const dynamicAlerts = evaluateDailyInteractions(profile, currentLog.entries);
  const toxicologyReport = perform30DayToxicologyAudit(logs);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().slice(0, 10));
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().slice(0, 10));
  };

  return (
    <div className="space-y-6">
      {/* Date Navigation & Profile Summary Banner */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Date switcher */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Vorheriger Tag"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
            <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Datum: {selectedDate}</span>
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Nächster Tag"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Pill matching PDF Layout spec: [Datum: 24. Oktober] [Profil: ADHS + Medikinet] */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Aktives Profil:</span>
          <span className="px-2.5 py-1 rounded-lg font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
            {profile.neuroModifier !== 'NONE' ? profile.neuroModifier : 'Standard'}
            {profile.medications && profile.medications.length > 0
              ? ` + ${profile.medications.join(', ')}`
              : profile.medication !== 'NONE'
              ? ` + ${profile.medication}`
              : ''}
          </span>
        </div>
      </div>

      {/* Safety / Interaction Alerts Banner if triggered */}
      {dynamicAlerts.length > 0 && (
        <div className="space-y-3">
          {dynamicAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs animate-in fade-in duration-200 ${
                alert.severity === 'CRITICAL_LOCK'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}
            >
              {alert.severity === 'CRITICAL_LOCK' ? (
                <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-bold text-sm mb-1">{alert.titleDe}</div>
                <p className="leading-relaxed mb-1">{alert.messageDe}</p>
                <div className="font-semibold underline">
                  {alert.actionRecommendationDe}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Primary Cockpit: Macros & Neuro-Score */}
      <div className="grid grid-cols-1 gap-6">
        <MacroOverview plan={plan} log={currentLog} lang={lang} />
        <NeuroScoreCard log={currentLog} plan={plan} lang={lang} />
      </div>

      {/* Timeline Log */}
      <TimelineLogger
        log={currentLog}
        lang={lang}
        onAddMeal={onAddMeal}
        onAddMedication={onAddMedication}
        onAddSupplement={onAddSupplement}
        onLogSymptoms={onLogSymptoms}
      />

      {/* Toxicology & Accumulation Monitoring Card */}
      <ToxicologyAlertsCard report={toxicologyReport} />
    </div>
  );
};
