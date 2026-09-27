import React, { useState } from 'react';
import { FoodItem, LogEntry, MealType, UserProfile } from '../../types';
import { FOOD_DATABASE } from '../../data/foodDatabase';
import { X, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';

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

  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [selectedFoodId, setSelectedFoodId] = useState<string>(FOOD_DATABASE[0].id);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [servings, setServings] = useState<number>(1);
  const [time, setTime] = useState<string>('08:15');

  const selectedFood = FOOD_DATABASE.find((f) => f.id === selectedFoodId) || FOOD_DATABASE[0];

  const calculatedProtein = selectedFood.proteinG * servings;
  const calculatedFat = selectedFood.fatG * servings;
  const calculatedCalories = selectedFood.calories * servings;
  const calculatedCarbs = selectedFood.carbsG * servings;
  const calculatedFiber = selectedFood.fiberG * servings;

  const isMphBreakfast =
    profile.medication === 'METHYLPHENIDATE' && mealType === 'breakfast';
  const breakfastProteinOk = calculatedProtein >= 15 && calculatedFat >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dateToday = new Date().toISOString().slice(0, 10);
    const newEntry: LogEntry = {
      id: `entry-${Date.now()}`,
      timestamp: `${dateToday}T${time}:00`,
      mealType,
      title: customTitle.trim() || selectedFood.nameDe,
      foodItemId: selectedFood.id,
      servings,
      calories: Math.round(calculatedCalories),
      proteinG: Math.round(calculatedProtein * 10) / 10,
      carbsG: Math.round(calculatedCarbs * 10) / 10,
      fatG: Math.round(calculatedFat * 10) / 10,
      fiberG: Math.round(calculatedFiber * 10) / 10,
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

    onSave(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Mahlzeit protokollieren
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Mahlzeittyp
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
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

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Lebensmittel wählen
            </label>
            <select
              value={selectedFoodId}
              onChange={(e) => setSelectedFoodId(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
            >
              {FOOD_DATABASE.filter((f) => !f.id.startsWith('supp-')).map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nameDe} ({f.calories} kcal · {f.proteinG}g Protein)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Portion / Menge
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0.25"
                max="10"
                step="0.25"
                value={servings}
                onChange={(e) => setServings(parseFloat(e.target.value) || 1)}
                className="w-24 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white font-mono"
              />
              <span className="text-xs text-slate-500">
                Portion(en) = ca. {Math.round(selectedFood.servingSizeGrams * servings)}g
              </span>
            </div>
          </div>

          {/* Quick Nutritional Preview */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-[10px] text-slate-400">Kalorien</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                {Math.round(calculatedCalories)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Protein</div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {Math.round(calculatedProtein)}g
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Carbs</div>
              <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                {Math.round(calculatedCarbs)}g
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Fett</div>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                {Math.round(calculatedFat)}g
              </div>
            </div>
          </div>

          {/* ADHD Medikinet Breakfast Validation Check */}
          {isMphBreakfast && (
            <div
              className={`p-3 rounded-xl border flex items-start space-x-2 text-xs ${
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

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer transition shadow-sm shadow-cyan-600/20"
            >
              Mahlzeit speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
