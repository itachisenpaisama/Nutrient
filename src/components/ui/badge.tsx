import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'success'
    | 'warning'
    | 'cyan'
    | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  ...props
}) => {
  const variantStyles = {
    default:
      'bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-100 dark:text-slate-900',
    secondary:
      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    destructive:
      'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-900',
    outline:
      'text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700',
    success:
      'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
    warning:
      'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    cyan:
      'bg-cyan-50 text-cyan-800 border border-cyan-200 dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-800',
    purple:
      'bg-purple-50 text-purple-800 border border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800'
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
};
