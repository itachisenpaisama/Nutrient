import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  UserCheck,
  ChevronDown,
  Plus,
  Check,
  UserCog,
  Users,
  Sparkles
} from 'lucide-react';

interface ProfileDropdownProps {
  activeProfile: UserProfile;
  allProfiles: UserProfile[];
  onSelectProfile: (profileId: string) => void;
  onOpenCreateProfile: () => void;
  onOpenManageProfiles: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  activeProfile,
  allProfiles,
  onSelectProfile,
  onOpenCreateProfile,
  onOpenManageProfiles
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const initials = activeProfile.name
    ? activeProfile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const avatarColor = activeProfile.avatarColor || '#06b6d4';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs select-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Profil wechseln"
      >
        {/* Avatar Circle */}
        <div
          className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-[10px] font-extrabold shadow-xs"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </div>

        <span className="font-bold text-slate-900 dark:text-slate-100 max-w-[110px] sm:max-w-[140px] truncate">
          {activeProfile.name}
        </span>

        <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] rounded-md font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          {activeProfile.neuroModifier}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <Users className="w-3.5 h-3.5" />
              <span>Profile ({allProfiles.length})</span>
            </span>
            <span className="text-[10px] text-slate-400">1-Klick Wechsel</span>
          </div>

          {/* Profile List */}
          <div className="py-1 max-h-56 overflow-y-auto">
            {allProfiles.map((p) => {
              const isActive = p.id === activeProfile.id;
              const pInitials = p.name
                ? p.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'P';
              const pColor = p.avatarColor || '#06b6d4';

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSelectProfile(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between transition cursor-pointer ${
                    isActive
                      ? 'bg-cyan-50/70 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: pColor }}
                    >
                      {pInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate leading-tight">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                        <span>{p.neuroModifier}</span>
                        <span>•</span>
                        <span>{p.weightKg}kg</span>
                        {p.medication && p.medication !== 'NONE' && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[80px]">
                              {p.medication.split('_')[0]}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <div className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center shrink-0 ml-2">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions Bottom Bar */}
          <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800 px-2 space-y-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenCreateProfile();
              }}
              className="w-full px-2.5 py-1.5 rounded-xl text-xs font-bold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 flex items-center space-x-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Neues Profil erstellen</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenManageProfiles();
              }}
              className="w-full px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 transition cursor-pointer"
            >
              <UserCog className="w-4 h-4 text-slate-500" />
              <span>Profile verwalten &amp; anpassen</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
