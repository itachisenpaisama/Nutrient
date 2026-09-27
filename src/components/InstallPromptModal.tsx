import React from 'react';
import { X, Share, PlusSquare, Smartphone, CheckCircle } from 'lucide-react';
import { Language } from '../i18n/translations';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const InstallPromptModal: React.FC<InstallPromptModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Header with App Icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <img
              src="./apple-touch-icon.png"
              alt="NutriNeuro Icon"
              className="w-14 h-14 rounded-2xl shadow-md border border-cyan-500/30 object-cover"
            />
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                NutriNeuro installieren
              </h3>
              <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                Als native App auf deinem iPhone / Handy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
          <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Vorteile auf dem Home-Bildschirm:</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Startet blitzschnell im Vollbildmodus ohne störende Browserleisten, speichert deine Profile offline und ist jederzeit mit einem Fingertipp erreichbar.
          </p>
        </div>

        {/* iOS Step by Step */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Anleitung für iPhone (Safari):
          </h4>

          <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
            <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 shrink-0">
                <Share className="w-4 h-4" />
              </div>
              <div className="leading-relaxed">
                <span className="font-bold">1. Schritt:</span> Tippe unten in der Safari-Leiste auf das <span className="font-semibold text-cyan-600 dark:text-cyan-400">Teilen-Symbol</span> (Viereck mit Pfeil nach oben).
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                <PlusSquare className="w-4 h-4" />
              </div>
              <div className="leading-relaxed">
                <span className="font-bold">2. Schritt:</span> Scrolle in der Liste nach unten und wähle <span className="font-semibold text-emerald-600 dark:text-emerald-400">"Zum Home-Bildschirm"</span> (Add to Home Screen).
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="leading-relaxed">
                <span className="font-bold">3. Schritt:</span> Tippe oben rechts auf <span className="font-semibold text-indigo-600 dark:text-indigo-400">"Hinzufügen"</span>.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer transition shadow-md shadow-cyan-600/20"
          >
            Verstanden &amp; Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
