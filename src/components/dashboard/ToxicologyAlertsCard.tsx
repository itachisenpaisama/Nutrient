import React from 'react';
import { ToxicologyReport } from '../../services/toxicologyEngine';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info } from 'lucide-react';

interface ToxicologyAlertsCardProps {
  report: ToxicologyReport;
}

export const ToxicologyAlertsCard: React.FC<ToxicologyAlertsCardProps> = ({ report }) => {
  const { overallStatus, items, daysAnalyzed } = report;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div
            className={`p-2 rounded-lg ${
              overallStatus === 'CRITICAL'
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                : overallStatus === 'ATTENTION'
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {overallStatus === 'SAFE' ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <ShieldAlert className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Toxikologie- & Akkumulations-Audit (30 Tage)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prüfung kumulierender Mikronährstoffe gegen EFSA Upper Limits (UL)
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${
            overallStatus === 'CRITICAL'
              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300'
              : overallStatus === 'ATTENTION'
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300'
              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300'
          }`}
        >
          {overallStatus === 'SAFE'
            ? 'Alle Werte sicher'
            : overallStatus === 'ATTENTION'
            ? 'Hinweise aktiv'
            : 'Toxizitäts-Warnung'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <th className="py-2 pr-3">Mikronährstoff</th>
              <th className="py-2 px-3">30-Tage Ø</th>
              <th className="py-2 px-3">EFSA Upper Limit</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 pl-3">Klinische Einschätzung</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <tr key={item.threshold.nutrientId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-2.5 pr-3 font-bold text-slate-900 dark:text-white">
                  {item.threshold.nameDe}
                </td>
                <td className="py-2.5 px-3 font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {item.average30DayValue} {item.threshold.unit}
                </td>
                <td className="py-2.5 px-3 text-slate-500 font-mono">
                  {item.threshold.efsaUpperLimit}
                </td>
                <td className="py-2.5 px-3">
                  {item.status === 'SAFE' && (
                    <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Sicher</span>
                    </span>
                  )}
                  {item.status === 'ELEVATED' && (
                    <span className="inline-flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Erhöht</span>
                    </span>
                  )}
                  {item.status === 'TOXIC_RISK' && (
                    <span className="inline-flex items-center space-x-1 text-rose-600 dark:text-rose-400 font-bold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Gefahr</span>
                    </span>
                  )}
                </td>
                <td className="py-2.5 pl-3 text-slate-600 dark:text-slate-400">
                  {item.noteDe}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
