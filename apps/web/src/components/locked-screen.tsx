'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, Clock, ArrowLeft, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { FloatingOrbs } from './floating-orbs';

interface LockedScreenProps {
  type: 'ALREADY_USED' | 'EXPIRED' | 'REVOKED' | 'NOT_FOUND';
  customMessage?: string;
}

export function LockedScreen({ type, customMessage }: LockedScreenProps) {
  const configs = {
    ALREADY_USED: {
      icon: Lock,
      iconColor: 'text-roseNeon',
      iconBg: 'bg-roseNeon/15 border-roseNeon/30',
      title: 'QR Invite Already Used',
      subtitle:
        customMessage ||
        'This 1-of-1 Private QR Invite was created for one specific person and has already been answered.',
    },
    EXPIRED: {
      icon: Clock,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-400/15 border-amber-400/30',
      title: 'Invite Expired',
      subtitle:
        customMessage ||
        'The timer on this private vibe check has run out. Ask your friend to generate a fresh QR!',
    },
    REVOKED: {
      icon: AlertCircle,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-400/15 border-red-400/30',
      title: 'Invite Cancelled',
      subtitle:
        customMessage ||
        'The creator cancelled this invite before it was completed.',
    },
    NOT_FOUND: {
      icon: AlertCircle,
      iconColor: 'text-slate-400',
      iconBg: 'bg-slate-400/15 border-slate-400/30',
      title: 'Invite Not Found',
      subtitle:
        customMessage ||
        'This invite code does not exist. Please check your link or QR code.',
    },
  };

  const current = configs[type] || configs.NOT_FOUND;
  const Icon = current.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <FloatingOrbs />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/[0.03] p-8 md:p-10 text-center shadow-2xl backdrop-blur-2xl"
      >
        <div
          className={`w-20 h-20 rounded-3xl ${current.iconBg} border flex items-center justify-center mx-auto mb-6 shadow-xl`}
        >
          <Icon className={`w-10 h-10 ${current.iconColor}`} />
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
          {current.title}
        </h2>

        <p className="text-sm md:text-base text-white/70 leading-relaxed mb-8">
          {current.subtitle}
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/create" className="w-full">
            <Button variant="default" className="w-full flex items-center justify-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Create Your Own Secret QR
            </Button>
          </Link>

          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to DilSe Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
