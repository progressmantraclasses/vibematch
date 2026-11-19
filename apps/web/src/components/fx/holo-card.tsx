'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { Accent } from './accent';

export interface HoloCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  accent?: Accent;
  /** 3D tilt on pointer move (fine pointers only) */
  tilt?: boolean;
  /** max tilt in degrees */
  tiltMax?: number;
  /** stronger accent glow on hover */
  glow?: boolean;
  /** draw the 4 symmetric corner brackets */
  corners?: boolean;
  /** hover sheen sweep */
  sheen?: boolean;
  /** film grain overlay */
  grain?: boolean;
  /** force the "active" glowing state (e.g. selected) */
  active?: boolean;
  contentClassName?: string;
}

/**
 * The signature card of the design system:
 * rotating conic border, cursor spotlight, 3D tilt, sheen sweep,
 * symmetric corner brackets and film grain.
 */
export const HoloCard = React.forwardRef<HTMLDivElement, HoloCardProps>(function HoloCard(
  {
    children,
    accent = 'rose',
    tilt = false,
    tiltMax = 8,
    glow = true,
    corners = true,
    sheen = true,
    grain = true,
    active = false,
    className,
    contentClassName,
    style,
    onPointerMove,
    onPointerLeave,
    ...rest
  },
  forwardedRef,
) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [canTilt, setCanTilt] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 160, damping: 18, mass: 0.6 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [tiltMax, -tiltMax]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-tiltMax, tiltMax]);

  useEffect(() => {
    if (!tilt || typeof window === 'undefined') return;
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setCanTilt(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, [tilt]);

  const setRefs = (node: HTMLDivElement | null) => {
    innerRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = innerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
      if (canTilt) {
        px.set(x / rect.width - 0.5);
        py.set(y / rect.height - 0.5);
      }
    }
    onPointerMove?.(e);
  };

  const handleLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    px.set(0);
    py.set(0);
    onPointerLeave?.(e);
  };

  return (
    <motion.div
      ref={setRefs}
      data-glow={glow}
      data-active={active}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{
        ...(canTilt ? { rotateX, rotateY, transformPerspective: 1100 } : {}),
        ...style,
      }}
      className={cn('holo-card', `holo-accent-${accent}`, className)}
      {...rest}
    >
      {grain && <span aria-hidden className="grain" />}
      {sheen && <span aria-hidden className="holo-sheen" />}
      {corners && (
        <>
          <span aria-hidden className="holo-corner tl" />
          <span aria-hidden className="holo-corner tr" />
          <span aria-hidden className="holo-corner bl" />
          <span aria-hidden className="holo-corner br" />
        </>
      )}
      <div className={cn('relative z-[2] h-full', contentClassName)}>{children}</div>
    </motion.div>
  );
});
