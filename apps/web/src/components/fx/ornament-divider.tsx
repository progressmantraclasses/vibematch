'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/** Mirrored ornament: ─ ◆ ─── ♥ ─── ◆ ─ ; draws itself in on view */
export function OrnamentDivider({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  const draw = {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true },
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <svg
      viewBox="0 0 240 24"
      className={cn('w-48 sm:w-60 h-6 mx-auto', className)}
      fill="none"
      aria-hidden
    >
      <defs>
        {/* userSpaceOnUse: bbox gradients don't render on zero-height lines */}
        <linearGradient id={`l-${id}`} gradientUnits="userSpaceOnUse" x1="4" y1="12" x2="96" y2="12">
          <stop offset="0" stopColor="#ff3366" stopOpacity="0" />
          <stop offset="1" stopColor="#ff3366" />
        </linearGradient>
        <linearGradient id={`r-${id}`} gradientUnits="userSpaceOnUse" x1="236" y1="12" x2="144" y2="12">
          <stop offset="0" stopColor="#a855f7" stopOpacity="0" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* left wing */}
      <motion.path d="M4 12 H96" stroke={`url(#l-${id})`} strokeWidth="1.5" strokeLinecap="round" {...draw} />
      <motion.path d="M30 12 l6 -5 l6 5 l-6 5 z" stroke="#ff3366" strokeOpacity="0.7" strokeWidth="1.2" {...draw} />
      {/* right wing (mirror) */}
      <motion.path d="M236 12 H144" stroke={`url(#r-${id})`} strokeWidth="1.5" strokeLinecap="round" {...draw} />
      <motion.path d="M210 12 l-6 -5 l-6 5 l6 5 z" stroke="#a855f7" strokeOpacity="0.7" strokeWidth="1.2" {...draw} />

      {/* center heart */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.4 }}
        style={{ transformOrigin: '120px 12px' }}
      >
        <path
          className="heartbeat-glow"
          style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
          d="M120 21 l-1.3-1.2C113.8 15.4 110.5 12.5 110.5 9 110.5 6.2 112.7 4 115.5 4c1.6 0 3.1.7 4.5 1.9C121.4 4.7 122.9 4 124.5 4 127.3 4 129.5 6.2 129.5 9c0 3.5-3.3 6.4-8.2 10.8L120 21z"
          fill="#ff3366"
        />
      </motion.g>
    </svg>
  );
}
