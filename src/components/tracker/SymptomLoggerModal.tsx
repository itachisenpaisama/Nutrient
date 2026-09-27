import React, { useState } from 'react';
import { DailySymptomLog, UserProfile } from '../../types';
import { X, Activity } from 'lucide-react';

interface SymptomLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (symptomLog: DailySymptomLog) => void;
  profile: UserProfile;
  initialLog?: DailySymptomLog;
}

export const SymptomLoggerModal: React.FC<SymptomLoggerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  profile,
  initialLog
}) => {
  if (!isOpen) return null;

  const [focusScore, setFocusScore] = useState<number>(initialLog?.focusScore ?? 7);
  const [energyScore, setEnergyScore] = useState<number>(initialLog?.energyScore ?? 7);
  const [reboundScore, setReboundScore] = useState<number>(initialLog?.reboundSeverityScore ?? 3);
  const [gutScore, setGutScore] = useState<number>(initialLog?.gutComfortScore ?? 8);
  const [sleepScore, setSleepScore] = useState<number>(initialLog?.sleepQualityScore ?? 7);
  const [notes, setNotes] = useState<string>(initialLog?.notes ?? '');

  const isMph = profile.medication === 'METHYLPHENIDATE' || profile.medication === 'LISDEXAMFETAMINE';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateToday = new Date().toISOString().slice(0, 10);

    const log: DailySymptomLog = {
      date: dateToday,
      focusScore,
      energyScore,
      fatigueScore: 10 - energyScore,
      gutComfortScore: gutScore,
      sleepQualityScore: sleepScore,
      reboundSeverityScore: isMph ? reboundScore : undefined,
      notes: notes.trim()
    };

    onSave(log);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Tages-Befindlichkeit & Symptom-Rating
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
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Diese Scores fließen direkt in die Pearson-Korrelations-Engine ein, um Zusammenhänge zwischen deiner Ernährung und kognitiver Leistung aufzudecken.
          </p>

          {/* Focus Score */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-200">
                Fokus & Konzentration (Nachmittag)
              </span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold font-mono">
                {focusScore} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={focusScore}
              onChange={(e) => setFocusScore(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
          </div>

          {/* Energy Score */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-200">
                Energie-Level & Antrieb
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                {energyScore} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energyScore}
              onChange={(e) => setEnergyScore(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Rebound Severity Score (if on Stimulants) */}
          {isMph && (
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-200">
                  Medikinet Rebound Crash Schweregrad (1 = kaum spürbar, 10 = extrem)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold font-mono">
                  {reboundScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={reboundScore}
                onChange={(e) => setReboundScore(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>
          )}

          {/* Gut Comfort */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-200">
                Darm- & Verdauungskomfort (Mikrobiom)
              </span>
              <span className="text-teal-600 dark:text-teal-400 font-bold font-mono">
                {gutScore} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={gutScore}
              onChange={(e) => setGutScore(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>

          {/* Sleep Quality */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-200">
                Schlafqualität & abendliche Entspannung (Magnesium-Wirkung)
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                {sleepScore} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={sleepScore}
              onChange={(e) => setSleepScore(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Notizen / Besonderheiten
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="z. B. Heute morgens Protein weggelassen, starker Einbruch um 14 Uhr..."
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
            />
          </div>

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
              Rating speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
