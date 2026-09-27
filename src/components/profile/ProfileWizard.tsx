import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, PhysicalGoal, NeuroModifier, MedicationType } from '../../types';
import { calculateNutrientPlan } from '../../services/calculationEngine';
import { Language, TRANSLATIONS } from '../../i18n/translations';
import {
  User,
  Calculator,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Sparkles
} from 'lucide-react';

interface ProfileWizardProps {
  initialProfile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  lang: Language;
}

export const ProfileWizard: React.FC<ProfileWizardProps> = ({
  initialProfile,
  onSaveProfile,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Live calculation of plan as the user tweaks inputs
  const calculatedPlan = calculateNutrientPlan(profile);

  // Calculate LBM live
  const calculatedLbm =
    profile.bodyFatPct && profile.bodyFatPct > 0 && profile.bodyFatPct < 100
      ? Math.round(profile.weightKg * (1 - profile.bodyFatPct / 100) * 10) / 10
      : undefined;

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
    setSavedSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      leanBodyMassKg: calculatedLbm,
      updatedAt: new Date().toISOString()
    };
    onSaveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-cyan-900/10 via-slate-900/5 to-emerald-900/10 dark:from-slate-900 dark:to-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Brain className="w-4 h-4" />
          <span>Biometrische Profiling-Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Benutzerprofil & Algorithmen-Konfiguration
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Berechnet dynamisch Grundumsatz (BMR über Mifflin-St Jeor oder Katch-McArdle bei bekanntem KFA), TDEE, Kaskaden-Makronährstoffe sowie kofaktor-optimierte Mikronährstoff-Targets für Neurodivergenz.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 space-y-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              1. Basis-Anthropometrie
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Name / Profilbezeichnung
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.age}
                </label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  value={profile.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 25)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.gender}
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value as Gender)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="male">{t.male}</option>
                  <option value="female">{t.female}</option>
                  <option value="divergent">{t.divergent}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.height}
                </label>
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={profile.heightCm}
                  onChange={(e) => handleInputChange('heightCm', parseInt(e.target.value) || 175)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.weight}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="35"
                  max="250"
                  value={profile.weightKg}
                  onChange={(e) => handleInputChange('weightKg', parseFloat(e.target.value) || 70)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Körperfettanteil (KFA %; optional)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="3"
                  max="60"
                  value={profile.bodyFatPct || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'bodyFatPct',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                  placeholder="z. B. 15%"
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            {calculatedLbm && (
              <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs text-cyan-800 dark:text-cyan-300 flex items-center justify-between">
                <span className="font-semibold">Berechnete Lean Body Mass (LBM):</span>
                <span className="font-mono font-bold">{calculatedLbm} kg</span>
              </div>
            )}
          </div>

          {/* Section 2: PAL & Goal */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              2. Aktivität & Zielsetzung
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.activityLevel}
              </label>
              <select
                value={profile.activityLevel}
                onChange={(e) => handleInputChange('activityLevel', parseFloat(e.target.value) as ActivityLevel)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              >
                <option value={1.2}>{t.palSedentary}</option>
                <option value={1.375}>{t.palLight}</option>
                <option value={1.55}>{t.palModerate}</option>
                <option value={1.725}>{t.palVeryActive}</option>
                <option value={1.9}>{t.palExtreme}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.physicalGoal}
              </label>
              <select
                value={profile.goal}
                onChange={(e) => handleInputChange('goal', e.target.value as PhysicalGoal)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              >
                <option value="FAT_LOSS">{t.goalFatLoss}</option>
                <option value="MAINTENANCE">{t.goalMaintenance}</option>
                <option value="HYPERTROPHY">{t.goalHypertrophy}</option>
              </select>
            </div>
          </div>

          {/* Section 3: Neurodivergence & Medication */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              3. Neurodivergenz & Medikation
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.neuroModifier}
              </label>
              <select
                value={profile.neuroModifier}
                onChange={(e) => handleInputChange('neuroModifier', e.target.value as NeuroModifier)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white font-semibold"
              >
                <option value="NONE">{t.modNone}</option>
                <option value="ADHD">{t.modAdhd}</option>
                <option value="ASD">{t.modAsd}</option>
                <option value="AUDHD">{t.modAudhd}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.medication}
              </label>
              <select
                value={profile.medication}
                onChange={(e) => handleInputChange('medication', e.target.value as MedicationType)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white font-semibold"
              >
                <option value="NONE">{t.medNone}</option>
                <option value="METHYLPHENIDATE">{t.medMph}</option>
                <option value="SSRI">{t.medSSRI}</option>
                <option value="IRON_SUPPLEMENT">{t.medIron}</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="glutenCasein"
                checked={profile.trackGlutenCasein}
                onChange={(e) => handleInputChange('trackGlutenCasein', e.target.checked)}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="glutenCasein" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                {t.trackGlutenCasein}
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.applied}!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer transition shadow-md shadow-cyan-600/20"
            >
              {t.saveProfile}
            </button>
          </div>
        </div>

        {/* Right Col: Live Calculation Engine Preview */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Live Engine Output</span>
            </div>

            <div className="space-y-2 border-b border-slate-800 pb-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Grundumsatz (BMR):</span>
                <span className="font-mono font-bold text-cyan-300">
                  {calculatedPlan.bmr} kcal
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Gesamtumsatz (TDEE):</span>
                <span className="font-mono font-bold text-slate-200">
                  {calculatedPlan.tdee} kcal
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Ziel-Kalorien:</span>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">
                  {calculatedPlan.targetCalories} kcal
                </span>
              </div>
            </div>

            {/* Kaskaden Makronährstoffe */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Kaskaden-Makronährstoffe
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Protein:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {calculatedPlan.proteinGrams}g ({calculatedPlan.proteinKcal} kcal)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Fett (Hormonschutz):</span>
                  <span className="font-mono font-bold text-amber-400">
                    {calculatedPlan.fatGrams}g ({calculatedPlan.fatKcal} kcal)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Kohlenhydrate (Neuro):</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {calculatedPlan.carbGrams}g ({calculatedPlan.carbKcal} kcal)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Ballaststoffe (Darm):</span>
                  <span className="font-mono font-bold text-teal-400">
                    {calculatedPlan.fiberGrams}g
                  </span>
                </div>
              </div>
            </div>

            {/* Micronutrient Targets */}
            <div className="border-t border-slate-800 pt-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Neuro-Mikronährstoff Ziele
              </span>
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span>Omega-3 EPA:</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {calculatedPlan.omega3EpaMg} mg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Eisen:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {calculatedPlan.ironMg} mg (Ferritin &gt; 50)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Magnesium:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {calculatedPlan.magnesiumMg} mg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Zink:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {calculatedPlan.zincMg} mg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>P5P (Bioaktives B6):</span>
                  <span className="font-mono font-bold text-slate-200">
                    {calculatedPlan.vitaminB6Mg} mg
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines info card */}
          {calculatedPlan.specialGuidelines.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <div className="font-bold flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Klinische Profil-Richtlinien:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                {calculatedPlan.specialGuidelines.map((g, idx) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
