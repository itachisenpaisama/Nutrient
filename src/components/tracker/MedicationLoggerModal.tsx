import React, { useState } from 'react';
import { LogEntry, UserProfile } from '../../types';
import { X, Pill, AlertCircle, CheckCircle } from 'lucide-react';

interface MedicationLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: LogEntry) => void;
  profile: UserProfile;
  existingEntries: LogEntry[];
}

export const MedicationLoggerModal: React.FC<MedicationLoggerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  profile,
  existingEntries
}) => {
  if (!isOpen) return null;

  const defaultMedName =
    profile.medication === 'METHYLPHENIDATE'
      ? 'Medikinet adult'
      : profile.medication === 'SSRI'
      ? 'Sertralin'
      : profile.medication === 'IRON_SUPPLEMENT'
      ? 'Ferro Sanol duodenal'
      : 'Medikation';

  const [medName, setMedName] = useState<string>(defaultMedName);
  const [dosage, setDosage] = useState<string>('20mg');
  const [time, setTime] = useState<string>('08:00');

  // Check nearby meals for Medikinet breakfast requirements
  const checkBreakfastAdequacy = () => {
    if (profile.medication !== 'METHYLPHENIDATE') return true;
    const dateToday = new Date().toISOString().slice(0, 10);
    const medTime = new Date(`${dateToday}T${time}:00`).getTime();

    const nearbyMeals = existingEntries.filter((e) => {
      if (e.mealType === 'medication') return false;
      const t = new Date(e.timestamp).getTime();
      return Math.abs(t - medTime) / (1000 * 60) <= 60;
    });

    const proteinSum = nearbyMeals.reduce((acc, c) => acc + (c.proteinG || 0), 0);
    const fatSum = nearbyMeals.reduce((acc, c) => acc + (c.fatG || 0), 0);

    return proteinSum >= 15 && fatSum >= 8;
  };

  const isBreakfastAdequate = checkBreakfastAdequacy();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateToday = new Date().toISOString().slice(0, 10);

    const newEntry: LogEntry = {
      id: `med-${Date.now()}`,
      timestamp: `${dateToday}T${time}:00`,
      mealType: 'medication',
      title: `${medName} (${dosage})`,
      medicationName: medName,
      dosage,
      servings: 1,
      calories: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
      fiberG: 0,
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
      copperMg: 0,
      timingVerified: isBreakfastAdequate
    };

    onSave(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Pill className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Medikation & Kinetik-Timer erfassen
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
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Dosis
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="z. B. 10mg, 20mg"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Präparat
            </label>
            <input
              type="text"
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          {/* Real-time breakfast status */}
          {profile.medication === 'METHYLPHENIDATE' && (
            <div
              className={`p-3.5 rounded-xl border flex items-start space-x-2.5 text-xs ${
                isBreakfastAdequate
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-800 dark:text-amber-300'
              }`}
            >
              {isBreakfastAdequate ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              )}
              <div>
                <span className="font-bold">Kinetik-Prüfung: </span>
                {isBreakfastAdequate
                  ? 'Gleichzeitiges Frühstück mit ausreichend Protein (>=15g) und Fett (>=8g) verifiziert.'
                  : 'Achtung: Keine ausreichende Mahlzeit im Zeitfenster von 60 Minuten erfasst! Bitte vor oder zu Medikinet mindestens 15g Protein und 8g Fett essen, um Rebound-Crashes zu dämpfen.'}
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
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition shadow-sm shadow-indigo-600/20"
            >
              Medikation eintragen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
