import React, { useState } from 'react';
import { UserProfile, NutrientPlan, DailyLogSummary } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Printer, Copy, Check, Stethoscope, AlertTriangle } from 'lucide-react';
import { computeDiagnosticsAndInsights } from '../../services/analyticsEngine';
import { perform30DayToxicologyAudit } from '../../services/toxicologyEngine';

interface DoctorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  plan: NutrientPlan;
  logs: DailyLogSummary[];
}

export const DoctorReportModal: React.FC<DoctorReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  plan,
  logs
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const { correlations } = computeDiagnosticsAndInsights(logs, profile);
  const toxicology = perform30DayToxicologyAudit(logs);

  // Compute 30-day symptom averages
  const symptomsWithData = logs.filter((l) => l.symptomLog);
  const avgFocus =
    symptomsWithData.length > 0
      ? (symptomsWithData.reduce((acc, c) => acc + (c.symptomLog?.focusScore || 0), 0) /
          symptomsWithData.length).toFixed(1)
      : 'N/A';

  const avgEnergy =
    symptomsWithData.length > 0
      ? (symptomsWithData.reduce((acc, c) => acc + (c.symptomLog?.energyScore || 0), 0) /
          symptomsWithData.length).toFixed(1)
      : 'N/A';

  const reboundList = symptomsWithData
    .map((l) => l.symptomLog?.reboundSeverityScore)
    .filter((v): v is number => typeof v === 'number');

  const avgRebound =
    reboundList.length > 0
      ? (reboundList.reduce((acc, c) => acc + c, 0) / reboundList.length).toFixed(1)
      : 'N/A';

  const avgSleep =
    symptomsWithData.length > 0
      ? (symptomsWithData.reduce((acc, c) => acc + (c.symptomLog?.sleepQualityScore || 0), 0) /
          symptomsWithData.length).toFixed(1)
      : 'N/A';

  const avgGut =
    symptomsWithData.length > 0
      ? (symptomsWithData.reduce((acc, c) => acc + (c.symptomLog?.gutComfortScore || 0), 0) /
          symptomsWithData.length).toFixed(1)
      : 'N/A';

  // Overall Cofactor Met average
  const avgScorePct =
    logs.length > 0
      ? Math.round(logs.reduce((acc, c) => acc + (c.scorePct || 0), 0) / logs.length)
      : 0;

  const handleCopyReport = () => {
    const text = `
KLINISCHER PATIENTEN- & NÄHRSTOFF-STATUSBERICHT
Erstellt am: ${new Date().toLocaleDateString('de-DE')}
System: NutriNeuro Profiling & Interaction Engine

1. PATIENTENDATEN
Name: ${profile.name}
Alter: ${profile.age} Jahre | Geschlecht: ${profile.gender}
Größe: ${profile.heightCm} cm | Gewicht: ${profile.weightKg} kg (LBM: ${profile.leanBodyMassKg || 'k.A.'} kg)
Neuro-Modus: ${profile.neuroModifier}
Ziel: ${profile.goal}

2. MEDIKATION & TIMING
Hinterlegte Medikamente: ${profile.medications?.join(', ') || profile.medication || 'Keine'}
Besondere Hinweise: ${profile.notes || 'Keine'}

3. SYMPTOM- & VERLAUFS-AVERAGES (30 TAGE)
- Fokus & Konzentration: ${avgFocus}/10
- Energie & Antrieb: ${avgEnergy}/10
- Rebound-Crash Schweregrad: ${avgRebound}/10
- Schlafqualität: ${avgSleep}/10
- Darm-/Verdauungskomfort: ${avgGut}/10
- Nährstoff-Kofaktoren Adhärenz: ${avgScorePct}%

4. EMPIRISCHE KORRELATIONEN (PEARSON)
${correlations.map((c) => `- ${c.nutrientLabelDe} ➔ ${c.symptomLabelDe}: r = ${c.r} (${c.insightDe})`).join('\n')}

5. SICHERHEITS- & TOXIKOLOGIE-STATUS
Akkumulations-Audit: ${toxicology.overallStatus === 'SAFE' ? 'Keine bedenklichen Akkumulationen' : `Status: ${toxicology.overallStatus}`}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onClose={onClose} className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 mb-1">
            <Stethoscope className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Klinische Zusammenfassung</span>
          </div>
          <DialogTitle className="text-lg font-bold">
            Arzt- &amp; Therapeuten-Bericht ({profile.name})
          </DialogTitle>
          <DialogDescription>
            Strukturierte Übersicht für den behandelnden Psychiater, Neurologen oder Hausarzt.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 print:text-black">
          {/* Section 1: Patient Biometrics */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
              <span>Patienten-Biometrie</span>
              <Badge variant="cyan">{profile.neuroModifier}</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>Alter: <strong className="font-mono">{profile.age} Jahre</strong></div>
              <div>Gewicht: <strong className="font-mono">{profile.weightKg} kg</strong></div>
              <div>Größe: <strong className="font-mono">{profile.heightCm} cm</strong></div>
              <div>Grundumsatz: <strong className="font-mono">{plan.bmr} kcal</strong></div>
            </div>
            <div className="text-[11px] pt-1">
              Aktive Medikation(en):{' '}
              <strong className="text-indigo-600 dark:text-indigo-400 font-mono">
                {profile.medications && profile.medications.length > 0
                  ? profile.medications.join(', ')
                  : profile.medication || 'Keine'}
              </strong>
            </div>
          </div>

          {/* Section 2: 30-Day Symptom Scores */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5 flex items-center justify-between">
              <span>30-Tage Verlaufs-Mittelwerte</span>
              <span className="text-[10px] text-slate-400 font-mono">{logs.length} Tage Datengrundlage</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400">Fokus-Score</div>
                <div className="text-base font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">{avgFocus} / 10</div>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400">Energie-Level</div>
                <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{avgEnergy} / 10</div>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400">Rebound-Schwere</div>
                <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">{avgRebound} / 10</div>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400">Schlafqualität</div>
                <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{avgSleep} / 10</div>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400">Darmkomfort</div>
                <div className="text-base font-extrabold text-teal-600 dark:text-teal-400 font-mono">{avgGut} / 10</div>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400">Kofaktoren-Adhärenz</div>
                <div className="text-base font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">{avgScorePct}%</div>
              </div>
            </div>
          </div>

          {/* Section 3: Correlations & Findings */}
          {correlations.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800 space-y-1.5">
              <div className="font-bold text-cyan-900 dark:text-cyan-300">
                Empirische Korrelationen (Pearson r):
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-cyan-950 dark:text-cyan-200">
                {correlations.map((c, i) => (
                  <li key={i}>
                    <strong>r = {c.r}</strong> ({c.nutrientLabelDe} &amp; {c.symptomLabelDe}): {c.insightDe}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 4: Clinical Guidelines */}
          {plan.specialGuidelines.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-1.5 text-[11px] text-amber-900 dark:text-amber-200">
              <div className="font-bold flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Therapeutische Leitlinien &amp; Nährstoff-Vorschriften:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1">
                {plan.specialGuidelines.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyReport}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                <span>Kopiert!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                <span>Bericht kopieren</span>
              </>
            )}
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              <span>Drucken / PDF</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Schließen
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
