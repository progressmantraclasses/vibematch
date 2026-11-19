'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Infinity as InfinityIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface CountdownTimerProps {
  expiresAt: string | Date | null;
  onExpire?: () => void;
  className?: string;
}

/** Digit that drops in when it changes (keyed remount — no exit bookkeeping, never piles up) */
function RollingDigit({ value }: { value: string }) {
  return (
    <span className="relative inline-block w-[0.62em] h-[1.2em] overflow-hidden text-center align-bottom">
      <motion.span
        key={value}
        initial={{ y: '-90%', opacity: 0.2 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        {value}
      </motion.span>
    </span>
  );
}

export function CountdownTimer({ expiresAt, onExpire, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    if (!expiresAt) return;
    const target = new Date(expiresAt).getTime();

    const updateTimer = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        if (onExpire) onExpire();
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isExpired: false,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (!expiresAt) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/[0.05] border border-white/10 text-white/55',
          className,
        )}
      >
        <InfinityIcon className="w-3.5 h-3.5 text-electricViolet" />
        No Time Limit · 1-Use Lock
      </span>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/15 border border-red-500/30 text-red-400',
          className,
        )}
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        Expired
      </span>
    );
  }

  const pad = (n: number) => n.toString().padStart(2, '0');
  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 15;
  const parts = [
    ...(timeLeft.hours > 0 ? [pad(timeLeft.hours)] : []),
    pad(timeLeft.minutes),
    pad(timeLeft.seconds),
  ];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 pl-2.5 pr-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md border transition-colors',
        isUrgent
          ? 'bg-amber-500/15 border-amber-400/40 text-amber-200 shadow-[0_0_18px_-4px_rgba(251,191,36,0.7)]'
          : 'bg-white/[0.06] border-white/15 text-white/80',
        className,
      )}
    >
      <span className="relative flex">
        {isUrgent && <span className="absolute inset-0 rounded-full bg-amber-400/60 animate-ping" />}
        <Clock className={cn('relative w-3.5 h-3.5', isUrgent ? 'text-amber-300' : 'text-roseNeon')} />
      </span>
      <span className="opacity-70">Expires in</span>
      <span className="font-mono font-bold tabular-nums text-white flex items-center">
        {parts.map((p, i) => (
          <span key={i} className="flex items-center">
            {i > 0 && <span className="opacity-50 mx-px">:</span>}
            <RollingDigit value={p[0]} />
            <RollingDigit value={p[1]} />
          </span>
        ))}
      </span>
    </span>
  );
}
