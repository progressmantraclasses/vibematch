'use client';

import { motion } from 'framer-motion';

export function FloatingOrbs() {
  const stars = [
    { top: '12%', left: '8%', delay: 0, duration: 4.5, size: 2 },
    { top: '22%', left: '88%', delay: 1, duration: 5.2, size: 3 },
    { top: '42%', left: '16%', delay: 2.2, duration: 6, size: 2.5 },
    { top: '60%', left: '82%', delay: 0.7, duration: 4.8, size: 2.5 },
    { top: '78%', left: '26%', delay: 1.8, duration: 5.5, size: 3 },
    { top: '8%', left: '55%', delay: 2.6, duration: 4.2, size: 2 },
    { top: '88%', left: '72%', delay: 3.1, duration: 5.1, size: 2 },
    { top: '35%', left: '92%', delay: 1.4, duration: 4.9, size: 2.5 },
    { top: '50%', left: '5%', delay: 2.8, duration: 6.2, size: 2 },
  ];

  const floatingHearts = [
    { left: '15%', delay: 0, duration: 14, scale: 0.7, opacity: 0.25 },
    { left: '40%', delay: 4, duration: 18, scale: 0.9, opacity: 0.2 },
    { left: '68%', delay: 2, duration: 16, scale: 0.6, opacity: 0.3 },
    { left: '85%', delay: 7, duration: 20, scale: 0.8, opacity: 0.22 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      {/* Deep velvet night base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#10061e] via-[#080410] to-[#040208]" />

      {/* Subtle fine mesh grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.5) 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Atmospheric Aurora Light Shimmer */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-roseNeon/[0.07] via-electricViolet/[0.04] to-transparent blur-3xl pointer-events-none" />

      {/* Orb 1: Rose Neon */}
      <motion.div
        animate={{
          x: [0, 80, -50, 0],
          y: [0, -60, 45, 0],
          scale: [1, 1.2, 0.92, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-roseNeon/20 blur-[130px]"
      />

      {/* Orb 2: Electric Violet */}
      <motion.div
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 80, -50, 0],
          scale: [1, 0.88, 1.2, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 -right-32 w-[30rem] h-[30rem] rounded-full bg-electricViolet/20 blur-[150px]"
      />

      {/* Orb 3: Warm Amber Glow */}
      <motion.div
        animate={{
          x: [0, 60, -60, 0],
          y: [0, 70, -35, 0],
          scale: [0.95, 1.15, 0.95, 0.95],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-32 left-1/4 w-[32rem] h-[32rem] rounded-full bg-warmAmber/15 blur-[160px]"
      />

      {/* Orb 4: Center ambient heart pulse */}
      <motion.div
        animate={{
          opacity: [0.08, 0.18, 0.08],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] bg-roseNeon/10 rounded-full blur-[190px]"
      />

      {/* Rising Floating Ambient Hearts (Slow Motion Graphics) */}
      {floatingHearts.map((h, i) => (
        <motion.div
          key={`heart-${i}`}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, h.opacity, h.opacity, 0],
            rotate: [0, i % 2 === 0 ? 25 : -25, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: h.left,
            transform: `scale(${h.scale})`,
          }}
          className="text-roseNeon/30"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="filter drop-shadow-[0_0_8px_rgba(255,51,102,0.6)]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}

      {/* Floating Sparkles / Twinkling Stars */}
      {stars.map((star, i) => (
        <motion.div
          key={`star-${i}`}
          animate={{
            opacity: [0.15, 0.95, 0.15],
            scale: [0.8, 1.35, 0.8],
            y: [0, -10, 0],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          className="rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.95)]"
        />
      ))}
    </div>
  );
}
