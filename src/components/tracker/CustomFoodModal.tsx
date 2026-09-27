import React, { useState } from 'react';
import { FoodItem } from '../../types';
import { StorageService } from '../../services/storageService';
import { X, ChefHat, Sparkles, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface CustomFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodSaved: (savedFood: FoodItem) => void;
}

export const CustomFoodModal: React.FC<CustomFoodModalProps> = ({
  isOpen,
  onClose,
  onFoodSaved
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [servingSizeGrams, setServingSizeGrams] = useState(250);
  const [calories, setCalories] = useState(350);
  const [proteinG, setProteinG] = useState(25);
  const [carbsG, setCarbsG] = useState(30);
  const [fatG, setFatG] = useState(12);
  const [fiberG, setFiberG] = useState(5);

  // Optional micros accordion
  const [showMicros, setShowMicros] = useState(false);
  const [omega3Mg, setOmega3Mg] = useState(0);
  const [omega3EpaMg, setOmega3EpaMg] = useState(0);
  const [omega3DhaMg, setOmega3DhaMg] = useState(0);
  const [ironMg, setIronMg] = useState(2.5);
  const [magnesiumMg, setMagnesiumMg] = useState(60);
  const [zincMg, setZincMg] = useState(2.0);
  const [vitaminB6Mg, setVitaminB6Mg] = useState(0.4);
  const [vitaminB12Ug, setVitaminB12Ug] = useState(0.8);
  const [vitaminD3Iu, setVitaminD3Iu] = useState(0);
  const [vitaminCMg, setVitaminCMg] = useState(15);

  // Dietary tags
  const [isGlutenFree, setIsGlutenFree] = useState(true);
  const [isCaseinFree, setIsCaseinFree] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newFood: FoodItem = {
      id: `custom-food-${Date.now()}`,
      nameDe: name.trim(),
      nameEn: name.trim(),
      servingSizeGrams: Number(servingSizeGrams) || 100,
      calories: Number(calories) || 0,
      proteinG: Number(proteinG) || 0,
      carbsG: Number(carbsG) || 0,
      fatG: Number(fatG) || 0,
      fiberG: Number(fiberG) || 0,
      omega3Mg: Number(omega3Mg) || 0,
      omega3EpaMg: Number(omega3EpaMg) || 0,
      omega3DhaMg: Number(omega3DhaMg) || 0,
      ironMg: Number(ironMg) || 0,
      magnesiumMg: Number(magnesiumMg) || 0,
      zincMg: Number(zincMg) || 0,
      copperMg: 0.2,
      vitaminB6Mg: Number(vitaminB6Mg) || 0,
      vitaminB9Ug: 30,
      vitaminB12Ug: Number(vitaminB12Ug) || 0,
      vitaminD3Iu: Number(vitaminD3Iu) || 0,
      vitaminK2Ug: 10,
      vitaminCMg: Number(vitaminCMg) || 0,
      isGlutenFree,
      isCaseinFree,
      isCustom: true
    };

    StorageService.saveCustomFood(newFood);
    onFoodSaved(newFood);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Eigenes Gericht anlegen
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Wird dauerhaft in deiner Lebensmitteldatenbank gespeichert
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Dish Name & Portionsgröße */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Name des Gerichts / Rezepts *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z. B. Protein-Porridge mit Beeren & Chia"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Portionsgröße (in Gramm)
              </label>
              <input
                type="number"
                min="10"
                max="2500"
                value={servingSizeGrams}
                onChange={(e) => setServingSizeGrams(parseInt(e.target.value) || 100)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Basis-Makronährstoffe */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Makronährstoffe pro Portion ({servingSizeGrams}g)
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
                  value={calories}
                  onChange={(e) => setCalories(parseFloat(e.target.value) || 0)}
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
                  value={proteinG}
                  onChange={(e) => setProteinG(parseFloat(e.target.value) || 0)}
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
                  value={carbsG}
                  onChange={(e) => setCarbsG(parseFloat(e.target.value) || 0)}
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
                  value={fatG}
                  onChange={(e) => setFatG(parseFloat(e.target.value) || 0)}
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
                max="100"
                step="0.5"
                value={fiberG}
                onChange={(e) => setFiberG(parseFloat(e.target.value) || 0)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Allergen & Reizdarm Checkboxen */}
          <div className="flex items-center space-x-6 pt-1">
            <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isGlutenFree}
                onChange={(e) => setIsGlutenFree(e.target.checked)}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
              />
              <span>Glutenfrei</span>
            </label>
            <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isCaseinFree}
                onChange={(e) => setIsCaseinFree(e.target.checked)}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
              />
              <span>Kaseinfrei (Milcheiweißfrei)</span>
            </label>
          </div>

          {/* Optional Micronutrients Accordion */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowMicros(!showMicros)}
              className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span>Mikronährstoffe angeben (optional)</span>
              </div>
              {showMicros ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showMicros && (
              <div className="p-4 grid grid-cols-2 gap-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Omega-3 EPA (mg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={omega3EpaMg}
                    onChange={(e) => setOmega3EpaMg(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Omega-3 DHA (mg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={omega3DhaMg}
                    onChange={(e) => setOmega3DhaMg(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Magnesium (mg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={magnesiumMg}
                    onChange={(e) => setMagnesiumMg(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Eisen (mg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={ironMg}
                    onChange={(e) => setIronMg(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Zink (mg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={zincMg}
                    onChange={(e) => setZincMg(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Vitamin C (mg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={vitaminCMg}
                    onChange={(e) => setVitaminCMg(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Vitamin B6 (mg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={vitaminB6Mg}
                    onChange={(e) => setVitaminB6Mg(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Vitamin B12 (µg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={vitaminB12Ug}
                    onChange={(e) => setVitaminB12Ug(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer transition shadow-md shadow-cyan-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Gericht dauerhaft speichern</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
