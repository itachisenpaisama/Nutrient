import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, PhysicalGoal, NeuroModifier, MedicationType } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Check } from 'lucide-react';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProfile: (profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>, withDemoLogs: boolean) => void;
}

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  isOpen,
  onClose,
  onCreateProfile
}) => {
  const [selectedPreset, setSelectedPreset] = useState<'adhd' | 'audhd' | 'fitness' | 'custom'>('adhd');
  const [name, setName] = useState('Neues Profil');
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState<Gender>('male');
  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(74);
  const [bodyFatPct, setBodyFatPct] = useState<number | undefined>(undefined);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(1.55);
  const [goal, setGoal] = useState<PhysicalGoal>('MAINTENANCE');
  const [neuroModifier, setNeuroModifier] = useState<NeuroModifier>('ADHD');
  const [medication, setMedication] = useState<MedicationType>('METHYLPHENIDATE');
  const [avatarColor, setAvatarColor] = useState('#06b6d4');
  const [waterGoalMl, setWaterGoalMl] = useState(3000);
  const [withDemoLogs, setWithDemoLogs] = useState(true);

  const applyPreset = (presetKey: 'adhd' | 'audhd' | 'fitness' | 'custom') => {
    setSelectedPreset(presetKey);
    if (presetKey === 'adhd') {
      setName('ADHS Fokus-Profil');
      setAge(29);
      setGender('male');
      setHeightCm(182);
      setWeightKg(78);
      setActivityLevel(1.55);
      setGoal('MAINTENANCE');
      setNeuroModifier('ADHD');
      setMedication('METHYLPHENIDATE');
      setAvatarColor('#06b6d4');
      setWaterGoalMl(3000);
    } else if (presetKey === 'audhd') {
      setName('AuDHD Darm-Hirn');
      setAge(26);
      setGender('female');
      setHeightCm(168);
      setWeightKg(62);
      setActivityLevel(1.375);
      setGoal('FAT_LOSS');
      setNeuroModifier('AUDHD');
      setMedication('LISDEXAMFETAMINE');
      setAvatarColor('#8b5cf6');
      setWaterGoalMl(2600);
    } else if (presetKey === 'fitness') {
      setName('Hypertrophie Sport');
      setAge(31);
      setGender('male');
      setHeightCm(185);
      setWeightKg(84);
      setActivityLevel(1.725);
      setGoal('HYPERTROPHY');
      setNeuroModifier('NONE');
      setMedication('NONE');
      setAvatarColor('#10b981');
      setWaterGoalMl(3500);
    } else {
      setName('Mein Profil');
      setAvatarColor('#f59e0b');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateProfile(
      {
        name: name.trim() || 'Unbenanntes Profil',
        age,
        gender,
        heightCm,
        weightKg,
        bodyFatPct,
        activityLevel,
        goal,
        neuroModifier,
        medication,
        medications: medication !== 'NONE' ? [medication] : [],
        trackGlutenCasein: neuroModifier === 'ASD' || neuroModifier === 'AUDHD',
        avatarColor,
        waterGoalMl,
        notes: `Erstellt mit Preset: ${selectedPreset}`
      },
      withDemoLogs
    );
    onClose();
  };

  const colors = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onClose={onClose} className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 mb-1">
            <Plus className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Neues Profil anlegen</span>
          </div>
          <DialogTitle className="text-lg font-bold">
            Benutzerprofil erstellen &amp; speichern
          </DialogTitle>
          <DialogDescription>
            Wähle eine klinische Vorlage oder passe die biometrischen Werte individuell an.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              1. Vorlage / Template wählen
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applyPreset('adhd')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  selectedPreset === 'adhd'
                    ? 'border-cyan-500 bg-cyan-50/60 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold">⚡ ADHS Stimulanzien</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Medikinet, Protein-Boden, P5P
                </div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('audhd')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  selectedPreset === 'audhd'
                    ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold">🧠 AuDHD Darm-Hirn</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Elvanse, Ballaststoffe 35g, Darm
                </div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('fitness')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  selectedPreset === 'fitness'
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold">💪 Fitness &amp; Hypertrophie</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Hohes Protein, TDEE Überschuss
                </div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('custom')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  selectedPreset === 'custom'
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold">✨ Eigenes Profil</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Vollständig freie Konfiguration
                </div>
              </button>
            </div>
          </div>

          {/* Profile Name & Color */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Profilname
              </label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z. B. Alex, Partner, Kind"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Farbakzent
              </label>
              <div className="flex items-center space-x-1.5 pt-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatarColor(c)}
                    className="w-5 h-5 rounded-full transition cursor-pointer flex items-center justify-center shrink-0"
                    style={{ backgroundColor: c }}
                  >
                    {avatarColor === c && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Biometrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alter
              </label>
              <Input
                type="number"
                min="10"
                max="100"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 25)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Größe (cm)
              </label>
              <Input
                type="number"
                min="100"
                max="230"
                value={heightCm}
                onChange={(e) => setHeightCm(parseInt(e.target.value) || 175)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gewicht (kg)
              </label>
              <Input
                type="number"
                step="0.1"
                min="30"
                max="250"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 70)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                KFA % (opt.)
              </label>
              <Input
                type="number"
                step="0.5"
                min="4"
                max="60"
                value={bodyFatPct ?? ''}
                onChange={(e) => setBodyFatPct(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="z. B. 15"
              />
            </div>
          </div>

          {/* Neuro & Meds */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Neuro-Modus
              </label>
              <select
                value={neuroModifier}
                onChange={(e) => setNeuroModifier(e.target.value as NeuroModifier)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
              >
                <option value="NONE">Standard</option>
                <option value="ADHD">ADHS</option>
                <option value="ASD">Autismus (ASD)</option>
                <option value="AUDHD">AuDHD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primärmedikation
              </label>
              <select
                value={medication}
                onChange={(e) => setMedication(e.target.value as MedicationType)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
              >
                <option value="NONE">Keine</option>
                <option value="METHYLPHENIDATE">Medikinet / Ritalin</option>
                <option value="LISDEXAMFETAMINE">Elvanse / Vyvanse</option>
                <option value="ATOMOXETINE">Atomoxetin (Strattera)</option>
                <option value="BUPROPION">Bupropion (Wellbutrin)</option>
                <option value="SSRI">SSRI Antidepressivum</option>
              </select>
            </div>
          </div>

          {/* Demo logs toggle */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                30-Tage Historie &amp; Demo-Logs erzeugen
              </div>
              <div className="text-[10px] text-slate-500">
                Erzeugt realistische Verlaufsdaten für Korrelationen und Analytics
              </div>
            </div>
            <input
              type="checkbox"
              checked={withDemoLogs}
              onChange={(e) => setWithDemoLogs(e.target.checked)}
              className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit" variant="cyan" size="sm">
              Profil anlegen &amp; aktivieren
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
