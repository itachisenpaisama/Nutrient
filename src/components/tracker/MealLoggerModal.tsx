import React, { useState, useEffect } from 'react';
import { FoodItem, LogEntry, MealType, UserProfile } from '../../types';
import { FOOD_DATABASE } from '../../data/foodDatabase';
import { StorageService } from '../../services/storageService';
import { CustomFoodModal } from './CustomFoodModal';
import {
  X,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Plus,
  SlidersHorizontal,
  Database,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MealLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: LogEntry) => void;
  profile: UserProfile;
}

export const MealLoggerModal: React.FC<MealLoggerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  profile
}) => {
  if (!isOpen) return null;

  // Mode: 'database' | 'flat'
  const [entryMode, setEntryMode] = useState<'database' | 'flat'>('database');
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [time, setTime] = useState<string>('08:15');

  // Custom Foods Library
  const [customFoods, setCustomFoods] = useState<FoodItem[]>([]);
  const [isCustomFoodModalOpen, setIsCustomFoodModalOpen] = useState(false);

  useEffect(() => {
    setCustomFoods(StorageService.getCustomFoods());
  }, [isOpen]);

  const allAvailableFoods = [
    ...customFoods.map((f) => ({ ...f, isCustom: true })),
    ...FOOD_DATABASE.filter((f) => !f.id.startsWith('supp-'))
  ];

  // Database Mode State
  const [selectedFoodId, setSelectedFoodId] = useState<string>(
    allAvailableFoods[0]?.id || FOOD_DATABASE[0].id
  );
  const [servings, setServings] = useState<number>(1);
  const [customTitle, setCustomTitle] = useState<string>('');

  const selectedFood =
    allAvailableFoods.find((f) => f.id === selectedFoodId) || allAvailableFoods[0] || FOOD_DATABASE[0];

  // Flat Nutrients Mode State
  const [flatTitle, setFlatTitle] = useState<string>('');
  const [flatCalories, setFlatCalories] = useState<number>(450);
  const [flatProtein, setFlatProtein] = useState<number>(30);
  const [flatCarbs, setFlatCarbs] = useState<number>(45);
  const [flatFat, setFlatFat] = useState<number>(15);
  const [flatFiber, setFlatFiber] = useState<number>(6);
  const [saveAsCustomFood, setSaveAsCustomFood] = useState<boolean>(false);

  // Optional Micros for Flat Mode
  const [showFlatMicros, setShowFlatMicros] = useState<boolean>(false);
  const [flatOmega3Epa, setFlatOmega3Epa] = useState<number>(0);
  const [flatOmega3Dha, setFlatOmega3Dha] = useState<number>(0);
  const [flatMagnesium, setFlatMagnesium] = useState<number>(0);
  const [flatIron, setFlatIron] = useState<number>(0);
  const [flatZinc, setZinc] = useState<number>(0);
  const [flatVitaminB6, setFlatVitaminB6] = useState<number>(0);
  const [flatVitaminB12, setFlatVitaminB12] = useState<number>(0);
  const [flatVitaminD3, setFlatVitaminD3] = useState<number>(0);
  const [flatVitaminC, setFlatVitaminC] = useState<number>(0);

  // Calculations for Database Mode
  const dbProtein = (selectedFood?.proteinG || 0) * servings;
  const dbFat = (selectedFood?.fatG || 0) * servings;
  const dbCalories = (selectedFood?.calories || 0) * servings;
  const dbCarbs = (selectedFood?.carbsG || 0) * servings;
  const dbFiber = (selectedFood?.fiberG || 0) * servings;

  // Active Macro Values based on mode
  const currentProtein = entryMode === 'database' ? dbProtein : flatProtein;
  const currentFat = entryMode === 'database' ? dbFat : flatFat;
  const currentCalories = entryMode === 'database' ? dbCalories : flatCalories;
  const currentCarbs = entryMode === 'database' ? dbCarbs : flatCarbs;
  const currentFiber = entryMode === 'database' ? dbFiber : flatFiber;

  // Check if MPH is taken in profile
  const hasMph =
    profile.medication === 'METHYLPHENIDATE' ||
    (profile.medications && profile.medications.includes('METHYLPHENIDATE'));
  const isMphBreakfast = hasMph && mealType === 'breakfast';
  const breakfastProteinOk = currentProtein >= 15 && currentFat >= 8;

  const handleCustomFoodSaved = (newFood: FoodItem) => {
    const updated = StorageService.getCustomFoods();
    setCustomFoods(updated);
    setSelectedFoodId(newFood.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateToday = new Date().toISOString().slice(0, 10);

    let entry: LogEntry;

    if (entryMode === 'database') {
      entry = {
        id: `entry-${Date.now()}`,
        timestamp: `${dateToday}T${time}:00`,
        mealType,
        title: customTitle.trim() || selectedFood.nameDe,
        foodItemId: selectedFood.id,
        servings,
        calories: Math.round(dbCalories),
        proteinG: Math.round(dbProtein * 10) / 10,
        carbsG: Math.round(dbCarbs * 10) / 10,
        fatG: Math.round(dbFat * 10) / 10,
        fiberG: Math.round(dbFiber * 10) / 10,
        omega3Mg: (selectedFood.omega3Mg || 0) * servings,
        omega3EpaMg: (selectedFood.omega3EpaMg || 0) * servings,
        omega3DhaMg: (selectedFood.omega3DhaMg || 0) * servings,
        vitaminB6Mg: (selectedFood.vitaminB6Mg || 0) * servings,
        vitaminB9Ug: (selectedFood.vitaminB9Ug || 0) * servings,
        vitaminB12Ug: (selectedFood.vitaminB12Ug || 0) * servings,
        vitaminD3Iu: (selectedFood.vitaminD3Iu || 0) * servings,
        vitaminK2Ug: (selectedFood.vitaminK2Ug || 0) * servings,
        vitaminCMg: (selectedFood.vitaminCMg || 0) * servings,
        magnesiumMg: (selectedFood.magnesiumMg || 0) * servings,
        ironMg: (selectedFood.ironMg || 0) * servings,
        zincMg: (selectedFood.zincMg || 0) * servings,
        copperMg: (selectedFood.copperMg || 0) * servings
      };
    } else {
      // Flat Nutrients Mode
      const finalTitle = flatTitle.trim() || `Mahlzeit (${mealType})`;

      // If user toggled save as custom food
      if (saveAsCustomFood && flatTitle.trim()) {
        const customItem: FoodItem = {
          id: `custom-${Date.now()}`,
          nameDe: flatTitle.trim(),
          nameEn: flatTitle.trim(),
          servingSizeGrams: 200,
          calories: flatCalories,
          proteinG: flatProtein,
          carbsG: flatCarbs,
          fatG: flatFat,
          fiberG: flatFiber,
          omega3Mg: (flatOmega3Epa + flatOmega3Dha) || 0,
          omega3EpaMg: flatOmega3Epa || 0,
          omega3DhaMg: flatOmega3Dha || 0,
          magnesiumMg: flatMagnesium || 0,
          ironMg: flatIron || 0,
          zincMg: flatZinc || 0,
          copperMg: 0.2,
          vitaminB6Mg: flatVitaminB6 || 0,
          vitaminB9Ug: 30,
          vitaminB12Ug: flatVitaminB12 || 0,
          vitaminD3Iu: flatVitaminD3 || 0,
          vitaminK2Ug: 10,
          vitaminCMg: flatVitaminC || 0,
          isCustom: true
        };
        StorageService.saveCustomFood(customItem);
      }

      entry = {
        id: `flat-${Date.now()}`,
        timestamp: `${dateToday}T${time}:00`,
        mealType,
        title: finalTitle,
        servings: 1,
        calories: Math.round(flatCalories),
        proteinG: Math.round(flatProtein * 10) / 10,
        carbsG: Math.round(flatCarbs * 10) / 10,
        fatG: Math.round(flatFat * 10) / 10,
        fiberG: Math.round(flatFiber * 10) / 10,
        omega3Mg: (flatOmega3Epa + flatOmega3Dha) || 0,
        omega3EpaMg: flatOmega3Epa || 0,
        omega3DhaMg: flatOmega3Dha || 0,
        vitaminB6Mg: flatVitaminB6 || 0,
        vitaminB9Ug: 30,
        vitaminB12Ug: flatVitaminB12 || 0,
        vitaminD3Iu: flatVitaminD3 || 0,
        vitaminK2Ug: 10,
        vitaminCMg: flatVitaminC || 0,
        magnesiumMg: flatMagnesium || 0,
        ironMg: flatIron || 0,
        zincMg: flatZinc || 0,
        copperMg: 0.2
      };
    }

    onSave(entry);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Mahlzeit protokollieren
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Wähle aus der Datenbank oder trage freie Nährwerte ein
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 gap-1">
            <button
              type="button"
              onClick={() => setEntryMode('database')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                entryMode === 'database'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Aus Datenbank wählen</span>
            </button>

            <button
              type="button"
              onClick={() => setEntryMode('flat')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                entryMode === 'flat'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Flat Nährwerteingabe</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Meal Type & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Mahlzeittyp
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as MealType)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white font-medium"
                >
                  <option value="breakfast">Frühstück</option>
                  <option value="lunch">Mittagessen</option>
                  <option value="dinner">Abendessen</option>
                  <option value="snack">Snack / Zwischenmahlzeit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Uhrzeit
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            {/* MODE 1: DATABASE SELECTION */}
            {entryMode === 'database' ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Lebensmittel / Gericht wählen
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomFoodModalOpen(true)}
                      className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Eigenes Gericht anlegen</span>
                    </button>
                  </div>
                  <select
                    value={selectedFoodId}
                    onChange={(e) => setSelectedFoodId(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white font-medium"
                  >
                    {customFoods.length > 0 && (
                      <optgroup label="⭐ Meine eigenen Gerichte">
                        {customFoods.map((f) => (
                          <option key={f.id} value={f.id}>
                            [Eigen] {f.nameDe} ({f.calories} kcal · {f.proteinG}g P)
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Standard-Lebensmitteldatenbank">
                      {FOOD_DATABASE.filter((f) => !f.id.startsWith('supp-')).map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.nameDe} ({f.calories} kcal · {f.proteinG}g P · {f.fatG}g F)
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Portion(en)
                    </label>
                    <input
                      type="number"
                      min="0.25"
                      max="10"
                      step="0.25"
                      value={servings}
                      onChange={(e) => setServings(parseFloat(e.target.value) || 1)}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Gramm ca.
                    </label>
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      ~{Math.round((selectedFood?.servingSizeGrams || 100) * servings)} g
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Eigener Notiz-Titel (optional)
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={`z. B. Großes ${selectedFood?.nameDe}`}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              /* MODE 2: FLAT NUTRIENTS ENTRY */
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Bezeichnung / Gericht-Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={flatTitle}
                    onChange={(e) => setFlatTitle(e.target.value)}
                    placeholder="z. B. Pasta mit Lachs, Proteinriegel, Restaurant-Teller"
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                {/* Flat Macro Inputs */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Direkte Makronährstoffe eintragen
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Kalorien (kcal)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5000"
                        value={flatCalories}
                        onChange={(e) => setFlatCalories(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                        Protein (g)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="300"
                        step="0.5"
                        value={flatProtein}
                        onChange={(e) => setFlatProtein(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 mb-1">
                        Kohlenhydrate (g)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="500"
                        step="0.5"
                        value={flatCarbs}
                        onChange={(e) => setFlatCarbs(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-amber-600 dark:text-amber-400 mb-1">
                        Fett (g)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        step="0.5"
                        value={flatFat}
                        onChange={(e) => setFlatFat(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-teal-600 dark:text-teal-400 mb-1">
                      Ballaststoffe (g)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="80"
                      step="0.5"
                      value={flatFiber}
                      onChange={(e) => setFlatFiber(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Save as Reusable Custom Food Checkbox */}
                <div className="p-3 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/50 dark:border-cyan-800/50">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-cyan-900 dark:text-cyan-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveAsCustomFood}
                      onChange={(e) => setSaveAsCustomFood(e.target.checked)}
                      className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Gericht dauerhaft für zukünftige Mahlzeiten in der Datenbank speichern</span>
                  </label>
                </div>

                {/* Optional Flat Micros Accordion */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowFlatMicros(!showFlatMicros)}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Mikronährstoffe eintragen (optional)</span>
                    </div>
                    {showFlatMicros ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {showFlatMicros && (
                    <div className="p-3.5 grid grid-cols-2 gap-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Omega-3 EPA (mg)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={flatOmega3Epa}
                          onChange={(e) => setFlatOmega3Epa(parseFloat(e.target.value) || 0)}
                          className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Omega-3 DHA (mg)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={flatOmega3Dha}
                          onChange={(e) => setFlatOmega3Dha(parseFloat(e.target.value) || 0)}
                          className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Magnesium (mg)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={flatMagnesium}
                          onChange={(e) => setFlatMagnesium(parseFloat(e.target.value) || 0)}
                          className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Eisen (mg)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={flatIron}
                          onChange={(e) => setFlatIron(parseFloat(e.target.value) || 0)}
                          className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Zink (mg)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={flatZinc}
                          onChange={(e) => setZinc(parseFloat(e.target.value) || 0)}
                          className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Vitamin C (mg)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={flatVitaminC}
                          onChange={(e) => setFlatVitaminC(parseFloat(e.target.value) || 0)}
                          className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Live Macro Summary Pill */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Kalorien</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  {Math.round(currentCalories)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                  Protein
                </div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {Math.round(currentProtein)}g
                </div>
              </div>
              <div>
                <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold uppercase">
                  Carbs
                </div>
                <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                  {Math.round(currentCarbs)}g
                </div>
              </div>
              <div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase">
                  Fett
                </div>
                <div className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                  {Math.round(currentFat)}g
                </div>
              </div>
            </div>

            {/* Kinetic check if ADHD medication is taken */}
            {isMphBreakfast && (
              <div
                className={`p-3.5 rounded-2xl border flex items-start space-x-2.5 text-xs ${
                  breakfastProteinOk
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                }`}
              >
                {breakfastProteinOk ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                )}
                <div>
                  <span className="font-bold">Medikinet Kinetik-Check: </span>
                  {breakfastProteinOk
                    ? 'Perfekt! Enthält mindestens 15g Protein und 8g Fett zur Kinetik-Glättung.'
                    : 'Achtung: Enthält weniger als 15g Protein oder 8g Fett. Risiko für unkontrolliertes Anfluten!'}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer transition shadow-md shadow-cyan-600/20"
              >
                Mahlzeit speichern
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Embedded Custom Food Creation Modal */}
      <CustomFoodModal
        isOpen={isCustomFoodModalOpen}
        onClose={() => setIsCustomFoodModalOpen(false)}
        onFoodSaved={handleCustomFoodSaved}
      />
    </>
  );
};
