'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface MarqueeProps {
  items: React.ReactNode[];
  className?: string;
  reverse?: boolean;
}

/** Infinite, edge-faded horizontal ticker */
export function Marquee({ items, className, reverse = false }: MarqueeProps) {
  const row = (
    <div className="flex shrink-0 items-center gap-4 sm:gap-6 pr-4 sm:pr-6">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span className="whitespace-nowrap">{item}</span>
          <span className="text-roseNeon/70 text-xs">✦</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{
        maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
      }}
    >
      <div
        className="flex w-max animate-marquee hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {row}
        {row}
      </div>
    </div>
  );
}
