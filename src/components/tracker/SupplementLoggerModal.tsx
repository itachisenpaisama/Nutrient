import React, { useState } from 'react';
import { LogEntry, UserProfile, InteractionAlert } from '../../types';
import { FOOD_DATABASE } from '../../data/foodDatabase';
import { validateItemAddition } from '../../services/interactionEngine';
import { X, Sparkles, ShieldAlert, AlertTriangle } from 'lucide-react';

interface SupplementLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: LogEntry, alert?: InteractionAlert) => void;
  profile: UserProfile;
  existingEntries: LogEntry[];
}

export const SupplementLoggerModal: React.FC<SupplementLoggerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  profile,
  existingEntries
}) => {
  if (!isOpen) return null;

  const [supplementType, setSupplementType] = useState<string>('supp-omega3-algae');
  const [customName, setCustomName] = useState<string>('');
  const [time, setTime] = useState<string>('13:30');
  const [dosage, setDosage] = useState<string>('1 Portion');
  const [validationAlert, setValidationAlert] = useState<InteractionAlert | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const predefinedSupps = FOOD_DATABASE.filter((f) => f.id.startsWith('supp-'));

  const handleSelectChange = (val: string) => {
    setSupplementType(val);
    checkInteractions(val);
  };

  const handleCustomNameChange = (val: string) => {
    setCustomName(val);
    checkInteractions(val);
  };

  const checkInteractions = (itemName: string) => {
    const dateToday = new Date().toISOString().slice(0, 10);
    const ts = `${dateToday}T${time}:00`;
    const result = validateItemAddition(profile, itemName, ts, existingEntries);

    if (!result.canAdd && result.alert) {
      setIsLocked(true);
      setValidationAlert(result.alert);
    } else if (result.alert) {
      setIsLocked(false);
      setValidationAlert(result.alert);
    } else {
      setIsLocked(false);
      setValidationAlert(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    const dateToday = new Date().toISOString().slice(0, 10);
    const suppItem = predefinedSupps.find((s) => s.id === supplementType);

    const title = customName.trim() || (suppItem ? suppItem.nameDe : 'Nahrungsergänzung');

    const newEntry: LogEntry = {
      id: `supp-${Date.now()}`,
      timestamp: `${dateToday}T${time}:00`,
      mealType: 'supplement',
      title,
      dosage,
      servings: 1,
      calories: suppItem ? suppItem.calories : 0,
      proteinG: suppItem ? suppItem.proteinG : 0,
      carbsG: suppItem ? suppItem.carbsG : 0,
      fatG: suppItem ? suppItem.fatG : 0,
      fiberG: 0,
      omega3Mg: suppItem ? suppItem.omega3Mg : 0,
      omega3EpaMg: suppItem ? suppItem.omega3EpaMg || 0 : 0,
      omega3DhaMg: suppItem ? suppItem.omega3DhaMg || 0 : 0,
      vitaminB6Mg: suppItem ? suppItem.vitaminB6Mg : 0,
      vitaminB9Ug: suppItem ? suppItem.vitaminB9Ug : 0,
      vitaminB12Ug: suppItem ? suppItem.vitaminB12Ug : 0,
      vitaminD3Iu: suppItem ? suppItem.vitaminD3Iu : 0,
      vitaminK2Ug: suppItem ? suppItem.vitaminK2Ug : 0,
      vitaminCMg: suppItem ? suppItem.vitaminCMg : 0,
      magnesiumMg: suppItem ? suppItem.magnesiumMg : 0,
      ironMg: suppItem ? suppItem.ironMg : 0,
      zincMg: suppItem ? suppItem.zincMg : 0,
      copperMg: suppItem ? suppItem.copperMg : 0,
      warningNote: validationAlert ? validationAlert.messageDe : undefined
    };

    onSave(newEntry, validationAlert || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Supplement & Mikronährstoff erfassen
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
                Einnahme-Uhrzeit
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  checkInteractions(customName || supplementType);
                }}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Dosierung / Menge
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="z. B. 1 Kapsel, 2 Tropfen"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Präparat aus klinischer Datenbank wählen
            </label>
            <select
              value={supplementType}
              onChange={(e) => handleSelectChange(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
            >
              {predefinedSupps.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameDe}
                </option>
              ))}
              <option value="custom">-- Anderes / Eigenes Supplement --</option>
            </select>
          </div>

          {supplementType === 'custom' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Bezeichnung des Präparats
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => handleCustomNameChange(e.target.value)}
                placeholder="z. B. 5-HTP, Johanniskraut, Eisen-Bisglycinat..."
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* Real-time Interaction Warning / Critical Lock */}
          {validationAlert && (
            <div
              className={`p-3.5 rounded-xl border flex items-start space-x-3 text-xs animate-in fade-in duration-200 ${
                validationAlert.severity === 'CRITICAL_LOCK'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              }`}
            >
              {validationAlert.severity === 'CRITICAL_LOCK' ? (
                <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              )}
              <div>
                <div className="font-bold text-sm mb-1">{validationAlert.titleDe}</div>
                <p className="mb-2 leading-relaxed">{validationAlert.messageDe}</p>
                <div className="font-semibold underline">
                  {validationAlert.actionRecommendationDe}
                </div>
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
              disabled={isLocked}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                isLocked
                  ? 'bg-slate-400 text-slate-200 cursor-not-allowed opacity-60'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-emerald-600/20'
              }`}
            >
              {isLocked ? 'Eingabe gesperrt' : 'Supplement speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
