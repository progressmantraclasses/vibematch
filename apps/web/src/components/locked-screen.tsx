'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, Clock, ArrowLeft, PlusCircle, Ban } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { HoloCard } from './fx/holo-card';
import { MandalaRing } from './fx/mandala-ring';
import { Medallion } from './fx/medallion';
import { OrnamentDivider } from './fx/ornament-divider';
import type { Accent } from './fx/accent';

interface LockedScreenProps {
  type: 'ALREADY_USED' | 'EXPIRED' | 'REVOKED' | 'NOT_FOUND';
  customMessage?: string;
}

export function LockedScreen({ type, customMessage }: LockedScreenProps) {
  const configs: Record<LockedScreenProps['type'], { icon: React.ElementType; accent: Accent; title: string; subtitle: string }> = {
    ALREADY_USED: {
      icon: Lock,
      accent: 'rose',
      title: 'QR Invite Already Used',
      subtitle:
        customMessage ||
        'This 1-of-1 Private QR Invite was created for one specific person and has already been answered.',
    },
    EXPIRED: {
      icon: Clock,
      accent: 'amber',
      title: 'Invite Expired',
      subtitle:
        customMessage || 'The timer on this private vibe check has run out. Ask your friend to generate a fresh QR!',
    },
    REVOKED: {
      icon: Ban,
      accent: 'rose',
      title: 'Invite Cancelled',
      subtitle: customMessage || 'The creator cancelled this invite before it was completed.',
    },
    NOT_FOUND: {
      icon: AlertCircle,
      accent: 'violet',
      title: 'Invite Not Found',
      subtitle: customMessage || 'This invite code does not exist. Please check your link or QR code.',
    },
  };

  const current = configs[type] || configs.NOT_FOUND;
  const Icon = current.icon;

  return (
    <div className="flex-1 min-h-[80vh] flex items-center justify-center p-4 sm:p-6 relative">
      <MandalaRing className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] max-w-[130vw] opacity-60" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-md w-full"
      >
        <HoloCard accent={current.accent} active tilt className="p-8 md:p-10 text-center">
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <motion.div animate={{ rotate: [0, -8, 8, -4, 0] }} transition={{ delay: 0.8, duration: 0.6 }}>
              <Medallion accent={current.accent} className="w-20 h-20 sm:w-20 sm:h-20 rounded-3xl">
                <Icon className="w-9 h-9" />
              </Medallion>
            </motion.div>
          </motion.div>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
            {current.title}
          </h2>
          <OrnamentDivider className="mb-4" />
          <p className="text-sm md:text-base text-white/65 leading-relaxed mb-8">{current.subtitle}</p>

          <div className="grid gap-3">
            <Link href="/create" className="w-full">
              <Button className="w-full gap-2 h-12 rounded-2xl">
                <PlusCircle className="w-4 h-4" />
                Create Your Own Secret QR
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full gap-2 h-12 rounded-2xl">
                <ArrowLeft className="w-4 h-4" />
                Back to DilSe Home
              </Button>
            </Link>
          </div>
        </HoloCard>
      </motion.div>
    </div>
  );
}
