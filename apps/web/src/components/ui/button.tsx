import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'btn-shine inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-[box-shadow,background-color,border-color,color,filter] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-roseNeon focus-visible:ring-offset-2 focus-visible:ring-offset-velvetNight disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[linear-gradient(110deg,#ff3366,#d946ef_45%,#a855f7)] bg-[length:200%_100%] bg-left hover:bg-right text-white shadow-[0_10px_30px_-10px_rgba(255,51,102,0.8)] hover:shadow-[0_16px_40px_-10px_rgba(255,51,102,0.95)] ring-1 ring-inset ring-white/20 [transition:background-position_.6s_ease,box-shadow_.3s_ease]',
        rose: 'bg-roseNeon text-white shadow-[0_10px_30px_-10px_rgba(255,51,102,0.8)] hover:bg-[#ff4777] ring-1 ring-inset ring-white/20',
        violet:
          'bg-electricViolet text-white shadow-[0_10px_30px_-10px_rgba(168,85,247,0.8)] hover:bg-[#b46ef9] ring-1 ring-inset ring-white/20',
        outline:
          'border border-white/15 bg-white/[0.04] text-white backdrop-blur-md hover:bg-white/[0.09] hover:border-white/30',
        ghost: 'text-white/75 hover:text-white hover:bg-white/[0.07]',
        glass:
          'bg-white/10 backdrop-blur-xl border border-white/15 text-white shadow-xl hover:bg-white/15 hover:border-white/25',
        amber:
          'bg-gradient-to-r from-warmAmber to-roseNeon text-slate-950 font-bold shadow-[0_10px_30px_-10px_rgba(251,191,36,0.7)] hover:brightness-105',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-13 rounded-2xl px-8 text-base',
        xl: 'h-14 sm:h-16 rounded-2xl px-8 sm:px-10 text-base sm:text-lg font-bold',
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
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
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
