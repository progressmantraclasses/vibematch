'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  once?: boolean;
}

/** Fade + rise + de-blur when scrolled into view */
export function Reveal({ children, className, delay = 0, y = 28, x = 0, scale = 1, once = true }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, scale, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: (stagger: number = 0.08) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.05 },
  }),
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.97, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transitionEnd: { filter: 'none' },
    transition: { duration: 0.7, ease: EASE },
  },
};

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  /** animate on mount instead of on scroll */
  immediate?: boolean;
}

export function Stagger({ children, className, stagger = 0.08, immediate = false }: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      custom={stagger}
      initial="hidden"
      {...(immediate
        ? { animate: 'show' }
        : { whileInView: 'show', viewport: { once: true, margin: '-60px' } })}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
