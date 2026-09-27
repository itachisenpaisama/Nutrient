import React from 'react';
import { UserProfile, InteractionAlert } from '../types';
import { TRANSLATIONS, Language } from '../i18n/translations';
import {
  Brain,
  Sun,
  Moon,
  Globe,
  ShieldAlert,
  Activity,
  UserCheck,
  Smartphone
} from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  activeAlerts: InteractionAlert[];
  onOpenProfile: () => void;
  onOpenInstallPrompt: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  lang,
  onLanguageChange,
  isDark,
  onThemeToggle,
  activeAlerts,
  onOpenProfile,
  onOpenInstallPrompt
}) => {
  const t = TRANSLATIONS[lang];
  const criticalCount = activeAlerts.filter((a) => a.severity === 'CRITICAL_LOCK').length;
  const warningCount = activeAlerts.filter((a) => a.severity === 'WARNING').length;

  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.appTitle}
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                v2.6 Neuro
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Active Profile Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Profil bearbeiten"
          >
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span className="hidden md:inline font-semibold">{profile.name}</span>
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono">
              {profile.neuroModifier}
            </span>
          </button>

          {/* Install on Phone / iPhone Button */}
          <button
            onClick={onOpenInstallPrompt}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800/80 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 transition cursor-pointer shadow-sm shadow-cyan-500/10"
            title="App auf iPhone / Handy installieren"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">App installieren</span>
          </button>

          {/* Safety Alerts Indicator */}
          {(criticalCount > 0 || warningCount > 0) && (
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
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
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            aria-label="Language Toggle"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="font-bold uppercase">{lang}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg border text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
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
