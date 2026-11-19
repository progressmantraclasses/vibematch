'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from './animated-counter';
import { MandalaRing } from './fx/mandala-ring';

interface CompatibilityGaugeProps {
  score: number;
  size?: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function CompatibilityGauge({ score, size = 260 }: CompatibilityGaugeProps) {
  const id = useId().replace(/:/g, '');
  const clamped = Math.max(0, Math.min(100, score));
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2 - 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const c = size / 2;
  const TICKS = 60;

  const theme = (() => {
    if (clamped >= 80) return { a: '#ff3366', b: '#a855f7', label: 'Soulmate Vibe ✨' };
    if (clamped >= 60) return { a: '#a855f7', b: '#38bdf8', label: 'Super Compatible 💖' };
    if (clamped >= 40) return { a: '#fbbf24', b: '#f97316', label: 'Sweet Chemistry 💫' };
    return { a: '#94a3b8', b: '#64748b', label: 'Opposites Attract! ⚡' };
  })();

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div style={{ width: size }} className="relative grid place-items-center aspect-square max-w-[78vw]">
        <MandalaRing className="absolute -inset-[18%] w-[136%] h-[136%]" intensity={0.75} />

        <div
          className="absolute inset-[18%] rounded-full blur-3xl opacity-50"
          style={{ background: `radial-gradient(circle, ${theme.a} 0%, ${theme.b} 70%, transparent 100%)` }}
        />

        <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 w-full h-full -rotate-90 overflow-visible">
          <defs>
            <linearGradient id={`g-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.a} />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor={theme.b} />
            </linearGradient>
            <filter id={`f-${id}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* tick ring */}
          {Array.from({ length: TICKS }).map((_, i) => {
            const a = (i / TICKS) * Math.PI * 2;
            const r1 = radius + strokeWidth / 2 + 6;
            const r2 = r1 + (i % 5 === 0 ? 10 : 5);
            const lit = i / TICKS <= clamped / 100;
            return (
              <motion.line
                key={i}
                x1={c + Math.cos(a) * r1}
                y1={c + Math.sin(a) * r1}
                x2={c + Math.cos(a) * r2}
                y2={c + Math.sin(a) * r2}
                stroke={lit ? theme.a : 'rgba(255,255,255,0.15)'}
                strokeWidth={i % 5 === 0 ? 2 : 1}
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + (i / TICKS) * 1.6 }}
              />
            );
          })}

          {/* track */}
          <circle cx={c} cy={c} r={radius} stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} fill="transparent" />
          <circle cx={c} cy={c} r={radius - strokeWidth} stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="3 6" fill="transparent" />

          {/* value arc */}
          <motion.circle
            cx={c}
            cy={c}
            r={radius}
            stroke={`url(#g-${id})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: EASE }}
            strokeLinecap="round"
            fill="transparent"
            filter={`url(#f-${id})`}
          />
        </svg>

        {/* orbiting spark that rides to the arc's end */}
        <motion.div
          className="absolute inset-0"
          initial={{ rotate: 0 }}
          animate={{ rotate: (clamped / 100) * 360 }}
          transition={{ duration: 2, ease: EASE }}
        >
          <span
            className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white"
            style={{
              top: `${((c - radius - 8) / size) * 100}%`,
              boxShadow: `0 0 16px 4px ${theme.a}, 0 0 40px 8px ${theme.b}`,
            }}
          />
        </motion.div>

        {/* center */}
        <div className="relative flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
            className="flex items-baseline justify-center"
          >
            <AnimatedCounter
              value={clamped}
              className="font-display font-black text-5xl md:text-6xl text-white tracking-tight drop-shadow-[0_0_24px_rgba(255,51,102,0.55)]"
            />
            <span className="font-display text-2xl md:text-3xl font-bold ml-1" style={{ color: theme.a }}>
              %
            </span>
          </motion.div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/55 mt-2 font-bold">Vibe Match</span>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.6, type: 'spring', stiffness: 200, damping: 14 }}
        className="relative mt-6 font-display text-sm sm:text-base font-bold px-5 py-2 rounded-full border text-white shadow-lg backdrop-blur-md"
        style={{
          borderColor: `${theme.a}66`,
          background: `linear-gradient(110deg, ${theme.a}33, ${theme.b}26)`,
          boxShadow: `0 10px 30px -10px ${theme.a}`,
        }}
      >
        {theme.label}
      </motion.p>
    </div>
  );
}
