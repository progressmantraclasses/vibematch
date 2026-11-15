'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from './animated-counter';

interface CompatibilityGaugeProps {
  score: number;
  size?: number;
}

export function CompatibilityGauge({ score, size = 260 }: CompatibilityGaugeProps) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 80) return { primary: '#ff3366', secondary: '#a855f7', label: 'Soulmate Vibe ✨' };
    if (s >= 60) return { primary: '#a855f7', secondary: '#38bdf8', label: 'Super Compatible 💖' };
    if (s >= 40) return { primary: '#fbbf24', secondary: '#f97316', label: 'Sweet Chemistry 💫' };
    return { primary: '#94a3b8', secondary: '#64748b', label: 'Opposites Attract! ⚡' };
  };

  const scoreTheme = getScoreColor(score);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
        {/* Soft background glow */}
        <div
          className="absolute inset-8 rounded-full blur-2xl opacity-40 transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, ${scoreTheme.primary} 0%, ${scoreTheme.secondary} 100%)`,
          }}
        />

        <svg width={size} height={size} className="rotate-[-90deg]">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff3366" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated Value Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
            filter="url(#glow)"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
            className="flex items-baseline justify-center"
          >
            <AnimatedCounter
              value={score}
              className="font-extrabold text-5xl md:text-6xl text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,51,102,0.5)]"
            />
            <span className="text-2xl md:text-3xl font-bold text-roseNeon ml-1">%</span>
          </motion.div>
          <span className="text-xs uppercase tracking-widest text-white/60 mt-1 font-semibold">
            Vibe Match
          </span>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4 text-base font-medium px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/90 shadow-lg"
      >
        {scoreTheme.label}
      </motion.p>
    </div>
  );
}
