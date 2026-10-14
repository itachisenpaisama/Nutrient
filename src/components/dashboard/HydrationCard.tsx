import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Droplets, Plus, Minus, Sparkles, AlertCircle } from 'lucide-react';
import { UserProfile } from '../../types';

interface HydrationCardProps {
  waterMl: number;
  waterGoalMl: number;
  onAddWater: (amountMl: number) => void;
  profile: UserProfile;
}

export const HydrationCard: React.FC<HydrationCardProps> = ({
  waterMl,
  waterGoalMl,
  onAddWater,
  profile
}) => {
  const goal = waterGoalMl || 3000;
  const current = waterMl || 0;
  const percentage = Math.min(150, Math.round((current / goal) * 100));

  const isStimulantUser =
    profile.medication === 'METHYLPHENIDATE' ||
    profile.medication === 'LISDEXAMFETAMINE' ||
    profile.medications?.some(
      (m) => m === 'METHYLPHENIDATE' || m === 'LISDEXAMFETAMINE'
    );

  return (
    <Card className="border-cyan-200/60 dark:border-cyan-900/50 bg-gradient-to-br from-cyan-50/40 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/20 shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                Hydration &amp; Flüssigkeit
              </CardTitle>
              {isStimulantUser && (
                <Badge variant="cyan" className="text-[10px] px-1.5 py-0 shrink-0">
                  Stimulanzien-Fokus
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Verhindert Mundtrockenheit, Kopfschmerz &amp; Dopamin-Erschöpfung
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-lg font-extrabold font-mono text-cyan-700 dark:text-cyan-300">
            {current.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 font-mono"> / {goal.toLocaleString()} ml</span>
          <div className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
            {percentage}% erreicht
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-2">
        {/* Progress Bar */}
        <Progress
          value={percentage}
          indicatorClassName={
            percentage >= 100
              ? 'bg-emerald-500'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500'
          }
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center space-x-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddWater(250)}
              className="h-8 px-2.5 text-xs text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-950"
            >
              <Plus className="w-3 h-3 mr-1" />
              250 ml (Glas)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddWater(500)}
              className="h-8 px-2.5 text-xs text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-950"
            >
              <Plus className="w-3 h-3 mr-1" />
              500 ml (Flasche)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddWater(1000)}
              className="h-8 px-2.5 text-xs text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-950 hidden sm:inline-flex"
            >
              <Plus className="w-3 h-3 mr-1" />
              1.000 ml
            </Button>
          </div>

          {current > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddWater(-250)}
              className="h-8 px-2 text-[11px] text-slate-400 hover:text-rose-500"
              title="250 ml abziehen"
            >
              <Minus className="w-3 h-3 mr-0.5" />
              250 ml
            </Button>
          )}
        </div>

        {/* Stimulant Alert / Advice */}
        {isStimulantUser && current < goal * 0.5 && (
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-200 flex items-start space-x-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <span>
              <strong>Klinischer Hinweis:</strong> ADHS-Stimulanzien unterdrücken das Durstempfinden bei gleichzeitig gesteigertem Grundumsatz. Ausreichend Wasser mit einer Prise Meersalz/Elektrolyten stabilisiert den Blutdruck und beugt dem Nachmittags-Rebound vor.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
