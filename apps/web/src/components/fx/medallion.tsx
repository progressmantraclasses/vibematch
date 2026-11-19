'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { ACCENT_RGB, type Accent } from './accent';

interface MedallionProps {
  accent?: Accent;
  className?: string;
  children: React.ReactNode;
}

/** Glossy glowing icon tile used at the top of feature / stat cards */
export function Medallion({ accent = 'rose', className, children }: MedallionProps) {
  return (
    <div
      className={cn(
        'medallion w-12 h-12 sm:w-14 sm:h-14 text-white transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6',
        className,
      )}
      style={{ ['--accent' as string]: ACCENT_RGB[accent] }}
    >
      {children}
    </div>
  );
}
