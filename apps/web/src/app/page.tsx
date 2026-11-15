'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  QrCode,
  Instagram,
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { TiltCard } from '../components/tilt-card';
import { GradientText } from '../components/gradient-text';
import { GoogleAuthButton } from '../components/google-auth-button';
import { Button } from '../components/ui/button';

export default function HomePage() {
  const [activePreviewTab, setActivePreviewTab] = useState<'match' | 'secret'>('match');

  return (
    <main className="flex-1 flex flex-col items-center justify-start overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 md:pt-20 md:pb-32 flex flex-col items-center text-center">
        {/* Floating Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-roseNeon/30 bg-roseNeon/10 backdrop-blur-xl mb-8 shadow-lg shadow-roseNeon/10"
        >
          <Sparkles className="w-4 h-4 text-roseNeon animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-xs md:text-sm font-semibold tracking-wide text-rose-300">
            For Besties, Known Crushes & Dating Chemistry ✨
          </span>
        </motion.div>

        {/* Big Romantic Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] max-w-4xl text-white mb-6"
        >
          Apne Crush Ki <br className="hidden sm:inline" />
          <GradientText variant="neon-glow">Vibe Match</GradientText> Karo.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-2xl text-white/70 max-w-2xl font-normal leading-relaxed mb-10"
        >
          Generate a <span className="text-white font-semibold underline decoration-roseNeon underline-offset-4">1-of-1 private QR code</span> for your special friend. Both answer the exact same True/False questions & exchange secret confessions! 💌
        </motion.p>

        {/* CTA Buttons & Google Login */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-md flex flex-col items-center gap-4 mb-14"
        >
          <GoogleAuthButton text="Sign In with Google to Start" />

          <div className="flex items-center gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              1-Person Single-Use Lock
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Custom Expiry Timers
            </span>
          </div>
        </motion.div>

        {/* INTERACTIVE 3D TILT PREVIEW CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-xl mx-auto"
        >
          <TiltCard className="w-full text-left">
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Aarav"
                    className="w-11 h-11 rounded-full object-cover border-2 border-roseNeon/60"
                  />
                  <span className="absolute -bottom-1 -right-1 text-xs">😎</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-white flex items-center gap-1.5">
                    Aarav + Riya
                    <span className="text-xs px-2 py-0.5 rounded-full bg-roseNeon/20 text-rose-300 font-semibold border border-roseNeon/30">
                      Matched
                    </span>
                  </span>
                  <span className="text-xs text-white/50">Generated via Secure QR VIBE-892X</span>
                </div>
              </div>

              {/* Score pill */}
              <div className="text-right">
                <div className="text-2xl font-black text-roseNeon drop-shadow-[0_0_10px_rgba(255,51,102,0.6)]">
                  88%
                </div>
                <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                  Compatibility
                </span>
              </div>
            </div>

            {/* Toggle Preview View */}
            <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10 mb-5">
              <button
                type="button"
                onClick={() => setActivePreviewTab('match')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activePreviewTab === 'match'
                    ? 'bg-roseNeon text-white shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Question Breakdown
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('secret')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activePreviewTab === 'secret'
                    ? 'bg-roseNeon text-white shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Secret Message & IG
              </button>
            </div>

            {/* Tab 1: Questions */}
            {activePreviewTab === 'match' ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-white/80 font-medium">
                    Late night deep conversations?
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Both said TRUE
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-white/80 font-medium">
                    Unplanned road trips together?
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Both said TRUE
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-white/80 font-medium">
                    Cheesy pickup lines cute hain?
                  </span>
                  <span className="flex items-center gap-1 text-rose-300 font-bold bg-roseNeon/10 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Both said TRUE
                  </span>
                </div>
              </div>
            ) : (
              /* Tab 2: Secret Note */
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-gradient-to-r from-roseNeon/15 to-electricViolet/15 border border-roseNeon/30 text-xs">
                  <div className="flex items-center gap-1.5 text-rose-300 font-bold mb-1">
                    <Heart className="w-3.5 h-3.5 fill-roseNeon text-roseNeon" />
                    Riya&apos;s Secret Confession
                  </div>
                  <p className="text-white/90 italic leading-relaxed">
                    &quot;Honestly, I always wondered what our vibe would be like outside college! Your playlist taste is top tier btw ✨&quot;
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-semibold text-white">@riya.vibe</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    Mutual Match Unlocked 🔓
                  </span>
                </div>
              </div>
            )}
          </TiltCard>
        </motion.div>
      </section>

      {/* HOW IT WORKS 3 STEPS */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-roseNeon">
            Simple, Private & Exciting
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            How DilSe VibeMatch Works
          </h2>
          <p className="text-white/60 text-base sm:text-lg mt-3">
            Designed specifically for people you already know — crush, friend, or special acquaintance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl hover:border-roseNeon/40 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-roseNeon/20 border border-roseNeon/30 flex items-center justify-center text-roseNeon font-black text-xl mb-6 shadow-lg shadow-roseNeon/20 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Create Your Secret Quiz</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Pre-fill your friend&apos;s name or keep it open. Pick your True/False answers, write a secret confession, and choose your Instagram unlock rule.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-rose-300 font-medium">
              <Compass className="w-3.5 h-3.5" /> 8 Curated Hinglish Vibe Questions
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl hover:border-electricViolet/40 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-electricViolet/20 border border-electricViolet/30 flex items-center justify-center text-electricViolet font-black text-xl mb-6 shadow-lg shadow-electricViolet/20 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Share 1-of-1 Secured QR</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Download the high-DPI QR poster or send the link. The code is cryptographically locked for exactly ONE person — nobody else can replay or scan it.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-purple-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Single-Use Anti-Replay Guard
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl hover:border-warmAmber/40 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-warmAmber/20 border border-warmAmber/30 flex items-center justify-center text-warmAmber font-black text-xl mb-6 shadow-lg shadow-warmAmber/20 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Dual-Profile Match Reveal</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Watch your compatibility gauge spin up! Unlock mutual secret confessions and exchange Instagram / WhatsApp directly into both of your permanent profiles.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
              <Heart className="w-3.5 h-3.5 fill-warmAmber" /> Automatic Dual-Profile Sync
            </div>
          </div>
        </div>
      </section>

      {/* VIBE PHOTO SHOWCASE GALLERY */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-roseNeon/10 via-electricViolet/10 to-transparent p-8 md:p-12 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-roseNeon">
              Real Romance & Friendship
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1 mb-4">
              Turn Awkward DMs into an Exciting Vibe Check.
            </h3>
            <p className="text-white/70 text-base leading-relaxed mb-6">
              No more wondering &quot;Do they like me back?&quot; — let the True/False cards and secret messages break the ice naturally.
            </p>
            <Link href="/create">
              <Button size="lg" variant="default" className="gap-2">
                <Sparkles className="w-5 h-5" />
                Create Free QR Invite Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <img
              src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80"
              alt="Romantic Vibe"
              className="rounded-2xl w-44 h-56 object-cover border border-white/20 shadow-xl"
            />
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80"
              alt="Friends Laughing"
              className="rounded-2xl w-44 h-56 object-cover border border-white/20 shadow-xl mt-6"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/10 py-10 text-center text-xs text-white/40">
        <p>© 2026 DilSe VibeMatch. Built with love for real connections.</p>
      </footer>
    </main>
  );
}
