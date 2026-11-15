import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-roseNeon disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-roseNeon to-electricViolet text-white shadow-lg shadow-roseNeon/25 hover:shadow-roseNeon/40 hover:brightness-110 active:scale-95',
        rose: 'bg-roseNeon text-white shadow-lg shadow-roseNeon/30 hover:bg-roseNeon/90 active:scale-95',
        violet: 'bg-electricViolet text-white shadow-lg shadow-electricViolet/30 hover:bg-electricViolet/90 active:scale-95',
        outline:
          'border border-white/20 bg-white/5 text-white backdrop-blur-md hover:bg-white/10 hover:border-white/30 active:scale-95',
        ghost:
          'text-white/80 hover:text-white hover:bg-white/10 active:scale-95',
        glass:
          'bg-white/10 backdrop-blur-xl border border-white/15 text-white shadow-xl hover:bg-white/15 hover:border-white/25 active:scale-95',
        amber:
          'bg-gradient-to-r from-warmAmber to-roseNeon text-slate-950 font-semibold shadow-lg shadow-warmAmber/20 hover:brightness-105 active:scale-95',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-13 rounded-2xl px-8 text-base font-semibold',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
