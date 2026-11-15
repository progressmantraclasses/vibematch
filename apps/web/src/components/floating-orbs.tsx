'use client';

import { motion } from 'framer-motion';

export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Deep velvet night base gradient */}
      <div className="absolute inset-0 bg-radial from-[#180928] via-[#0b0714] to-[#05030a]" />

      {/* Ambient grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Orb 1: Rose Neon */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-roseNeon/20 blur-[130px]"
      />

      {/* Orb 2: Electric Violet */}
      <motion.div
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 80, -50, 0],
          scale: [1, 0.85, 1.25, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-electricViolet/20 blur-[150px]"
      />

      {/* Orb 3: Warm Amber Sunset */}
      <motion.div
        animate={{
          x: [0, 60, -60, 0],
          y: [0, 70, -30, 0],
          scale: [0.9, 1.15, 0.95, 0.9],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-32 left-1/4 w-[32rem] h-[32rem] rounded-full bg-warmAmber/15 blur-[160px]"
      />

      {/* Center subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-roseNeon/5 rounded-full blur-[180px]" />
    </div>
  );
}
