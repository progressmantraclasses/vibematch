'use client';

import React from 'react';
import { HoloCard } from './fx/holo-card';
import { cn } from '../lib/utils';
import type { Accent } from './fx/accent';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  accent?: Accent;
}

/** Backwards-compatible wrapper — the HoloCard with tilt enabled */
export function TiltCard({ children, className, accent = 'rose' }: TiltCardProps) {
  return (
    <HoloCard tilt tiltMax={10} accent={accent} className={cn('p-6 sm:p-8', className)}>
      {children}
    </HoloCard>
  );
}
