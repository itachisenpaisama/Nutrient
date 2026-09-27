import React, { useState, useEffect } from 'react';
import { UserProfile, DailyLogSummary, NutrientPlan, LogEntry, InteractionAlert, DailySymptomLog, PlanRecommendation } from './types';
import { StorageService } from './services/storageService';
import { calculateNutrientPlan } from './services/calculationEngine';
import { evaluateDailyInteractions } from './services/interactionEngine';
import { Language, TRANSLATIONS } from './i18n/translations';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { DailyDashboard } from './components/dashboard/DailyDashboard';
import { TrackerView } from './components/tracker/TrackerView';
import { LexiconView } from './components/lexicon/LexiconView';
import { ProfileWizard } from './components/profile/ProfileWizard';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { FolderStructureView } from './components/vault/FolderStructureView';
import { MealLoggerModal } from './components/tracker/MealLoggerModal';
import { MedicationLoggerModal } from './components/tracker/MedicationLoggerModal';
import { SupplementLoggerModal } from './components/tracker/SupplementLoggerModal';
import { SymptomLoggerModal } from './components/tracker/SymptomLoggerModal';
import { InstallPromptModal } from './components/InstallPromptModal';

export const App: React.FC = () => {
  // Localization & Theme
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('nutri_lang') as Language) || 'de';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('nutri_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Core Data States
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [plan, setPlan] = useState<NutrientPlan>(() => StorageService.getPlan(profile));
  const [logs, setLogs] = useState<DailyLogSummary[]>(() => StorageService.getLogs());

  // Default selected date: 2026-09-27
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-27');

  // Modals state
  const [isMealModalOpen, setIsMealModalOpen] = useState<boolean>(false);
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState<boolean>(false);
  const [isSupplementModalOpen, setIsSupplementModalOpen] = useState<boolean>(false);
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // Sync theme to root html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nutri_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nutri_theme', 'light');
    }
  }, [isDark]);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('nutri_lang', newLang);
  };

  const handleThemeToggle = () => {
    setIsDark((prev) => !prev);
  };

  // Helper to update a day's log entries & totals
  const updateDayEntries = (date: string, newEntries: LogEntry[], extraAlert?: InteractionAlert) => {
    const existingIndex = logs.findIndex((l) => l.date === date);

    // Calculate new totals
    const totals = newEntries.reduce(
      (acc, cur) => {
        acc.calories += cur.calories || 0;
        acc.proteinG += cur.proteinG || 0;
        acc.carbsG += cur.carbsG || 0;
        acc.fatG += cur.fatG || 0;
        acc.fiberG += cur.fiberG || 0;
        acc.omega3EpaMg += cur.omega3EpaMg || 0;
        acc.omega3DhaMg += cur.omega3DhaMg || 0;
        acc.vitaminB6Mg += cur.vitaminB6Mg || 0;
        acc.vitaminB9Ug += cur.vitaminB9Ug || 0;
        acc.vitaminB12Ug += cur.vitaminB12Ug || 0;
        acc.vitaminD3Iu += cur.vitaminD3Iu || 0;
        acc.vitaminK2Ug += cur.vitaminK2Ug || 0;
        acc.vitaminCMg += cur.vitaminCMg || 0;
        acc.magnesiumMg += cur.magnesiumMg || 0;
        acc.ironMg += cur.ironMg || 0;
        acc.zincMg += cur.zincMg || 0;
        acc.copperMg += cur.copperMg || 0;
        return acc;
      },
      {
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
      }
    );

    const cofactorsMet = {
      iron: totals.ironMg >= plan.ironMg,
      magnesium: totals.magnesiumMg >= plan.magnesiumMg,
      p5pB6: totals.vitaminB6Mg >= plan.vitaminB6Mg,
      zinc: totals.zincMg >= plan.zincMg,
      omega3Epa: totals.omega3EpaMg >= plan.omega3EpaMg,
      vitaminB12: totals.vitaminB12Ug >= plan.vitaminB12Ug,
      fiber: totals.fiberG >= plan.fiberGrams
    };

    const metCount = Object.values(cofactorsMet).filter(Boolean).length;
    const scorePct = Math.round((metCount / Object.keys(cofactorsMet).length) * 100);

    const baseAlerts = evaluateDailyInteractions(profile, newEntries);
    if (extraAlert) baseAlerts.push(extraAlert);

    let updatedLogs: DailyLogSummary[];

    if (existingIndex >= 0) {
      const existing = logs[existingIndex];
      const updatedDay: DailyLogSummary = {
        ...existing,
        entries: newEntries,
        totals,
        cofactorsMet,
        scorePct,
        alerts: baseAlerts
      };
      updatedLogs = [...logs];
      updatedLogs[existingIndex] = updatedDay;
    } else {
      const newDay: DailyLogSummary = {
        date,
        entries: newEntries,
        totals,
        cofactorsMet,
        scorePct,
        alerts: baseAlerts
      };
      updatedLogs = [...logs, newDay];
    }

    setLogs(updatedLogs);
    StorageService.saveLogs(updatedLogs);
  };

  // Add Meal
  const handleSaveMeal = (entry: LogEntry) => {
    const currentDay = logs.find((l) => l.date === selectedDate);
    const entries = currentDay ? [...currentDay.entries, entry] : [entry];
    updateDayEntries(selectedDate, entries);
  };

  // Add Medication
  const handleSaveMedication = (entry: LogEntry) => {
    const currentDay = logs.find((l) => l.date === selectedDate);
    const entries = currentDay ? [...currentDay.entries, entry] : [entry];
    updateDayEntries(selectedDate, entries);
  };

  // Add Supplement
  const handleSaveSupplement = (entry: LogEntry, alert?: InteractionAlert) => {
    const currentDay = logs.find((l) => l.date === selectedDate);
    const entries = currentDay ? [...currentDay.entries, entry] : [entry];
    updateDayEntries(selectedDate, entries, alert);
  };

  // Save Symptoms
  const handleSaveSymptoms = (symptomLog: DailySymptomLog) => {
    const existingIndex = logs.findIndex((l) => l.date === selectedDate);
    if (existingIndex >= 0) {
      const updated = [...logs];
      updated[existingIndex] = {
        ...updated[existingIndex],
        symptomLog
      };
      setLogs(updated);
      StorageService.saveLogs(updated);
    } else {
      const newDay: DailyLogSummary = {
        date: selectedDate,
        entries: [],
        symptomLog,
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
      const updated = [...logs, newDay];
      setLogs(updated);
      StorageService.saveLogs(updated);
    }
  };

  // Delete Log Entry
  const handleDeleteEntry = (entryId: string) => {
    const currentDay = logs.find((l) => l.date === selectedDate);
    if (!currentDay) return;
    const remaining = currentDay.entries.filter((e) => e.id !== entryId);
    updateDayEntries(selectedDate, remaining);
  };

  // Profile Save
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    StorageService.saveProfile(updatedProfile);
    const newPlan = calculateNutrientPlan(updatedProfile);
    setPlan(newPlan);
    StorageService.savePlan(newPlan);
  };

  // 1-Click Plan Adaptation Confirmation
  const handleApplyPlanRecommendation = (rec: PlanRecommendation) => {
    const updatedPlan = { ...plan };
    for (const change of rec.proposedChanges) {
      if (change.targetKey === 'omega3EpaMg') {
        updatedPlan.omega3EpaMg = change.newValue as number;
      }
      if (change.targetKey === 'fiberGrams') {
        updatedPlan.fiberGrams = change.newValue as number;
      }
      if (change.targetKey === 'breakfastProteinFloor') {
        updatedPlan.specialGuidelines = [
          ...updatedPlan.specialGuidelines,
          `Optimiertes Ziel: Mindestens ${change.newValue}g Protein zum Frühstück vor der Medikation!`
        ];
      }
    }
    setPlan(updatedPlan);
    StorageService.savePlan(updatedPlan);
  };

  // Refresh data from storage
  const handleRefreshData = () => {
    setProfile(StorageService.getProfile());
    setPlan(StorageService.getPlan());
    setLogs(StorageService.getLogs());
  };

  // Active day entries for modals
  const activeDayEntries = logs.find((l) => l.date === selectedDate)?.entries || [];
  const activeDaySymptoms = logs.find((l) => l.date === selectedDate)?.symptomLog;
  const currentAlerts = logs.find((l) => l.date === selectedDate)?.alerts || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors">
      {/* Top Application Header */}
      <Header
        profile={profile}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
        activeAlerts={currentAlerts}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenInstallPrompt={() => setIsInstallModalOpen(true)}
      />

      {/* Navigation Bar */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} lang={lang} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DailyDashboard
            logs={logs}
            profile={profile}
            plan={plan}
            lang={lang}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onAddMeal={() => setIsMealModalOpen(true)}
            onAddMedication={() => setIsMedicationModalOpen(true)}
            onAddSupplement={() => setIsSupplementModalOpen(true)}
            onLogSymptoms={() => setIsSymptomModalOpen(true)}
          />
        )}

        {activeTab === 'tracker' && (
          <TrackerView
            logs={logs}
            profile={profile}
            plan={plan}
            lang={lang}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onAddMeal={() => setIsMealModalOpen(true)}
            onAddMedication={() => setIsMedicationModalOpen(true)}
            onAddSupplement={() => setIsSupplementModalOpen(true)}
            onLogSymptoms={() => setIsSymptomModalOpen(true)}
            onDeleteEntry={handleDeleteEntry}
          />
        )}

        {activeTab === 'lexicon' && <LexiconView lang={lang} />}

        {activeTab === 'profile' && (
          <ProfileWizard
            initialProfile={profile}
            onSaveProfile={handleSaveProfile}
            lang={lang}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            logs={logs}
            profile={profile}
            plan={plan}
            onApplyPlanRecommendation={handleApplyPlanRecommendation}
            lang={lang}
          />
        )}

        {activeTab === 'vault' && (
          <FolderStructureView lang={lang} onRefreshData={handleRefreshData} />
        )}
      </main>

      {/* Modals */}
      <MealLoggerModal
        isOpen={isMealModalOpen}
        onClose={() => setIsMealModalOpen(false)}
        onSave={handleSaveMeal}
        profile={profile}
      />

      <MedicationLoggerModal
        isOpen={isMedicationModalOpen}
        onClose={() => setIsMedicationModalOpen(false)}
        onSave={handleSaveMedication}
        profile={profile}
        existingEntries={activeDayEntries}
      />

      <SupplementLoggerModal
        isOpen={isSupplementModalOpen}
        onClose={() => setIsSupplementModalOpen(false)}
        onSave={handleSaveSupplement}
        profile={profile}
        existingEntries={activeDayEntries}
      />

      <SymptomLoggerModal
        isOpen={isSymptomModalOpen}
        onClose={() => setIsSymptomModalOpen(false)}
        onSave={handleSaveSymptoms}
        profile={profile}
        initialLog={activeDaySymptoms}
      />

      <InstallPromptModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        lang={lang}
      />
    </div>
  );
};

export default App;
