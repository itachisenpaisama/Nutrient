import React from 'react';
import { DailyLogSummary, NutrientPlan } from '../../types';
import { Language } from '../../i18n/translations';
import { Sparkles, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface NeuroScoreCardProps {
  log: DailyLogSummary;
  plan: NutrientPlan;
  lang: Language;
}

export const NeuroScoreCard: React.FC<NeuroScoreCardProps> = ({ log, plan }) => {
  const { scorePct, cofactorsMet, totals } = log;

  let statusText = 'OPTIMAL';
  let statusBadgeClass = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';

  if (scorePct < 60) {
    statusText = 'DEFIZITÄR';
    statusBadgeClass = 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';
  } else if (scorePct < 80) {
    statusText = 'GUT';
    statusBadgeClass = 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800';
  }

  const cofactorList = [
    {
      id: 'iron',
      name: 'Eisen-Vorstufe (Fe2+)',
      met: cofactorsMet.iron,
      current: `${totals.ironMg.toFixed(1)} mg`,
      target: `${plan.ironMg} mg`,
      role: 'Kofaktor Tyrosin-Hydroxylase'
    },
    {
      id: 'magnesium',
      name: 'Magnesium',
      met: cofactorsMet.magnesium,
      current: `${Math.round(totals.magnesiumMg)} mg`,
      target: `${plan.magnesiumMg} mg`,
      role: 'NMDA-Blocker & ATP-Stabilisator'
    },
    {
      id: 'p5pB6',
      name: 'P5P (Bioaktives B6)',
      met: cofactorsMet.p5pB6,
      current: `${totals.vitaminB6Mg.toFixed(1)} mg`,
      target: `${plan.vitaminB6Mg} mg`,
      role: 'AADC Kofaktor für L-DOPA -> Dopamin'
    },
    {
      id: 'zinc',
      name: 'Zink',
      met: cofactorsMet.zinc,
      current: `${totals.zincMg.toFixed(1)} mg`,
      target: `${plan.zincMg} mg`,
      role: 'Allosterische DAT-Transporter Modulation'
    },
    {
      id: 'omega3Epa',
      name: 'Omega-3 EPA',
      met: cofactorsMet.omega3Epa,
      current: `${Math.round(totals.omega3EpaMg)} mg`,
      target: `${plan.omega3EpaMg} mg`,
      role: 'Membranfluidität & Neuroinflammation'
    },
    {
      id: 'vitaminB12',
      name: 'Vitamin B12 & Folat',
      met: cofactorsMet.vitaminB12,
      current: `${totals.vitaminB12Ug.toFixed(1)} µg`,
      target: `${plan.vitaminB12Ug} µg`,
      role: 'Methylierungszyklus & SAMe'
    },
    {
      id: 'fiber',
      name: 'Ballaststoffe (SCFA)',
      met: cofactorsMet.fiber,
      current: `${totals.fiberG.toFixed(1)} g`,
      target: `${plan.fiberGrams} g`,
      role: 'Butyrat-Synthese & Darm-Hirn-Achse'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Neuro-Mikronährstoff-Score
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kofaktoren-Adhärenz für Neurotransmitter-Synthesewege
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">
            {scorePct}%
          </span>
          <span
            className={`px-2.5 py-0.5 text-xs font-bold rounded-lg border uppercase tracking-wider ${statusBadgeClass}`}
          >
            {statusText}
          </span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${scorePct}%` }}
        />
      </div>

      {/* Cofactor Checklist */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Kofaktoren-Check:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {cofactorList.map((c) => (
            <div
              key={c.id}
              className={`p-2.5 rounded-xl border flex items-start space-x-2.5 transition-colors ${
                c.met
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
              }`}
            >
              {c.met ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="truncate">{c.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {c.current} / {c.target}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {c.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
