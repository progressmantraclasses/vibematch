'use client';

import { cn } from '../../lib/utils';
import type { Accent } from './accent';

const RING: Record<Accent, string> = {
  rose: 'conic-gradient(from var(--angle), #ff3366, #a855f7, #fbbf24, #ff3366)',
  violet: 'conic-gradient(from var(--angle), #a855f7, #38bdf8, #ff3366, #a855f7)',
  amber: 'conic-gradient(from var(--angle), #fbbf24, #ff3366, #a855f7, #fbbf24)',
  emerald: 'conic-gradient(from var(--angle), #34d399, #38bdf8, #a855f7, #34d399)',
};

const SIZE = {
  sm: 'w-9 h-9 text-base',
  md: 'w-12 h-12 text-xl',
  lg: 'w-16 h-16 text-3xl',
  xl: 'w-20 h-20 sm:w-24 sm:h-24 text-4xl sm:text-5xl',
};

interface AvatarOrbProps {
  src?: string | null;
  emoji?: string | null;
  alt?: string;
  accent?: Accent;
  size?: keyof typeof SIZE;
  className?: string;
  /** animate the gradient ring */
  spin?: boolean;
}

/** Avatar (image or emoji) wrapped in an animated conic gradient ring */
export function AvatarOrb({
  src,
  emoji,
  alt = '',
  accent = 'rose',
  size = 'md',
  className,
  spin = true,
}: AvatarOrbProps) {
  return (
    <div
      className={cn('relative shrink-0 rounded-full p-[2px]', SIZE[size], className)}
      style={{
        background: RING[accent],
        animation: spin ? 'border-spin 5s linear infinite' : undefined,
        boxShadow: '0 10px 30px -10px rgba(255,51,102,0.6)',
      }}
    >
      <div className="w-full h-full rounded-full bg-[#120820] overflow-hidden grid place-items-center">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span className="leading-none">{emoji || '💖'}</span>
        )}
      </div>
    </div>
  );
}
