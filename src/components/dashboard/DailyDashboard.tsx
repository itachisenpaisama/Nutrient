import React from 'react';
import { DailyLogSummary, NutrientPlan, UserProfile } from '../../types';
import { Language, TRANSLATIONS } from '../../i18n/translations';
import { MacroOverview } from './MacroOverview';
import { NeuroScoreCard } from './NeuroScoreCard';
import { TimelineLogger } from './TimelineLogger';
import { ToxicologyAlertsCard } from './ToxicologyAlertsCard';
import { HydrationCard } from './HydrationCard';
import { perform30DayToxicologyAudit } from '../../services/toxicologyEngine';
import { evaluateDailyInteractions } from '../../services/interactionEngine';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  Users,
  Plus,
  Check
} from 'lucide-react';

interface DailyDashboardProps {
  logs: DailyLogSummary[];
  profile: UserProfile;
  allProfiles: UserProfile[];
  onSelectProfile: (profileId: string) => void;
  onOpenCreateProfile: () => void;
  plan: NutrientPlan;
  lang: Language;
  onAddMeal: () => void;
  onAddMedication: () => void;
  onAddSupplement: () => void;
  onLogSymptoms: () => void;
  onAddWater: (deltaMl: number) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const DailyDashboard: React.FC<DailyDashboardProps> = ({
  logs,
  profile,
  allProfiles,
  onSelectProfile,
  onOpenCreateProfile,
  plan,
  lang,
  onAddMeal,
  onAddMedication,
  onAddSupplement,
  onLogSymptoms,
  onAddWater,
  selectedDate,
  onDateChange
}) => {
  const t = TRANSLATIONS[lang];

  // Find log for currently selected date or generate blank template
  const currentLog = logs.find((l) => l.date === selectedDate) || {
    date: selectedDate,
    entries: [],
    waterMl: 0,
    waterGoalMl: profile.waterGoalMl || 3000,
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
      {/* Date Navigation & Interactive Profile Switcher Cockpit */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          {/* Date switcher */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevDay}
              className="h-8 w-8 rounded-xl shrink-0"
              title="Vorheriger Tag"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
              <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Datum: {selectedDate}</span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextDay}
              className="h-8 w-8 rounded-xl shrink-0"
              title="Nächster Tag"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Active Profile Info */}
          <div className="flex items-center space-x-2 min-w-0">
            <span className="text-xs text-slate-400 shrink-0">Aktives Profil:</span>
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 text-xs font-bold text-cyan-900 dark:text-cyan-200 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: profile.avatarColor || '#06b6d4' }}
              />
              <span className="truncate">{profile.name}</span>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono shrink-0">
                ({profile.neuroModifier})
              </span>
            </div>
          </div>
        </div>

        {/* 1-Click Multi-Profile Switcher Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            <Users className="w-3.5 h-3.5 text-cyan-500" />
            <span>Profile ({allProfiles.length}):</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {allProfiles.map((p) => {
              const isActive = p.id === profile.id;
              const initials = p.name ? p.name.slice(0, 2).toUpperCase() : 'P';
              const pColor = p.avatarColor || '#06b6d4';

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectProfile(p.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    isActive
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm shadow-cyan-600/30'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  title={`${p.name} (${p.neuroModifier}) aktivieren`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-md text-[8px] font-bold text-white flex items-center justify-center shrink-0"
                    style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : pColor }}
                  >
                    {initials}
                  </span>
                  <span>{p.name}</span>
                  {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              );
            })}

            <button
              type="button"
              onClick={onOpenCreateProfile}
              className="flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-semibold border border-dashed border-cyan-500 dark:border-cyan-600 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition cursor-pointer"
              title="Ein neues Benutzerprofil erstellen"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Neues Profil</span>
            </button>
          </div>
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

      {/* Hydration Tracker */}
      <HydrationCard
        waterMl={currentLog.waterMl || 0}
        waterGoalMl={currentLog.waterGoalMl || profile.waterGoalMl || 3000}
        onAddWater={onAddWater}
        profile={profile}
      />

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
