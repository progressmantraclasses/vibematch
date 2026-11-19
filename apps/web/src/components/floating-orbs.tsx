'use client';

import { motion } from 'framer-motion';

/**
 * Global, perfectly mirrored ambient background:
 * velvet gradient → perspective grid → mirrored aurora orbs → twinkling
 * symmetric star pairs → rising hearts → film grain.
 */
export function FloatingOrbs() {
  // Stars are defined for the left half and mirrored to the right → symmetry
  const halfStars = [
    { top: 12, left: 8, delay: 0, duration: 4.5, size: 2 },
    { top: 28, left: 18, delay: 1.2, duration: 5.2, size: 3 },
    { top: 46, left: 6, delay: 2.2, duration: 6, size: 2.5 },
    { top: 64, left: 22, delay: 0.7, duration: 4.8, size: 2 },
    { top: 82, left: 12, delay: 1.8, duration: 5.5, size: 3 },
    { top: 8, left: 36, delay: 2.6, duration: 4.2, size: 2 },
  ];
  const stars = halfStars.flatMap((s) => [
    { ...s, left: `${s.left}%`, top: `${s.top}%` },
    { ...s, left: `${100 - s.left}%`, top: `${s.top}%`, delay: s.delay + 0.6 },
  ]);

  const hearts = [
    { left: '10%', delay: 0, duration: 16, scale: 0.7, opacity: 0.28 },
    { left: '90%', delay: 0, duration: 16, scale: 0.7, opacity: 0.28 },
    { left: '30%', delay: 6, duration: 19, scale: 0.55, opacity: 0.2 },
    { left: '70%', delay: 6, duration: 19, scale: 0.55, opacity: 0.2 },
  ];

  return (
    <div aria-hidden className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      {/* Deep velvet base */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#1d0b33_0%,#0b0714_45%,#05030a_100%)]" />

      {/* Perspective floor grid (symmetric vanishing point) */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55vh] opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,51,102,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          transform: 'perspective(600px) rotateX(62deg)',
          transformOrigin: 'bottom center',
          maskImage: 'linear-gradient(to top, #000 0%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to top, #000 0%, transparent 85%)',
        }}
      />

      {/* Fine dot mesh */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Center aurora beam */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[70rem] max-w-[160vw] h-[28rem] bg-[radial-gradient(50%_60%_at_50%_0%,rgba(255,51,102,0.22),rgba(168,85,247,0.1)_45%,transparent_75%)]" />

      {/* Mirrored orb pair: rose (left) ↔ violet (right) */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -left-24 w-[22rem] h-[22rem] md:w-[30rem] md:h-[30rem] rounded-full bg-roseNeon/25 blur-[90px] md:blur-[130px] will-change-transform"
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -right-24 w-[22rem] h-[22rem] md:w-[30rem] md:h-[30rem] rounded-full bg-electricViolet/25 blur-[90px] md:blur-[130px] will-change-transform"
      />

      {/* Mirrored lower pair: amber ↔ rose */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:block absolute -bottom-40 left-[5%] w-[28rem] h-[28rem] rounded-full bg-warmAmber/10 blur-[150px] will-change-transform"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, -40, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:block absolute -bottom-40 right-[5%] w-[28rem] h-[28rem] rounded-full bg-roseNeon/10 blur-[150px] will-change-transform"
      />

      {/* Center heartbeat glow */}
      <motion.div
        animate={{ opacity: [0.08, 0.18, 0.08], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] md:w-[42rem] md:h-[42rem] bg-roseNeon/10 rounded-full blur-[120px] md:blur-[190px]"
      />

      {/* Rising mirrored hearts */}
      {hearts.map((h, i) => (
        <motion.div
          key={`heart-${i}`}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, h.opacity, h.opacity, 0],
            rotate: [0, i % 2 === 0 ? 20 : -20, 0],
          }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', left: h.left, scale: h.scale }}
          className={`text-roseNeon/40 ${i > 1 ? 'hidden md:block' : ''}`}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-[0_0_8px_rgba(255,51,102,0.6)]">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}

      {/* Twinkling symmetric stars */}
      {stars.map((star, i) => (
        <motion.div
          key={`star-${i}`}
          animate={{ opacity: [0.15, 0.95, 0.15], scale: [0.8, 1.35, 0.8] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          className={`rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.95)] ${i > 7 ? 'hidden sm:block' : ''}`}
        />
      ))}

      {/* Film grain */}
      <div className="grain !opacity-[0.05]" />
    </div>
  );
}
