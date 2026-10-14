import React, { useState, useMemo } from 'react';
import { DailyLogSummary, UserProfile, NutrientPlan } from '../../types';
import { StorageService } from '../../services/storageService';
import { Language } from '../../i18n/translations';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  BookOpen,
  Calendar,
  Download,
  Printer,
  Copy,
  Check,
  Search,
  Sparkles,
  Pill,
  UtensilsCrossed,
  AlertTriangle,
  Edit3,
  Save,
  FileText,
  FileDown,
  Upload,
  CalendarDays,
  Brain,
  Quote,
  Flame,
  ArrowUpRight
} from 'lucide-react';

export interface DailyJournalViewProps {
  logs: DailyLogSummary[];
  profile: UserProfile;
  plan: NutrientPlan;
  lang: Language;
  onRefreshData: () => void;
  onNavigateToDate: (date: string) => void;
  onUpdateLogs?: (updatedLogs: DailyLogSummary[]) => void;
}

export const DailyJournalView: React.FC<DailyJournalViewProps> = ({
  logs,
  profile,
  plan,
  onRefreshData,
  onNavigateToDate,
  onUpdateLogs
}) => {
  // Sort logs by date descending (newest first)
  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => b.date.localeCompare(a.date));
  }, [logs]);

  // Selected date state (defaults to newest log)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return sortedLogs[0]?.date || '2026-09-27';
  });

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [isBackupMenuOpen, setIsBackupMenuOpen] = useState(false);

  // Find active day's log summary
  const currentLog = useMemo(() => {
    return (
      logs.find((l) => l.date === selectedDate) ||
      sortedLogs[0] || {
        date: selectedDate,
        entries: [],
        totals: {
          calories: 0,
          proteinG: 0,
          carbsG: 0,
          fatG: 0,
          fiberG: 0,
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
          copperMg: 0
        },
        scorePct: 0,
        cofactorsMet: {
          iron: false,
          magnesium: false,
          p5pB6: false,
          zinc: false,
          omega3Epa: false,
          vitaminB12: false,
          fiber: false
        },
        alerts: []
      }
    );
  }, [logs, selectedDate, sortedLogs]);

  // Extract unique months for filter pills
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    for (const l of sortedLogs) {
      if (l.date && l.date.length >= 7) {
        months.add(l.date.slice(0, 7)); // YYYY-MM
      }
    }
    return Array.from(months);
  }, [sortedLogs]);

  // Filter logs for sidebar
  const filteredLogs = useMemo(() => {
    return sortedLogs.filter((l) => {
      // Month match
      if (selectedMonth !== 'all' && !l.date.startsWith(selectedMonth)) {
        return false;
      }
      // Search match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inDate = l.date.toLowerCase().includes(q);
      const inNotes = l.symptomLog?.notes?.toLowerCase().includes(q);
      const inEntries = l.entries.some((e) => e.title.toLowerCase().includes(q));
      return inDate || inNotes || inEntries;
    });
  }, [sortedLogs, selectedMonth, searchQuery]);

  // Formatted date string in German
  const formattedDate = useMemo(() => {
    try {
      const d = new Date(currentLog.date + 'T00:00:00');
      return d.toLocaleDateString('de-DE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return currentLog.date;
    }
  }, [currentLog.date]);

  // Copy Markdown of current day
  const handleCopyMarkdown = () => {
    const md = StorageService.generateDayMarkdown(currentLog, profile, plan);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Markdown of current day
  const handleDownloadDayMarkdown = () => {
    const md = StorageService.generateDayMarkdown(currentLog, profile, plan);
    StorageService.downloadFile(
      `tagebuch-blatt-${currentLog.date}-${profile.name.toLowerCase().replace(/\s+/g, '_')}.md`,
      md,
      'text/markdown'
    );
  };

  // Download JSON of current day
  const handleDownloadDayJson = () => {
    StorageService.downloadJsonFile(
      `tagebuch-eintrag-${currentLog.date}.json`,
      JSON.stringify(currentLog, null, 2)
    );
  };

  // Download Entire 30-Day Journal as compiled Markdown book
  const handleDownloadFullJournalMarkdown = () => {
    const fullMd = StorageService.generateFullJournalMarkdown(logs, profile, plan);
    StorageService.downloadFile(
      `tagebuch-komplett-${profile.name.toLowerCase().replace(/\s+/g, '_')}-archiv.md`,
      fullMd,
      'text/markdown'
    );
  };

  // Full Backup JSON
  const handleExportFullBackup = () => {
    StorageService.exportFullVaultAsJson();
  };

  // Import Backup JSON
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = StorageService.importVaultFromJson(content);
        if (ok) {
          alert('Tagebuch-Backup erfolgreich importiert!');
          onRefreshData();
        } else {
          alert('Fehler beim Importieren des Backups. Bitte JSON-Format prüfen.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Print sheet
  const handlePrint = () => {
    window.print();
  };

  // Start editing day note
  const handleStartEditNote = () => {
    setNoteDraft(currentLog.symptomLog?.notes || '');
    setIsEditingNote(true);
  };

  // Save day note
  const handleSaveNote = () => {
    const updatedLogs = StorageService.saveDayNote(currentLog.date, noteDraft, profile.id);
    if (onUpdateLogs) {
      onUpdateLogs(updatedLogs);
    }
    setIsEditingNote(false);
  };

  // Helper to format month YYYY-MM into readable German label
  const formatMonthLabel = (m: string) => {
    try {
      const d = new Date(`${m}-01T00:00:00`);
      return d.toLocaleDateString('de-DE', { month: 'short', year: 'numeric' });
    } catch {
      return m;
    }
  };

  const symptom = currentLog.symptomLog;
  const isOptimal = currentLog.scorePct >= 80;
  const isDeficit = currentLog.scorePct < 60;

  return (
    <div className="space-y-6">
      {/* Print CSS Injection */}
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          header, nav, .no-print, .journal-sidebar {
            display: none !important;
          }
          .journal-main-container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .journal-sheet {
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #0f172a !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Top Banner & Control Bar */}
      <Card className="no-print border-cyan-200/80 dark:border-cyan-900/60 bg-gradient-to-r from-cyan-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/20 shadow-xs">
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-600 text-white shadow-md shadow-cyan-600/25 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Tagebuch &amp; Tages-Archiv
                </h1>
                <Badge variant="cyan" className="text-xs">
                  {logs.length} Tage
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Strukturierte Tagesblätter für Ernährung, Medikation, Kinetik &amp; mentale Fokus-Reflexionen.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="cyan"
              size="sm"
              onClick={handlePrint}
              className="text-xs shadow-xs"
              title="Aktuelles Tagesblatt drucken oder als PDF speichern"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Seite drucken / PDF
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadDayMarkdown}
              className="text-xs text-slate-700 dark:text-slate-200"
              title="Diesen Tag als Markdown-Datei (.md) herunterladen"
            >
              <FileDown className="w-3.5 h-3.5 mr-1.5 text-cyan-600 dark:text-cyan-400" />
              Tag als .md
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyMarkdown}
              className="text-xs text-slate-700 dark:text-slate-200"
              title="Tagesblatt formatiert in Zwischenablage kopieren"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  Kopiert!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Kopieren
                </>
              )}
            </Button>

            {/* Backup & More Dropdown Toggle */}
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsBackupMenuOpen(!isBackupMenuOpen)}
                className="text-xs"
              >
                <span>Export &amp; Backup ▾</span>
              </Button>

              {isBackupMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Archiv-Aktionen
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBackupMenuOpen(false);
                      handleDownloadFullJournalMarkdown();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-cyan-500" />
                    <span>Gesamtes Tagebuch (.md)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBackupMenuOpen(false);
                      handleDownloadDayJson();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span>Tag als JSON exportieren</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBackupMenuOpen(false);
                      handleExportFullBackup();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-500" />
                    <span>Vollständiges Backup (JSON)</span>
                  </button>
                  <label className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-300 cursor-pointer border-t border-slate-100 dark:border-slate-800 mt-1">
                    <Upload className="w-4 h-4 text-amber-500" />
                    <span>Backup importieren</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        setIsBackupMenuOpen(false);
                        handleImportBackup(e);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Master-Detail Layout: Left Archive Index + Right Journal Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Index & Day Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4 journal-sidebar no-print">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="p-4 pb-3 space-y-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <CalendarDays className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Inhaltsverzeichnis ({filteredLogs.length})</span>
                </CardTitle>
                <span className="text-[10px] text-slate-400 font-mono">
                  {profile.name}
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tag, Mahlzeit, Notiz suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs h-8 rounded-xl"
                />
              </div>

              {/* Month Filters */}
              {availableMonths.length > 1 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedMonth('all')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition cursor-pointer border ${
                      selectedMonth === 'all'
                        ? 'bg-cyan-600 text-white border-cyan-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Alle
                  </button>
                  {availableMonths.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMonth(m)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition cursor-pointer border ${
                        selectedMonth === m
                          ? 'bg-cyan-600 text-white border-cyan-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {formatMonthLabel(m)}
                    </button>
                  ))}
                </div>
              )}
            </CardHeader>

            {/* List of Day Pages */}
            <div className="p-2 space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Keine Tagebuch-Einträge gefunden für diese Suche.
                </div>
              ) : (
                filteredLogs.map((log) => {
                  const isSelected = log.date === selectedDate;
                  const dayNum = log.date.slice(8, 10);
                  const dObj = new Date(log.date + 'T00:00:00');
                  const weekdayShort = dObj.toLocaleDateString('de-DE', { weekday: 'short' });
                  const focus = log.symptomLog?.focusScore;
                  const hasNote = Boolean(log.symptomLog?.notes);
                  const mealCount = log.entries.filter((e) => e.mealType !== 'medication' && e.mealType !== 'supplement').length;
                  const medCount = log.entries.filter((e) => e.mealType === 'medication').length;

                  return (
                    <button
                      key={log.date}
                      type="button"
                      onClick={() => setSelectedDate(log.date)}
                      className={`w-full p-2.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-500 shadow-xs ring-1 ring-cyan-500/30'
                          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Left Date Badge */}
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <span className="text-[9px] font-bold uppercase leading-none">
                            {weekdayShort}
                          </span>
                          <span className="text-sm font-extrabold leading-tight">
                            {dayNum}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {log.date}
                            </span>
                            {hasNote && (
                              <Quote className="w-2.5 h-2.5 text-cyan-600 shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 truncate">
                            <span>{Math.round(log.totals.calories)} kcal</span>
                            <span>•</span>
                            <span>{Math.round(log.totals.proteinG)}g P</span>
                            {focus && (
                              <>
                                <span>•</span>
                                <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                                  🎯 {focus}/10
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Indicator Pill */}
                      <div className="shrink-0 flex flex-col items-end space-y-1">
                        <Badge
                          variant={
                            log.scorePct >= 80 ? 'success' : log.scorePct >= 60 ? 'cyan' : 'warning'
                          }
                          className="text-[9px] px-1.5 py-0"
                        >
                          {log.scorePct}%
                        </Badge>
                        <div className="text-[9px] text-slate-400 font-mono">
                          {mealCount}M · {medCount}Rx
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: The Beautifully Designed Journal Sheet (8 cols) */}
        <div className="lg:col-span-8 journal-main-container">
          <div className="journal-sheet bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-6 sm:p-8 space-y-6 relative overflow-hidden">
            {/* Subtle decorative background watermarks */}
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />

            {/* HEADER OF THE JOURNAL PAGE */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Tagebuch-Blatt · {currentLog.date}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {formattedDate}
                  </h2>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>Patient / Profil:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                      {profile.name}
                    </strong>
                    <span>({profile.neuroModifier} · {profile.goal})</span>
                  </div>
                </div>

                {/* Status Badges & Quick Action */}
                <div className="flex flex-wrap items-center gap-1.5 sm:self-start">
                  <Badge
                    variant={isOptimal ? 'success' : isDeficit ? 'destructive' : 'cyan'}
                    className="text-xs px-2.5 py-1"
                  >
                    Neuro-Score: {currentLog.scorePct}%
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigateToDate(currentLog.date)}
                    className="no-print h-8 text-xs text-cyan-700 dark:text-cyan-300 border-cyan-400 dark:border-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-950"
                    title="Diesen Tag im Live-Tracker bearbeiten"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                    Im Tracker öffnen
                  </Button>
                </div>
              </div>

              {/* Day Scoreboard Summary Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Kalorien
                  </div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {Math.round(currentLog.totals.calories)}
                    <span className="text-[10px] font-normal text-slate-400"> / {plan.targetCalories} kcal</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Protein
                  </div>
                  <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {Math.round(currentLog.totals.proteinG)}g
                    <span className="text-[10px] font-normal text-slate-400"> / {plan.proteinGrams}g</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Hydration
                  </div>
                  <div className="text-base font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5">
                    {(currentLog.waterMl || 0).toLocaleString()}
                    <span className="text-[10px] font-normal text-slate-400"> / {currentLog.waterGoalMl || profile.waterGoalMl || 3000} ml</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Fokus-Rating
                  </div>
                  <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {symptom?.focusScore ? `${symptom.focusScore} / 10` : '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 1: TAGESREFLEXION & BEFINDLICHKEIT (JOURNAL REFLECTION) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Brain className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>1. Tages-Reflexion &amp; Befindlichkeit</span>
                </div>
                {!isEditingNote && (
                  <button
                    type="button"
                    onClick={handleStartEditNote}
                    className="no-print text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{symptom?.notes ? 'Notiz bearbeiten' : 'Tagesnotiz verfassen'}</span>
                  </button>
                )}
              </div>

              {/* 5 Clinical Symptom Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div className="p-2.5 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200/60 dark:border-cyan-900/60 text-center">
                  <div className="text-[10px] font-bold uppercase text-cyan-800 dark:text-cyan-300">
                    🎯 Fokus
                  </div>
                  <div className="text-lg font-extrabold text-cyan-700 dark:text-cyan-400">
                    {symptom?.focusScore ? `${symptom.focusScore}/10` : '—'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 text-center">
                  <div className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300">
                    ⚡ Energie
                  </div>
                  <div className="text-lg font-extrabold text-amber-700 dark:text-amber-400">
                    {symptom?.energyScore ? `${symptom.energyScore}/10` : '—'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/60 text-center">
                  <div className="text-[10px] font-bold uppercase text-indigo-800 dark:text-indigo-300">
                    🌙 Schlaf
                  </div>
                  <div className="text-lg font-extrabold text-indigo-700 dark:text-indigo-400">
                    {symptom?.sleepQualityScore ? `${symptom.sleepQualityScore}/10` : '—'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/60 text-center">
                  <div className="text-[10px] font-bold uppercase text-teal-800 dark:text-teal-300">
                    🌱 Darm
                  </div>
                  <div className="text-lg font-extrabold text-teal-700 dark:text-teal-400">
                    {symptom?.gutComfortScore ? `${symptom.gutComfortScore}/10` : '—'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/60 text-center col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-bold uppercase text-rose-800 dark:text-rose-300">
                    💥 Rebound
                  </div>
                  <div className="text-lg font-extrabold text-rose-700 dark:text-rose-400">
                    {typeof symptom?.reboundSeverityScore === 'number'
                      ? `${symptom.reboundSeverityScore}/10`
                      : '—'}
                  </div>
                </div>
              </div>

              {/* Journal Note Card (Designed like a genuine diary paper block) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/15 border border-amber-200/60 dark:border-amber-900/40 relative">
                <Quote className="w-8 h-8 text-amber-300 dark:text-amber-800/40 absolute right-3 top-3 -z-0 pointer-events-none" />

                {isEditingNote ? (
                  <div className="space-y-3 relative z-10">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Tagebuch-Notiz für {currentLog.date} bearbeiten:
                    </label>
                    <textarea
                      rows={3}
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="Wie war dein Fokus? Gab es Rebound oder Wirkungsschwankungen? Was hast du bemerkt?"
                      className="w-full text-xs p-3 rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed"
                    />
                    <div className="flex items-center space-x-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingNote(false)}
                        className="text-xs"
                      >
                        Abbrechen
                      </Button>
                      <Button
                        variant="cyan"
                        size="sm"
                        onClick={handleSaveNote}
                        className="text-xs"
                      >
                        <Save className="w-3.5 h-3.5 mr-1" />
                        Notiz im Tagebuch speichern
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1 flex items-center space-x-1">
                      <span>Tagebuch-Notiz des Tages:</span>
                    </div>
                    {symptom?.notes ? (
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic font-serif">
                        "{symptom.notes}"
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Keine persönliche Notiz für diesen Tag hinterlegt. Klicke auf „Tagesnotiz verfassen“, um deine Gedanken festzuhalten.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: CHRONOLOGISCHE TAGES-TIMELINE (MEALS & MEDS) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <UtensilsCrossed className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>2. Chronologischer Tagesablauf ({currentLog.entries.length} Einträge)</span>
              </div>

              {currentLog.entries.length === 0 ? (
                <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                  Keine Mahlzeiten oder Medikamente für diesen Tag protokolliert.
                </div>
              ) : (
                <div className="space-y-2 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 pl-8">
                  {[...currentLog.entries]
                    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
                    .map((entry) => {
                      const time = entry.timestamp.slice(11, 16);
                      const isMed = entry.mealType === 'medication';
                      const isSupp = entry.mealType === 'supplement';

                      return (
                        <div
                          key={entry.id}
                          className="p-3 rounded-2xl border transition relative bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                        >
                          {/* Timeline dot */}
                          <div
                            className={`absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                              isMed
                                ? 'bg-indigo-600'
                                : isSupp
                                ? 'bg-emerald-500'
                                : 'bg-cyan-500'
                            }`}
                          />

                          <div className="flex items-start sm:items-center space-x-2.5 min-w-0">
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 shrink-0">
                              {time}
                            </span>

                            <div className="min-w-0">
                              <div className="font-bold text-xs text-slate-900 dark:text-white truncate flex items-center space-x-1.5">
                                {isMed && <Pill className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                                {isSupp && <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                                <span>{entry.title}</span>
                              </div>

                              {isMed && entry.dosage && (
                                <div className="text-[10px] text-slate-500">
                                  Dosis: <strong className="font-medium text-slate-700 dark:text-slate-300">{entry.dosage}</strong>
                                  {entry.timingVerified && (
                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold ml-2">
                                      ✓ Protein-Boden verifiziert
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Nutrition Values if Meal */}
                          {!isMed && !isSupp && (
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono shrink-0">
                              <Badge variant="outline" className="text-[10px]">
                                {Math.round(entry.calories)} kcal
                              </Badge>
                              <Badge variant="secondary" className="text-[10px] text-emerald-700 dark:text-emerald-300">
                                {Math.round(entry.proteinG)}g P
                              </Badge>
                              <Badge variant="outline" className="text-[10px]">
                                {Math.round(entry.carbsG)}g KH
                              </Badge>
                              <Badge variant="outline" className="text-[10px]">
                                {Math.round(entry.fatG)}g F
                              </Badge>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* SECTION 3: NÄHRSTOFF- & KOFAKTOREN-BILANZ */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Flame className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>3. Nährstoff- &amp; Kofaktoren-Bilanz</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Protein</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {Math.round(currentLog.totals.proteinG)}g / {plan.proteinGrams}g
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">
                    {Math.round((currentLog.totals.proteinG / Math.max(1, plan.proteinGrams)) * 100)}% Ziel
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Kohlenhydrate</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {Math.round(currentLog.totals.carbsG)}g / {plan.carbGrams}g
                  </div>
                  <div className="text-[10px] text-cyan-600 font-medium">
                    {Math.round((currentLog.totals.carbsG / Math.max(1, plan.carbGrams)) * 100)}% Ziel
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Fette (Hormone)</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {Math.round(currentLog.totals.fatG)}g / {plan.fatGrams}g
                  </div>
                  <div className="text-[10px] text-amber-600 font-medium">
                    {Math.round((currentLog.totals.fatG / Math.max(1, plan.fatGrams)) * 100)}% Ziel
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Ballaststoffe</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {Math.round(currentLog.totals.fiberG)}g / {plan.fiberGrams}g
                  </div>
                  <div className="text-[10px] text-teal-600 font-medium">
                    {Math.round((currentLog.totals.fiberG / Math.max(1, plan.fiberGrams)) * 100)}% Ziel
                  </div>
                </div>
              </div>

              {/* Cofactor Adherence Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Kofaktoren:</span>
                <Badge
                  variant={currentLog.cofactorsMet.p5pB6 ? 'success' : 'outline'}
                  className="text-[10px]"
                >
                  P5P B6 {currentLog.cofactorsMet.p5pB6 ? '✓' : '✗'}
                </Badge>
                <Badge
                  variant={currentLog.cofactorsMet.magnesium ? 'success' : 'outline'}
                  className="text-[10px]"
                >
                  Magnesium {currentLog.cofactorsMet.magnesium ? '✓' : '✗'}
                </Badge>
                <Badge
                  variant={currentLog.cofactorsMet.iron ? 'success' : 'outline'}
                  className="text-[10px]"
                >
                  Eisen {currentLog.cofactorsMet.iron ? '✓' : '✗'}
                </Badge>
                <Badge
                  variant={currentLog.cofactorsMet.zinc ? 'success' : 'outline'}
                  className="text-[10px]"
                >
                  Zink {currentLog.cofactorsMet.zinc ? '✓' : '✗'}
                </Badge>
                <Badge
                  variant={currentLog.cofactorsMet.omega3Epa ? 'success' : 'outline'}
                  className="text-[10px]"
                >
                  Omega-3 EPA {currentLog.cofactorsMet.omega3Epa ? '✓' : '✗'}
                </Badge>
                <Badge
                  variant={currentLog.cofactorsMet.vitaminB12 ? 'success' : 'outline'}
                  className="text-[10px]"
                >
                  B12 {currentLog.cofactorsMet.vitaminB12 ? '✓' : '✗'}
                </Badge>
                <Badge
                  variant={currentLog.cofactorsMet.fiber ? 'success' : 'outline'}
                  className="text-[10px]"
                >
                  SCFA Ballaststoffe {currentLog.cofactorsMet.fiber ? '✓' : '✗'}
                </Badge>
              </div>
            </div>

            {/* SECTION 4: SICHERHEIT & WECHSELWIRKUNGEN */}
            {currentLog.alerts && currentLog.alerts.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>4. Wechselwirkungs-Hinweise dieses Tages</span>
                </div>
                {currentLog.alerts.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200"
                  >
                    <strong>{a.titleDe}:</strong> {a.messageDe}
                  </div>
                ))}
              </div>
            )}

            {/* PAGE FOOTER / DOCUMENT SIGN OFF */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-400">
              <div>
                NutriNeuro Tagesblatt-Dossier · Profil: <strong>{profile.name}</strong> · ID: {profile.id}
              </div>
              <div>
                Dokumentiert am {currentLog.date} · Exportiert über NutriNeuro Engine
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
