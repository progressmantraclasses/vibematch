'use client';

import { useId } from 'react';
import { cn } from '../../lib/utils';

interface MandalaRingProps {
  className?: string;
  /** overall opacity multiplier */
  intensity?: number;
}

/**
 * Concentric, perfectly symmetric mandala made of dashed rings, petals and
 * orbiting dots. Layers counter-rotate slowly (pure CSS, GPU friendly).
 */
export function MandalaRing({ className, intensity = 1 }: MandalaRingProps) {
  const id = useId().replace(/:/g, '');
  const petals = Array.from({ length: 12 });
  const dots = Array.from({ length: 24 });
  const spokes = Array.from({ length: 8 });

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none select-none relative aspect-square', className)}
      style={{ opacity: intensity }}
    >
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id={`mg-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff3366" />
            <stop offset="0.5" stopColor="#d946ef" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
          <radialGradient id={`mc-${id}`}>
            <stop offset="0" stopColor="#ff3366" stopOpacity="0.25" />
            <stop offset="1" stopColor="#ff3366" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="120" fill={`url(#mc-${id})`} />
      </svg>

      {/* Outer ring: dashed + orbiting dots — rotates clockwise */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full animate-spin-slower">
        <circle cx="200" cy="200" r="192" fill="none" stroke={`url(#mg-${id})`} strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 8" />
        {dots.map((_, i) => {
          const a = (i / dots.length) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={200 + Math.cos(a) * 176}
              cy={200 + Math.sin(a) * 176}
              r={i % 3 === 0 ? 2.4 : 1.2}
              fill={i % 2 === 0 ? '#ff3366' : '#a855f7'}
              fillOpacity={i % 3 === 0 ? 0.9 : 0.5}
            />
          );
        })}
      </svg>

      {/* Middle ring: petals — rotates counter-clockwise */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full animate-spin-reverse">
        <circle cx="200" cy="200" r="150" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
        {petals.map((_, i) => (
          <ellipse
            key={i}
            cx="200"
            cy="78"
            rx="16"
            ry="44"
            fill="none"
            stroke={`url(#mg-${id})`}
            strokeOpacity="0.28"
            strokeWidth="1"
            transform={`rotate(${(i * 360) / petals.length} 200 200)`}
          />
        ))}
      </svg>

      {/* Inner ring: spokes & dashed circle — rotates clockwise */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full animate-spin-slow">
        <circle cx="200" cy="200" r="104" fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="14 10" />
        {spokes.map((_, i) => (
          <g key={i} transform={`rotate(${i * 45} 200 200)`}>
            <line x1="200" y1="96" x2="200" y2="120" stroke="#ff3366" strokeOpacity="0.4" strokeWidth="1" />
            <path d="M200 88 l4 4 l-4 4 l-4 -4 z" fill="#a855f7" fillOpacity="0.6" />
          </g>
        ))}
      </svg>
    </div>
  );
}
