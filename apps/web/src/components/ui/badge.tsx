import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-roseNeon/20 text-roseNeon border border-roseNeon/30',
        active:
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-sm shadow-emerald-500/20',
        claimed:
          'border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-sm shadow-amber-500/20 animate-pulse',
        completed:
          'border-rose-500/30 bg-rose-500/10 text-rose-300 shadow-sm shadow-rose-500/20',
        expired:
          'border-white/10 bg-white/5 text-white/50',
        revoked:
          'border-red-500/30 bg-red-500/10 text-red-400',
        secondary:
          'border-transparent bg-white/10 text-white/80',
        outline:
          'text-white border-white/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
