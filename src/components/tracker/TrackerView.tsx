import React, { useState } from 'react';
import { DailyLogSummary, NutrientPlan, UserProfile, LogEntry, MealPreset } from '../../types';
import { Language } from '../../i18n/translations';
import { CustomFoodModal } from './CustomFoodModal';
import { StorageService } from '../../services/storageService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  UtensilsCrossed,
  Plus,
  Pill,
  Sparkles,
  Trash2,
  Activity,
  ChefHat,
  Search,
  Bookmark
} from 'lucide-react';

interface TrackerViewProps {
  logs: DailyLogSummary[];
  profile: UserProfile;
  allProfiles?: UserProfile[];
  onSelectProfile?: (profileId: string) => void;
  onOpenCreateProfile?: () => void;
  plan: NutrientPlan;
  lang: Language;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onAddMeal: () => void;
  onAddMedication: () => void;
  onAddSupplement: () => void;
  onLogSymptoms: () => void;
  onDeleteEntry: (entryId: string) => void;
  onAddEntryDirect?: (entry: LogEntry) => void;
}

export const TrackerView: React.FC<TrackerViewProps> = ({
  logs,
  profile,
  allProfiles,
  onSelectProfile,
  onOpenCreateProfile,
  plan,
  selectedDate,
  onAddMeal,
  onAddMedication,
  onAddSupplement,
  onLogSymptoms,
  onDeleteEntry,
  onAddEntryDirect
}) => {
  const [isCustomFoodModalOpen, setIsCustomFoodModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const presets = StorageService.getMealPresets();

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

  const { entries, totals } = currentLog;

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      !searchTerm ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.mealType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'meals' && ['breakfast', 'lunch', 'dinner', 'snack'].includes(e.mealType)) ||
      (filterType === 'meds' && e.mealType === 'medication') ||
      (filterType === 'supps' && e.mealType === 'supplement');

    return matchesSearch && matchesFilter;
  });

  const handleApplyPreset = (preset: MealPreset) => {
    const timeNow = new Date().toTimeString().slice(0, 5);
    const newEntry: LogEntry = {
      id: `entry-${Date.now()}`,
      timestamp: `${selectedDate}T${timeNow}:00`,
      mealType: preset.category,
      title: preset.title,
      servings: 1,
      calories: preset.calories,
      proteinG: preset.proteinG,
      carbsG: preset.carbsG,
      fatG: preset.fatG,
      fiberG: preset.fiberG,
      omega3Mg: 0,
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
    };

    if (onAddEntryDirect) {
      onAddEntryDirect(newEntry);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Detailliertes Tracking &amp; Kinetik</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tages-Tracker &amp; Protokoll ({selectedDate})
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Protokolliere Mahlzeiten, Dosen und Kofaktoren mit automatischer Kinetik-Prüfung.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: profile.avatarColor || '#06b6d4' }} />
                Profil: <strong className="font-semibold text-slate-900 dark:text-white">{profile.name}</strong>
              </span>

              {allProfiles && onSelectProfile && allProfiles.length > 1 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mr-0.5">Wechseln:</span>
                  {allProfiles.map((p) => {
                    if (p.id === profile.id) return null;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onSelectProfile(p.id)}
                        className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 text-slate-600 dark:text-slate-400 hover:text-cyan-600 transition cursor-pointer"
                        title={`${p.name} (${p.neuroModifier}) aktivieren`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                  {onOpenCreateProfile && (
                    <button
                      type="button"
                      onClick={onOpenCreateProfile}
                      className="px-1.5 py-0.5 rounded-full text-[11px] font-medium text-cyan-600 dark:text-cyan-400 border border-dashed border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950 flex items-center space-x-0.5 transition cursor-pointer"
                      title="Neues Profil erstellen"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Neu</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="cyan"
              size="sm"
              onClick={onAddMeal}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Mahlzeit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCustomFoodModalOpen(true)}
              className="text-cyan-700 dark:text-cyan-400 border-cyan-500/40"
            >
              <ChefHat className="w-3.5 h-3.5 mr-1" />
              Eigenes Gericht
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onAddMedication}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Pill className="w-3.5 h-3.5 mr-1" />
              Medikation
            </Button>
            <Button
              variant="emerald"
              size="sm"
              onClick={onAddSupplement}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Supplement
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogSymptoms}
            >
              <Activity className="w-3.5 h-3.5 mr-1 text-cyan-500" />
              Symptome
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Meal Presets / Favorites Bar */}
      {presets.length > 0 && onAddEntryDirect && (
        <Card className="border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-950/20">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Schnellvorlagen (1-Klick Erfassung):
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Häufige Mahlzeiten direkt für {selectedDate} buchen
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-800 dark:text-slate-200 shadow-2xs transition cursor-pointer flex items-center space-x-1.5"
                  title={preset.description}
                >
                  <Plus className="w-3 h-3 text-indigo-500" />
                  <span>{preset.title.split('(')[0]}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({preset.proteinG}g P · {preset.calories} kcal)
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid: Entries List & Micronutrient Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Log Entries with Filter & Search */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
              <div>
                <CardTitle className="text-sm font-bold">
                  Protokollierte Einträge ({filteredEntries.length})
                </CardTitle>
                <div className="text-xs text-slate-500">Datum: {selectedDate}</div>
              </div>

              {/* Search & Filter pills */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Suchen..."
                    className="pl-8 pr-3 py-1 h-8 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 w-28 sm:w-36 focus:w-44 transition-all focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2 py-1 text-[11px] rounded-lg font-bold transition cursor-pointer ${
                      filterType === 'all'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Alle
                  </button>
                  <button
                    onClick={() => setFilterType('meals')}
                    className={`px-2 py-1 text-[11px] rounded-lg font-bold transition cursor-pointer ${
                      filterType === 'meals'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Essen
                  </button>
                  <button
                    onClick={() => setFilterType('meds')}
                    className={`px-2 py-1 text-[11px] rounded-lg font-bold transition cursor-pointer ${
                      filterType === 'meds'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Medis
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {filteredEntries.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Keine Einträge für diese Ansicht. Klicke oben auf Mahlzeit, Medikation oder Supplement.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredEntries.map((entry) => {
                    const isMed = entry.mealType === 'medication';
                    const time = entry.timestamp.slice(11, 16);

                    return (
                      <div
                        key={entry.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-start justify-between gap-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold shrink-0 mt-0.5">
                            {time}
                          </span>

                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {entry.title}
                              </span>
                              <Badge variant={isMed ? 'purple' : 'secondary'} className="text-[10px] uppercase">
                                {entry.mealType}
                              </Badge>
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
            </CardContent>
          </Card>
        </div>

        {/* Right: Micronutrient Status Card */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tages-Mikronährstoffe vs. Ziel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom Food Creation Modal */}
      <CustomFoodModal
        isOpen={isCustomFoodModalOpen}
        onClose={() => setIsCustomFoodModalOpen(false)}
        onFoodSaved={() => {}}
      />
    </div>
  );
};
