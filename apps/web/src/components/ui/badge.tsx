import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur-md select-none',
  {
    variants: {
      variant: {
        default: 'bg-roseNeon/15 text-rose-300 border-roseNeon/35',
        active: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_18px_-4px_rgba(52,211,153,0.6)]',
        claimed: 'border-amber-400/40 bg-amber-500/10 text-amber-300 shadow-[0_0_18px_-4px_rgba(251,191,36,0.6)]',
        completed: 'border-roseNeon/40 bg-roseNeon/10 text-rose-300 shadow-[0_0_18px_-4px_rgba(255,51,102,0.6)]',
        expired: 'border-white/10 bg-white/5 text-white/45',
        revoked: 'border-red-500/30 bg-red-500/10 text-red-400',
        secondary: 'border-transparent bg-white/10 text-white/80',
        outline: 'text-white border-white/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const DOT: Record<string, string> = {
  active: 'bg-emerald-400',
  claimed: 'bg-amber-400',
  completed: 'bg-roseNeon',
  revoked: 'bg-red-400',
  expired: 'bg-white/40',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  /** show a live pulsing status dot */
  dot?: boolean;
}

function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  const dotColor = DOT[variant || ''] || 'bg-roseNeon';
  const live = variant === 'active' || variant === 'claimed';
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="relative flex w-1.5 h-1.5">
          {live && <span className={cn('absolute inset-0 rounded-full animate-ping', dotColor)} />}
          <span className={cn('relative w-1.5 h-1.5 rounded-full', dotColor)} />
        </span>
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
