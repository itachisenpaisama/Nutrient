import React from 'react';
import { TRANSLATIONS, Language } from '../i18n/translations';
import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  UserCog,
  LineChart,
  FolderTree
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'tracker' | 'lexicon' | 'profile' | 'analytics' | 'vault';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  lang: Language;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  lang
}) => {
  const t = TRANSLATIONS[lang];

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'tracker', label: t.navTracker, icon: UtensilsCrossed },
    { id: 'lexicon', label: t.navLexicon, icon: BookOpen },
    { id: 'profile', label: t.navProfile, icon: UserCog },
    { id: 'analytics', label: t.navAnalytics, icon: LineChart },
    { id: 'vault', label: t.navVault, icon: FolderTree }
  ];

  return (
    <nav className="bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
