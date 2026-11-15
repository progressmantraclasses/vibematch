'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface CountdownTimerProps {
  expiresAt: string | Date | null;
  onExpire?: () => void;
  className?: string;
}

export function CountdownTimer({
  expiresAt,
  onExpire,
  className,
}: CountdownTimerProps) {
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
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        if (onExpire) onExpire();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isExpired: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (!expiresAt) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs text-white/50', className)}>
        <Clock className="w-3.5 h-3.5 text-white/40" />
        No Time Limit (1-Use Lock)
      </span>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-400',
          className,
        )}
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        Expired
      </span>
    );
  }

  const formatNum = (n: number) => n.toString().padStart(2, '0');

  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 15;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md transition-colors',
        isUrgent
          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse'
          : 'bg-white/10 border border-white/20 text-white/80',
        className,
      )}
    >
      <Clock className={cn('w-3.5 h-3.5', isUrgent ? 'text-amber-300' : 'text-roseNeon')} />
      <span>
        Expires in{' '}
        <span className="font-mono font-semibold">
          {timeLeft.hours > 0 ? `${formatNum(timeLeft.hours)}:` : ''}
          {formatNum(timeLeft.minutes)}:{formatNum(timeLeft.seconds)}
        </span>
      </span>
    </span>
  );
}
