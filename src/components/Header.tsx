import React from 'react';
import { UserProfile, InteractionAlert } from '../types';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { ProfileDropdown } from './profile/ProfileDropdown';
import {
  Brain,
  Sun,
  Moon,
  Globe,
  ShieldAlert,
  Smartphone,
  Stethoscope
} from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
  allProfiles: UserProfile[];
  onSelectProfile: (profileId: string) => void;
  onOpenCreateProfile: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  activeAlerts: InteractionAlert[];
  onOpenProfile: () => void;
  onOpenInstallPrompt: () => void;
  onOpenDoctorReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  allProfiles,
  onSelectProfile,
  onOpenCreateProfile,
  lang,
  onLanguageChange,
  isDark,
  onThemeToggle,
  activeAlerts,
  onOpenProfile,
  onOpenInstallPrompt,
  onOpenDoctorReport
}) => {
  const t = TRANSLATIONS[lang];
  const criticalCount = activeAlerts.filter((a) => a.severity === 'CRITICAL_LOCK').length;
  const warningCount = activeAlerts.filter((a) => a.severity === 'WARNING').length;

  return (
    <header className="sticky top-0 z-30 border-b bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-16 py-2 flex items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
        {/* Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 shrink">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 shrink-0">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                {t.appTitle}
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 shrink-0">
                v2.6
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block truncate">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0 ml-auto">
          {/* Multi-Profile Switcher Dropdown */}
          <ProfileDropdown
            activeProfile={profile}
            allProfiles={allProfiles}
            onSelectProfile={onSelectProfile}
            onOpenCreateProfile={onOpenCreateProfile}
            onOpenManageProfiles={onOpenProfile}
          />

          {/* Doctor / Clinical Summary Report Button */}
          <button
            onClick={onOpenDoctorReport}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition cursor-pointer shadow-2xs"
            title="Klinischen Arzt- &amp; Therapeuten-Bericht öffnen"
          >
            <Stethoscope className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden lg:inline">Arzt-Bericht</span>
          </button>

          {/* Install Prompt Button */}
          <button
            onClick={onOpenInstallPrompt}
            className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50/70 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800/80 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 transition cursor-pointer shadow-2xs"
            title="App auf iPhone / Handy installieren"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden xl:inline">App installieren</span>
          </button>

          {/* Safety Alerts Indicator */}
          {(criticalCount > 0 || warningCount > 0) && (
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${
                criticalCount > 0
                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900 animate-pulse'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>
                {criticalCount > 0 ? `${criticalCount} Lock` : `${warningCount} Warnung`}
              </span>
            </div>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(lang === 'de' ? 'en' : 'de')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
            aria-label="Language Toggle"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="font-bold uppercase">{lang}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-xl border text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
            aria-label="Toggle Theme"
            title={isDark ? t.lightMode : t.darkMode}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform rotate-0 hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
