import React from 'react';
import { cn } from '../lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'rose-violet' | 'amber-rose' | 'violet-cyan' | 'neon-glow';
}

export function GradientText({
  children,
  className,
  variant = 'rose-violet',
}: GradientTextProps) {
  const gradientStyles = {
    'rose-violet':
      'bg-gradient-to-r from-[#ff3366] via-[#d946ef] to-[#a855f7] bg-clip-text text-transparent',
    'amber-rose':
      'bg-gradient-to-r from-[#fbbf24] via-[#f43f5e] to-[#ff3366] bg-clip-text text-transparent',
    'violet-cyan':
      'bg-gradient-to-r from-[#a855f7] via-[#6366f1] to-[#38bdf8] bg-clip-text text-transparent',
    'neon-glow':
      'bg-gradient-to-r from-[#ff3366] to-[#a855f7] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,51,102,0.6)]',
  };

  return (
    <span className={cn('font-bold tracking-tight', gradientStyles[variant], className)}>
      {children}
    </span>
  );
}
