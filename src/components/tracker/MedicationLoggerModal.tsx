import React, { useState, useEffect } from 'react';
import { LogEntry, UserProfile, MedicationType } from '../../types';
import { MEDICATION_DATABASE, getMedicationMetadata } from '../../data/medicationDatabase';
import { X, Pill, AlertCircle, CheckCircle, Info, Sparkles, Clock } from 'lucide-react';

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

  // Active user medications from profile
  const userMeds =
    profile.medications && profile.medications.length > 0
      ? profile.medications
      : profile.medication && profile.medication !== 'NONE'
      ? [profile.medication]
      : (['METHYLPHENIDATE'] as MedicationType[]);

  const [selectedMedType, setSelectedMedType] = useState<MedicationType>(userMeds[0] || 'METHYLPHENIDATE');
  const [customMedName, setCustomMedName] = useState<string>('');
  const [dosage, setDosage] = useState<string>('20mg');
  const [time, setTime] = useState<string>('08:00');

  const activeMedInfo = getMedicationMetadata(selectedMedType);

  useEffect(() => {
    if (activeMedInfo) {
      setDosage(activeMedInfo.defaultDosage);
      setCustomMedName(activeMedInfo.tradeNames.split(',')[0]);
    }
  }, [selectedMedType]);

  // Check nearby meals for Medikinet breakfast requirements
  const checkBreakfastAdequacy = () => {
    if (selectedMedType !== 'METHYLPHENIDATE') return true;
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

  // Check coffee/tea for Iron supplement
  const checkIronConflict = () => {
    if (selectedMedType !== 'IRON_SUPPLEMENT') return false;
    const dateToday = new Date().toISOString().slice(0, 10);
    const medTime = new Date(`${dateToday}T${time}:00`).getTime();

    return existingEntries.some((e) => {
      const lower = e.title.toLowerCase();
      const hasBlocker =
        lower.includes('kaffee') ||
        lower.includes('coffee') ||
        lower.includes('espresso') ||
        lower.includes('tee') ||
        lower.includes('tea') ||
        lower.includes('milch');
      if (hasBlocker) {
        const t = new Date(e.timestamp).getTime();
        return Math.abs(t - medTime) / (1000 * 60) <= 120;
      }
      return false;
    });
  };

  const hasIronCoffeeConflict = checkIronConflict();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateToday = new Date().toISOString().slice(0, 10);

    const displayName =
      customMedName.trim() ||
      activeMedInfo?.nameDe.split('(')[0].trim() ||
      'Medikation';

    const newEntry: LogEntry = {
      id: `med-${Date.now()}`,
      timestamp: `${dateToday}T${time}:00`,
      mealType: 'medication',
      title: `${displayName} (${dosage})`,
      medicationName: displayName,
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
      ironMg: selectedMedType === 'IRON_SUPPLEMENT' ? 50 : 0,
      zincMg: 0,
      copperMg: 0,
      timingVerified: isBreakfastAdequate && !hasIronCoffeeConflict
    };

    onSave(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Medikation &amp; Kinetik erfassen
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Präparat wählen, Dosierung und Kinetik-Check prüfen
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick-Select chips from user profile medications */}
          {userMeds.length > 0 && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Meine hinterlegten Medikamente (Schnellauswahl)
              </label>
              <div className="flex flex-wrap gap-2">
                {userMeds.map((medId) => {
                  const info = getMedicationMetadata(medId);
                  const isSelected = selectedMedType === medId;
                  return (
                    <button
                      key={medId}
                      type="button"
                      onClick={() => setSelectedMedType(medId)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>{info?.nameDe.split('(')[0] || medId}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Medication Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Medikamenten-Typ aus Datenbank
            </label>
            <select
              value={selectedMedType}
              onChange={(e) => setSelectedMedType(e.target.value as MedicationType)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white font-medium"
            >
              {MEDICATION_DATABASE.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nameDe} — ({m.tradeNames})
                </option>
              ))}
            </select>
          </div>

          {/* Preparat Name & Dosage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Präparat / Handelsname
              </label>
              <input
                type="text"
                value={customMedName}
                onChange={(e) => setCustomMedName(e.target.value)}
                placeholder="z. B. Medikinet adult, Elvanse..."
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dosis
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="z. B. 20mg, 30mg, 50µg"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Einnahme-Uhrzeit
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white font-mono"
            />
          </div>

          {/* Clinical Kinetic Instructions & Warnings Card */}
          {activeMedInfo && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2 text-xs">
              <div className="flex items-center space-x-1.5 text-indigo-900 dark:text-indigo-300 font-bold">
                <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Kinetik &amp; Einnahme-Hinweis:</span>
              </div>
              <p className="text-[11px] text-indigo-950 dark:text-indigo-200 leading-relaxed">
                {activeMedInfo.kineticInstructionsDe}
              </p>

              {activeMedInfo.dietaryInteractionsDe.length > 0 && (
                <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-600 dark:text-slate-400">
                  {activeMedInfo.dietaryInteractionsDe.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Real-time breakfast validation check for Methylphenidate */}
          {selectedMedType === 'METHYLPHENIDATE' && (
            <div
              className={`p-3.5 rounded-2xl border flex items-start space-x-2.5 text-xs ${
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

          {/* Real-time Coffee/Tea warning for Iron Supplement */}
          {selectedMedType === 'IRON_SUPPLEMENT' && hasIronCoffeeConflict && (
            <div className="p-3.5 rounded-2xl border bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-800 dark:text-amber-300 flex items-start space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold">Eisen-Resorptions-Warnung: </span>
                In den letzten 2 Stunden wurde Kaffee, Tee oder Milch erfasst. Tannine/Calcium blockieren die Eisenaufnahme! Mindestens 2 Stunden Abstand einhalten.
              </div>
            </div>
          )}

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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition shadow-md shadow-indigo-600/20"
            >
              Medikation eintragen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
