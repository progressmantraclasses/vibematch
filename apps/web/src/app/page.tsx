'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  QrCode,
  Instagram,
  ArrowRight,
  Clock,
  Compass,
  MessageCircle,
  Lock,
  Zap,
  MessageSquareHeart,
  Unlock,
  Send,
} from 'lucide-react';
import { TiltCard } from '../components/tilt-card';
import { GoogleAuthButton } from '../components/google-auth-button';
import { Button } from '../components/ui/button';
import { AnimatedCounter } from '../components/animated-counter';
import { HoloCard } from '../components/fx/holo-card';
import { Reveal, Stagger, StaggerItem } from '../components/fx/reveal';
import { SectionHeading } from '../components/fx/section-heading';
import { MandalaRing } from '../components/fx/mandala-ring';
import { Marquee } from '../components/fx/marquee';
import { Medallion } from '../components/fx/medallion';
import { OrnamentDivider } from '../components/fx/ornament-divider';
import { AvatarOrb } from '../components/fx/avatar-orb';
import { ACCENT_SOLID, ACCENT_TEXT, type Accent } from '../components/fx/accent';
import { cn } from '../lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

const HEADLINE = [
  { text: 'Apne', shimmer: false },
  { text: 'Crush', shimmer: false },
  { text: 'Ki', shimmer: false },
  { text: 'Vibe', shimmer: true, br: true },
  { text: 'Match', shimmer: true },
  { text: 'Karo.', shimmer: false, br: true },
];

const MARQUEE_ITEMS = [
  'Late night deep talks? 🌙',
  'Chai ya coffee? ☕',
  'Road trip pe chaloge? 🚗',
  'Pehle dosti, phir pyaar? 💞',
  'Monsoon dates 🌧️',
  'Cheesy pickup lines 😏',
  'Soulmate vibes ✨',
  'Secret confession 💌',
];

const STATS: { accent: Accent; icon: React.ElementType; value: React.ReactNode; label: string }[] = [
  { accent: 'rose', icon: QrCode, value: '1-of-1', label: 'Single-Person QR Lock' },
  {
    accent: 'violet',
    icon: ShieldCheck,
    value: <AnimatedCounter value={256} suffix="-bit" />,
    label: 'Cryptographic Guard',
  },
  { accent: 'amber', icon: Compass, value: <AnimatedCounter value={8} suffix=" Vibe" />, label: 'Hinglish Prompts' },
  {
    accent: 'emerald',
    icon: MessageCircle,
    value: <AnimatedCounter value={100} suffix="%" />,
    label: 'Real-time Chat',
  },
];

const STEPS: { accent: Accent; icon: React.ElementType; title: string; body: string; foot: string }[] = [
  {
    accent: 'rose',
    icon: Sparkles,
    title: 'Create Your Secret Quiz',
    body: "Friend ka naam daalo ya open rakho. Apne True/False answers chuno, ek secret confession likho, aur Instagram unlock rule set karo.",
    foot: '8 Curated Hinglish Vibe Questions',
  },
  {
    accent: 'violet',
    icon: QrCode,
    title: 'Share 1-of-1 Secured QR',
    body: 'High-DPI QR poster download karo ya link bhejo. Code sirf EK insaan ke liye locked hai — koi aur replay ya scan nahi kar sakta.',
    foot: 'Single-Use Anti-Replay Guard',
  },
  {
    accent: 'amber',
    icon: Heart,
    title: 'Dual-Profile Match Reveal',
    body: 'Compatibility gauge spin hote dekho! Secret confessions unlock karo, live chat karo aur match dono profiles pe save karo.',
    foot: 'Automatic Dual-Profile Sync',
  },
];

function StepConnector() {
  return (
    <div className="md:hidden flex justify-center -my-1" aria-hidden>
      <div className="relative w-px h-12 bg-gradient-to-b from-roseNeon/60 via-electricViolet/50 to-warmAmber/50">
        <motion.span
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_12px_#ff3366]"
          animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

function FeatureCard({
  accent,
  icon: Icon,
  title,
  body,
  className,
}: {
  accent: Accent;
  icon: React.ElementType;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <HoloCard accent={accent} tilt className={cn('group p-6 h-full', className)}>
      <div className="flex flex-col items-center text-center gap-3 h-full justify-center">
        <Medallion accent={accent} className="w-12 h-12">
          <Icon className="w-5 h-5" />
        </Medallion>
        <h4 className="font-display text-base font-bold text-white">{title}</h4>
        <p className="text-xs sm:text-sm text-white/55 leading-relaxed">{body}</p>
      </div>
    </HoloCard>
  );
}

export default function HomePage() {
  const [activePreviewTab, setActivePreviewTab] = useState<'match' | 'secret'>('match');

  return (
    <main className="flex-1 flex flex-col items-center overflow-hidden">
      {/* ═════════════════ HERO ═════════════════ */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 md:pt-20 md:pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative inline-flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-roseNeon/30 bg-roseNeon/10 backdrop-blur-xl mb-7 shadow-[0_8px_30px_-8px_rgba(255,51,102,0.6)]"
        >
          <span className="grid place-items-center w-6 h-6 rounded-full bg-roseNeon/25">
            <Sparkles className="w-3.5 h-3.5 text-roseNeon animate-spin" style={{ animationDuration: '4s' }} />
          </span>
          <span className="text-[11px] sm:text-sm font-bold tracking-wide text-rose-200">
            For Besties, Known Crushes &amp; Dating Chemistry
          </span>
        </motion.div>

        <h1 className="font-display text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[5.5rem] font-black tracking-tight max-w-5xl text-white mb-7">
          {HEADLINE.map((w, i) => (
            <React.Fragment key={i}>
              {w.br && <br />}
              <motion.span
                initial={{ opacity: 0, y: 40, rotateX: -70, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease: EASE }}
                className={cn('inline-block mx-[0.14em] origin-bottom', w.shimmer && 'text-shimmer drop-shadow-[0_0_30px_rgba(255,51,102,0.45)]')}
              >
                {w.text}
              </motion.span>
            </React.Fragment>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          className="text-[15px] sm:text-xl text-white/65 max-w-2xl leading-relaxed mb-9 px-2"
        >
          Apne special friend ke liye ek{' '}
          <span className="text-white font-semibold underline decoration-roseNeon decoration-2 underline-offset-4">
            1-of-1 private QR
          </span>{' '}
          banao. Dono same True/False sawaal answer karo, secret confessions exchange karo aur real-time chat karo! 💌
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.75, ease: EASE }}
          className="w-full max-w-md flex flex-col items-center gap-4 mb-10"
        >
          <GoogleAuthButton text="Sign In with Google to Start" />
          <Link href="/create" className="text-sm font-semibold text-white/70 hover:text-white inline-flex items-center gap-1.5 group">
            Ya seedha QR banao
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* symmetric feature chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-2xl mb-14 md:mb-20"
        >
          {[
            { icon: ShieldCheck, label: 'Single-Scan Lock', c: 'text-emerald-300', b: 'border-emerald-500/25 bg-emerald-500/[0.07]' },
            { icon: Clock, label: 'Expiry Timers', c: 'text-amber-300', b: 'border-amber-500/25 bg-amber-500/[0.07]' },
            { icon: MessageCircle, label: 'Live Chat', c: 'text-rose-300', b: 'border-roseNeon/25 bg-roseNeon/[0.07]' },
          ].map(({ icon: Icon, label, c, b }) => (
            <div key={label} className={cn('flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-2xl border backdrop-blur-md', b)}>
              <Icon className={cn('w-4 h-4', c)} />
              <span className={cn('text-[10px] sm:text-xs font-bold', c)}>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── HERO STAGE: mirrored couple around mandala ── */}
        <div className="relative w-full max-w-5xl grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-6">
          {/* Left card */}
          <Reveal x={-40} y={0} className="order-2 lg:order-1">
            <HoloCard accent="emerald" tilt className="p-4 sm:p-5 text-left min-h-[196px] sm:min-h-[210px] flex flex-col justify-center" contentClassName="h-auto">
              <div className="flex items-center gap-3 mb-3">
                <AvatarOrb
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  accent="rose"
                  size="md"
                />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">Aarav</div>
                  <div className="text-[10px] text-white/50 font-mono">Creator</div>
                </div>
              </div>
              <div className="space-y-1.5">
                {['Deep talks', 'Road trips', 'Chai > Coffee'].map((t, i) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.12 }}
                    className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <span className="text-white/85 truncate">{t}</span>
                    <span className="text-emerald-300 font-bold">✓</span>
                  </motion.div>
                ))}
              </div>
            </HoloCard>
          </Reveal>

          {/* Center mandala + score */}
          <div className="order-1 lg:order-2 col-span-2 lg:col-span-1 relative mx-auto w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[400px] lg:h-[400px]">
            <MandalaRing className="absolute inset-0 w-full h-full" />

            {/* orbiting avatars (mirrored) */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              <motion.div
                className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full grid place-items-center text-xl sm:text-2xl bg-roseNeon/20 border border-roseNeon/50 backdrop-blur-md shadow-[0_0_24px_rgba(255,51,102,0.6)]">
                  😎
                </div>
              </motion.div>
              <motion.div
                className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full grid place-items-center text-xl sm:text-2xl bg-electricViolet/20 border border-electricViolet/50 backdrop-blur-md shadow-[0_0_24px_rgba(168,85,247,0.6)]">
                  🥰
                </div>
              </motion.div>
            </motion.div>

            {/* core */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.2 }}
              className="absolute inset-[27%] rounded-full grid place-items-center"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-roseNeon via-fuchsia-600 to-electricViolet shadow-[0_0_80px_-10px_rgba(255,51,102,0.9)]" />
              <div className="absolute inset-[3px] rounded-full bg-[radial-gradient(circle_at_30%_25%,#3a1257,#12061f_70%)]" />
              <div className="relative flex flex-col items-center">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-roseNeon fill-roseNeon heartbeat-glow mb-1" />
                <div className="font-display text-3xl sm:text-5xl font-black text-white leading-none">
                  <AnimatedCounter value={88} />
                  <span className="text-roseNeon text-xl sm:text-3xl">%</span>
                </div>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-white/55 mt-1.5 font-bold">Vibe Match</span>
              </div>
            </motion.div>
          </div>

          {/* Right card */}
          <Reveal x={40} y={0} className="order-3">
            <HoloCard accent="violet" tilt className="p-4 sm:p-5 text-left min-h-[196px] sm:min-h-[210px] flex flex-col justify-center" contentClassName="h-auto">
              <div className="flex items-center gap-3 mb-3">
                <AvatarOrb
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  accent="violet"
                  size="md"
                />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">Riya</div>
                  <div className="text-[10px] text-white/50 font-mono">Responder</div>
                </div>
              </div>
              <div className="rounded-xl p-2.5 bg-gradient-to-br from-electricViolet/20 to-roseNeon/10 border border-electricViolet/30">
                <div className="flex items-center gap-1 text-[10px] text-purple-200 font-bold mb-1">
                  <Unlock className="w-3 h-3" /> Secret unlocked
                </div>
                <p className="text-[11px] text-white/85 italic font-serif leading-snug line-clamp-3">
                  &quot;Tumhari playlist taste top tier hai btw ✨&quot;
                </p>
              </div>
            </HoloCard>
          </Reveal>
        </div>
      </section>

      {/* ═════════════════ MARQUEE ═════════════════ */}
      <section className="w-full py-6 border-y border-white/[0.07] bg-white/[0.015] backdrop-blur-sm space-y-3">
        <Marquee items={MARQUEE_ITEMS} className="text-sm sm:text-base font-display font-bold text-white/70" />
        <Marquee
          items={MARQUEE_ITEMS.slice().reverse()}
          reverse
          className="text-xs sm:text-sm font-semibold text-white/35"
        />
      </section>

      {/* ═════════════════ STATS ═════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <StaggerItem key={s.label}>
                <HoloCard accent={s.accent} tilt className="group p-5 sm:p-7 h-full">
                  <div className="flex flex-col items-center text-center gap-3">
                    <Medallion accent={s.accent}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Medallion>
                    <div className={cn('font-display text-2xl sm:text-4xl font-black', ACCENT_SOLID[s.accent])}>{s.value}</div>
                    <p className="text-[10px] sm:text-xs text-white/50 font-bold uppercase tracking-[0.18em]">{s.label}</p>
                  </div>
                </HoloCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* ═════════════════ HOW IT WORKS ═════════════════ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-28">
        <SectionHeading
          eyebrow={<><Zap className="w-3.5 h-3.5" /> Simple · Private · Exciting</>}
          title={<>How <span className="text-shimmer">DilSe</span> Works</>}
          subtitle="Un logon ke liye jinhe tum already jaante ho — crush, friend ya koi special."
          className="mb-14 md:mb-20"
        />

        <div className="relative">
          {/* desktop connector line */}
          <svg
            aria-hidden
            className="hidden md:block absolute left-[16%] right-[16%] top-[64px] w-[68%] h-4 overflow-visible"
            viewBox="0 0 100 4"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="step-line" gradientUnits="userSpaceOnUse" x1="0" y1="2" x2="100" y2="2">
                <stop offset="0" stopColor="#ff3366" />
                <stop offset="0.5" stopColor="#a855f7" />
                <stop offset="1" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
            <motion.line
              x1="0"
              y1="2"
              x2="100"
              y2="2"
              stroke="url(#step-line)"
              strokeWidth="2"
              strokeDasharray="1.5 1.5"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: EASE }}
            />
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 lg:gap-8">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <React.Fragment key={s.title}>
                  <Reveal delay={i * 0.15} className="h-full">
                    <div className={cn('h-full', i === 1 && 'md:-translate-y-6')}>
                    <HoloCard accent={s.accent} tilt active={i === 1} className="group p-7 md:p-8 h-full overflow-hidden">
                      <span
                        aria-hidden
                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-display text-[7rem] font-black leading-none text-white/[0.04] select-none pointer-events-none"
                      >
                        0{i + 1}
                      </span>
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-6">
                          <Medallion accent={s.accent} className="w-16 h-16 rounded-3xl">
                            <Icon className="w-7 h-7" />
                          </Medallion>
                          <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white text-velvetNight text-xs font-black grid place-items-center shadow-lg">
                            {i + 1}
                          </span>
                        </div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-3">{s.title}</h3>
                        <p className="text-sm text-white/60 leading-relaxed mb-5">{s.body}</p>
                        <div className={cn('inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10', ACCENT_TEXT[s.accent])}>
                          <Sparkles className="w-3.5 h-3.5" /> {s.foot}
                        </div>
                      </div>
                    </HoloCard>
                    </div>
                  </Reveal>
                  {i < STEPS.length - 1 && <StepConnector />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════════════════ BENTO FEATURES (2 | big | 2) ═════════════════ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-28">
        <SectionHeading
          eyebrow={<><Heart className="w-3.5 h-3.5" /> Built for real feelings</>}
          title="Har Feature, Dil Se"
          accent="violet"
          className="mb-12 md:mb-16"
        />

        <Stagger className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 sm:gap-5">
          <StaggerItem className="lg:col-start-1 lg:row-start-1">
            <FeatureCard accent="emerald" icon={Lock} title="Single-Scan Lock" body="Pehle scan pe device se lock. Koi forward kare toh bhi nahi khulega." />
          </StaggerItem>
          <StaggerItem className="lg:col-start-1 lg:row-start-2">
            <FeatureCard accent="amber" icon={Clock} title="Custom Expiry" body="15 min se 7 din tak — ya bilkul no-expiry." />
          </StaggerItem>

          {/* center big chat card */}
          <StaggerItem className="col-span-2 lg:col-start-2 lg:col-span-2 lg:row-span-2 order-first lg:order-none">
            <HoloCard accent="rose" tilt tiltMax={5} className="group p-6 sm:p-8 h-full">
              <div className="flex flex-col h-full">
                <div className="flex flex-col items-center text-center mb-6">
                  <Medallion accent="rose" className="mb-4">
                    <MessageCircle className="w-6 h-6" />
                  </Medallion>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white">Live Vibe Chat</h3>
                  <p className="text-sm text-white/55 mt-2 max-w-sm">Result ke baad seedha real-time chat. Typing dots, quick reactions — sab kuch.</p>
                </div>
                <div className="mt-auto space-y-2.5 rounded-2xl bg-black/20 border border-white/10 p-4">
                  {[
                    { me: false, t: '88% 😳 sach mein?', e: '🥰' },
                    { me: true, t: 'Coffee chalo? ☕', e: '😎' },
                    { me: false, t: 'Haan! Kal 5 baje? ✨', e: '🥰' },
                  ].map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12, scale: 0.9 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.35, type: 'spring', stiffness: 200, damping: 18 }}
                      className={cn('flex items-end gap-2', m.me ? 'justify-end' : 'justify-start')}
                    >
                      {!m.me && <span className="text-base">{m.e}</span>}
                      <span
                        className={cn(
                          'px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-medium max-w-[75%]',
                          m.me
                            ? 'bg-gradient-to-r from-roseNeon to-fuchsia-600 text-white rounded-br-md shadow-[0_8px_20px_-8px_rgba(255,51,102,0.8)]'
                            : 'bg-white/10 border border-white/10 text-white/90 rounded-bl-md',
                        )}
                      >
                        {m.t}
                      </span>
                      {m.me && <span className="text-base">{m.e}</span>}
                    </motion.div>
                  ))}
                  <div className="flex items-center gap-2 pt-2">
                    <div className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 px-3 flex items-center text-xs text-white/35">Message Riya…</div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-roseNeon to-electricViolet grid place-items-center">
                      <Send className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </HoloCard>
          </StaggerItem>

          <StaggerItem className="lg:col-start-4 lg:row-start-1">
            <FeatureCard accent="rose" icon={MessageSquareHeart} title="Secret Confessions" body="Dil ki baat — sirf match ke baad reveal." />
          </StaggerItem>
          <StaggerItem className="lg:col-start-4 lg:row-start-2">
            <FeatureCard accent="violet" icon={Instagram} title="Mutual Unlock" body="Insta / WhatsApp sirf consent ya high score pe." />
          </StaggerItem>
        </Stagger>
      </section>

      {/* ═════════════════ PREVIEW CARD ═════════════════ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-28">
        <SectionHeading
          eyebrow={<><Sparkles className="w-3.5 h-3.5" /> Sneak peek</>}
          title="Result Aisa Dikhega"
          accent="amber"
          className="mb-12"
        />
        <Reveal className="w-full max-w-xl mx-auto">
          <TiltCard className="w-full text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex -space-x-3">
                  <AvatarOrb
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    size="md"
                  />
                  <AvatarOrb
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                    accent="violet"
                    size="md"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2 flex-wrap">
                    Aarav + Riya
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-roseNeon/20 text-rose-300 font-bold border border-roseNeon/30">
                      Matched 💕
                    </span>
                  </span>
                  <span className="text-[11px] text-white/45 font-mono">VIBE-892X</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-2xl sm:text-3xl font-black text-roseNeon drop-shadow-[0_0_12px_rgba(255,51,102,0.6)]">88%</div>
                <span className="text-[9px] text-white/50 uppercase tracking-wider font-bold">Compatibility</span>
              </div>
            </div>

            <div className="relative grid grid-cols-2 gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 mb-5">
              {(['match', 'secret'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActivePreviewTab(tab)}
                  className={cn(
                    'relative py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer',
                    activePreviewTab === tab ? 'text-white' : 'text-white/55 hover:text-white',
                  )}
                >
                  {activePreviewTab === tab && (
                    <motion.span
                      layoutId="preview-tab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-roseNeon to-electricViolet shadow-[0_8px_20px_-8px_rgba(255,51,102,0.9)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{tab === 'match' ? 'Where Vibes Matched 💕' : 'Secret & IG 🔓'}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activePreviewTab === 'match' ? (
                <motion.div
                  key="match"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2.5"
                >
                  {[
                    'Late night deep conversations enjoy karte ho?',
                    'Pyaar mein pehle strong friendship zaroori hai?',
                    'Spontaneous surprises and small gestures?',
                  ].map((q, i) => (
                    <motion.div
                      key={q}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="p-3 sm:p-3.5 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/25 flex items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <span className="text-white/90 font-medium">{q}</span>
                      <span className="flex items-center gap-1 text-emerald-300 font-extrabold bg-emerald-500/15 px-2.5 py-1 rounded-xl border border-emerald-500/30 shrink-0 text-[11px]">
                        <Sparkles className="w-3 h-3" /> Match
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="secret"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-roseNeon/15 to-electricViolet/15 border border-roseNeon/30 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 text-rose-300 font-bold mb-1.5">
                      <Heart className="w-4 h-4 fill-roseNeon text-roseNeon" />
                      Riya&apos;s Secret Confession
                    </div>
                    <p className="text-white/95 italic font-serif leading-relaxed">
                      &quot;Honestly, I always wondered what our vibe would be like outside college! Your playlist taste is top tier btw ✨&quot;
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-pink-400" />
                      <span className="text-xs sm:text-sm font-bold text-white">@riya.vibe</span>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Mutual Unlocked 🔓
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TiltCard>
        </Reveal>
      </section>

      {/* ═════════════════ FINAL CTA (mirrored photos) ═════════════════ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <Reveal>
          <HoloCard accent="rose" glow corners className="p-8 sm:p-12 md:p-16 overflow-hidden">
            {/* rotating sunburst */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 animate-spin-slower opacity-40"
              style={{
                background:
                  'repeating-conic-gradient(from 0deg, rgba(255,51,102,0.12) 0deg 6deg, transparent 6deg 18deg)',
                maskImage: 'radial-gradient(circle, #000 0%, transparent 60%)',
                WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 60%)',
              }}
            />

            <div className="relative grid lg:grid-cols-[1fr_auto_1fr] items-center gap-8 lg:gap-10">
              <motion.img
                initial={{ opacity: 0, rotate: 0, x: -40 }}
                whileInView={{ opacity: 1, rotate: -6, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE }}
                whileHover={{ rotate: 0, scale: 1.04 }}
                src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80"
                alt="Romantic vibe"
                className="hidden lg:block justify-self-end rounded-3xl w-48 h-64 object-cover border border-white/20 shadow-2xl"
              />

              <div className="text-center max-w-xl mx-auto space-y-5">
                <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-roseNeon px-4 py-1.5 rounded-full bg-roseNeon/10 border border-roseNeon/25">
                  Real Romance &amp; Friendship
                </span>
                <h3 className="font-display text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                  Awkward DMs ko banao <span className="text-shimmer">Vibe Check</span>.
                </h3>
                <p className="text-white/65 text-sm sm:text-base leading-relaxed">
                  &quot;Kya woh bhi mujhe pasand karte hain?&quot; — ab sochna band. True/False cards, secret messages aur live chat se ice naturally todo.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/create" className="w-full sm:w-auto">
                    <Button size="xl" className="w-full gap-2">
                      <Sparkles className="w-5 h-5" />
                      Create Free QR Invite
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <motion.img
                initial={{ opacity: 0, rotate: 0, x: 40 }}
                whileInView={{ opacity: 1, rotate: 6, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE }}
                whileHover={{ rotate: 0, scale: 1.04 }}
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80"
                alt="Friends laughing"
                className="hidden lg:block justify-self-start rounded-3xl w-48 h-64 object-cover border border-white/20 shadow-2xl"
              />

              {/* mobile mirrored pair */}
              <div className="lg:hidden grid grid-cols-2 gap-3 max-w-xs mx-auto w-full">
                <img
                  src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=300&q=80"
                  alt="Romantic vibe"
                  className="rounded-2xl w-full h-40 object-cover border border-white/20 -rotate-3"
                />
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=300&q=80"
                  alt="Friends laughing"
                  className="rounded-2xl w-full h-40 object-cover border border-white/20 rotate-3"
                />
              </div>
            </div>
          </HoloCard>
        </Reveal>
      </section>

      {/* ═════════════════ FOOTER ═════════════════ */}
      <footer className="w-full border-t border-white/[0.07] py-12 px-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-roseNeon fill-roseNeon" />
            <span className="font-display font-bold text-white/80">DilSe VibeMatch</span>
          </div>
          <OrnamentDivider className="w-40" />
          <p className="text-xs text-white/40">© 2026 DilSe VibeMatch. Built with love for real connections.</p>
        </div>
      </footer>
    </main>
  );
}
