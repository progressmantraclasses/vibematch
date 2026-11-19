'use client';

import React from 'react';
import { Reveal } from './reveal';
import { OrnamentDivider } from './ornament-divider';
import { ACCENT_PILL, type Accent } from './accent';
import { cn } from '../../lib/utils';

interface SectionHeadingProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  accent?: Accent;
  className?: string;
  ornament?: boolean;
}

/** Centered, symmetric section header: eyebrow pill → display title → ornament → subtitle */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  accent = 'rose',
  className,
  ornament = true,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn('text-center max-w-3xl mx-auto flex flex-col items-center gap-4', className)}>
      {eyebrow && (
        <span
          className={cn(
            'inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full border backdrop-blur-md',
            ACCENT_PILL[accent],
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-[1.75rem] leading-[1.15] sm:text-5xl font-extrabold tracking-tight text-white">
        {title}
      </h2>
      {ornament && <OrnamentDivider />}
      {subtitle && <p className="text-white/60 text-sm sm:text-lg leading-relaxed max-w-2xl">{subtitle}</p>}
    </Reveal>
  );
}
