'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeartLoaderProps {
  label: string;
  sublabel?: string;
}

/** Full-area loader: pulsing heart inside counter-rotating conic rings */
export function HeartLoader({ label, sublabel }: HeartLoaderProps) {
  return (
    <div className="flex-1 min-h-[75vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative w-32 h-32 mb-8">
        {/* ping waves */}
        <span className="absolute inset-6 rounded-full bg-roseNeon/30 animate-ping-soft" />
        <span className="absolute inset-6 rounded-full bg-electricViolet/25 animate-ping-soft" style={{ animationDelay: '1.2s' }} />

        {/* conic ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, #ff3366 90deg, #a855f7 180deg, transparent 270deg)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-3 rounded-full border border-dashed border-white/15"
          animate={{ rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        />

        {/* heart core */}
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-roseNeon to-electricViolet grid place-items-center shadow-[0_0_40px_rgba(255,51,102,0.6)]">
          <Heart className="w-7 h-7 text-white fill-white heartbeat-glow" />
        </div>
      </div>

      <p className="font-display text-sm sm:text-base font-bold tracking-wide text-white/90">{label}</p>
      {sublabel && (
        <span className="text-[11px] sm:text-xs text-white/40 mt-2 font-mono uppercase tracking-[0.2em]">{sublabel}</span>
      )}
      <div className="flex gap-1.5 mt-5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-roseNeon"
            animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
    </div>
  );
}
