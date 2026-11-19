'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Lock,
  Unlock,
  Instagram,
  Phone,
  CheckCircle2,
  Share2,
  PlusCircle,
  MessageSquareHeart,
  Check,
  Flame,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { CompatibilityGauge } from '../../../components/compatibility-gauge';
import { triggerRomanticConfetti } from '../../../components/confetti-trigger';
import { GoogleAuthButton } from '../../../components/google-auth-button';
import { Button } from '../../../components/ui/button';
import { VibeChat } from '../../../components/vibe-chat';
import { HoloCard } from '../../../components/fx/holo-card';
import { HeartLoader } from '../../../components/fx/heart-loader';
import { AvatarOrb } from '../../../components/fx/avatar-orb';
import { Medallion } from '../../../components/fx/medallion';
import { Reveal, Stagger, StaggerItem } from '../../../components/fx/reveal';
import { SectionHeading } from '../../../components/fx/section-heading';
import type { Accent } from '../../../components/fx/accent';
import { cn } from '../../../lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ───────── Contact block with lock → unlock morph ───────── */
function ContactBlock({
  unlocked,
  instagram,
  phone,
  unlockedLabel,
  lockedLabel,
}: {
  unlocked: boolean;
  instagram?: string;
  phone?: string;
  unlockedLabel: string;
  lockedLabel: string;
}) {
  if (!unlocked) {
    return (
      <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-white/[0.03] border border-dashed border-white/15 text-[11px] sm:text-xs text-white/45">
        <Lock className="w-4 h-4 text-white/40 shrink-0" />
        <span>{lockedLabel}</span>
      </div>
    );
  }
  return (
    <div className="space-y-2.5">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 260, damping: 14 }}
        className="flex items-center justify-center gap-2 text-[11px] text-emerald-300 font-bold uppercase tracking-[0.18em]"
      >
        <motion.span initial={{ rotate: -30 }} whileInView={{ rotate: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, type: 'spring' }}>
          <Unlock className="w-4 h-4" />
        </motion.span>
        {unlockedLabel}
      </motion.div>
      {!instagram && !phone && (
        <p className="text-center text-[11px] text-white/40 italic">No Instagram or WhatsApp added</p>
      )}
      {instagram && (
        <a
          href={`https://instagram.com/${instagram.replace('@', '')}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2.5 h-12 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/35 text-pink-200 text-xs sm:text-sm font-bold hover:brightness-125 transition-all"
        >
          <Instagram className="w-4 h-4" />
          {instagram}
        </a>
      )}
      {phone && (
        <a
          href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2.5 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-200 text-xs sm:text-sm font-bold hover:brightness-125 transition-all"
        >
          <Phone className="w-4 h-4" />
          WhatsApp: {phone}
        </a>
      )}
    </div>
  );
}

/* ───────── Profile card (mirrored pair) ───────── */
function ProfileCard({
  accent,
  person,
  role,
  roleBadge,
  about,
  children,
  fromSide,
}: {
  accent: Accent;
  person: any;
  role: string;
  roleBadge: string;
  about?: string;
  children: React.ReactNode;
  fromSide: 1 | -1;
}) {
  return (
    <Reveal x={fromSide * 40} y={0} className="h-full">
      <HoloCard accent={accent} tilt className="group p-6 sm:p-7 h-full" contentClassName="flex flex-col h-full">
        <div className="flex flex-col items-center text-center">
          <AvatarOrb src={person.avatarUrl} emoji={person.emoji || (accent === 'rose' ? '😎' : '💖')} alt={person.name} accent={accent} size="lg" />
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight mt-3">{person.name}</h4>
          <span
            className={cn(
              'inline-block mt-1.5 text-[10px] px-3 py-1 rounded-full font-bold border uppercase tracking-wider',
              accent === 'rose' ? 'bg-roseNeon/15 text-rose-200 border-roseNeon/30' : 'bg-electricViolet/15 text-purple-200 border-electricViolet/30',
            )}
          >
            {roleBadge}
          </span>
          <span className="sr-only">{role}</span>

          {person.tagline && (
            <p className="text-xs sm:text-sm italic font-serif text-white/80 mt-4 leading-relaxed">&ldquo;{person.tagline}&rdquo;</p>
          )}
          {about && <p className="text-xs sm:text-sm text-white/60 leading-relaxed mt-3">{about}</p>}
        </div>
        <div className="mt-auto pt-6">
          <div className="pt-5 border-t border-white/10">{children}</div>
        </div>
      </HoloCard>
    </Reveal>
  );
}

/* ───────── Confession flip card ───────── */
function ConfessionCard({ accent, from, message, delay }: { accent: Accent; from: string; message?: string; delay: number }) {
  const [flipped, setFlipped] = useState(false);
  const isRose = accent === 'rose';

  return (
    <motion.div
      className="relative h-56 sm:h-60 cursor-pointer perspective"
      onViewportEnter={() => setTimeout(() => setFlipped(true), delay)}
      viewport={{ once: true, amount: 0.6 }}
      onClick={() => setFlipped((f) => !f)}
      role="button"
      aria-label={`Confession from ${from}`}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {/* FRONT — sealed */}
        <div className="absolute inset-0 backface-hidden">
          <HoloCard accent={accent} className="h-full p-6" contentClassName="h-full flex flex-col items-center justify-center text-center gap-3">
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
              <Medallion accent={accent} className="w-14 h-14 sm:w-14 sm:h-14">
                <Mail className="w-6 h-6" />
              </Medallion>
            </motion.div>
            <span className="font-display text-sm font-bold text-white">Sealed note from {from}</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold">Tap to open</span>
          </HoloCard>
        </div>

        {/* BACK — revealed */}
        <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
          <HoloCard
            accent={accent}
            active
            className={cn('h-full p-6 sm:p-7 overflow-hidden', isRose ? '!bg-roseNeon/[0.08]' : '!bg-electricViolet/[0.08]')}
            contentClassName="h-full flex flex-col"
          >
            <span className="absolute -top-4 -right-1 font-serif text-[7rem] leading-none text-white/[0.06] select-none" aria-hidden>
              &rdquo;
            </span>
            <span className={cn('text-[10px] font-bold uppercase tracking-[0.25em] block mb-3', isRose ? 'text-rose-300' : 'text-purple-300')}>
              From {from}
            </span>
            {message ? (
              <p className="text-sm sm:text-base text-white/95 italic font-serif leading-relaxed overflow-y-auto no-scrollbar">
                &ldquo;{message}&rdquo;
              </p>
            ) : (
              <p className="text-xs text-white/40 italic">(No secret confession added by {from})</p>
            )}
            <Heart className={cn('w-5 h-5 mt-auto self-end', isRose ? 'text-roseNeon fill-roseNeon' : 'text-electricViolet fill-electricViolet')} />
          </HoloCard>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadMatch() {
      if (!matchId) return;
      try {
        const res = await api.get<any>(`/matches/${matchId}`);
        const data = res?.data || res;
        setMatch(data);
        if (data?.compatibilityPercent >= 70) {
          setTimeout(() => triggerRomanticConfetti(), 1400);
        }
      } catch (err) {
        console.error('Failed to load match:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMatch();
  }, [matchId]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (loading) {
    return <HeartLoader label="Calculating chemistry & unlocking results…" sublabel="1-of-1 Cryptographic Verification" />;
  }

  if (!match) {
    return (
      <div className="flex-1 min-h-[75vh] flex items-center justify-center px-4 py-12">
        <HoloCard accent="rose" active className="max-w-md w-full p-8 sm:p-10 text-center">
          <div className="flex justify-center mb-5">
            <Medallion accent="rose" className="w-16 h-16 sm:w-16 sm:h-16 rounded-3xl">
              <Heart className="w-7 h-7" />
            </Medallion>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">Match Not Found</h2>
          <p className="text-sm text-white/60 mb-7">This match link might be invalid or has expired. Create a new vibe quiz to get started!</p>
          <Link href="/">
            <Button size="lg" className="rounded-2xl">Back to Home</Button>
          </Link>
        </HoloCard>
      </div>
    );
  }

  const creator = match.creator || {};
  const responder = match.responder || {};
  const onlyMatches = match.questionComparisons?.filter((qc: any) => qc.isMatch) || [];

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex flex-col items-center gap-12 md:gap-16">
      {/* ── Mirrored couple header ── */}
      <div className="w-full flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-roseNeon/20 to-electricViolet/20 border border-roseNeon/40 text-rose-200 text-xs sm:text-sm font-bold shadow-[0_8px_30px_-8px_rgba(255,51,102,0.6)]"
        >
          <Sparkles className="w-4 h-4 text-roseNeon animate-spin" style={{ animationDuration: '4s' }} />
          Compatibility Revealed
        </motion.div>

        <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="flex flex-col items-center gap-2 min-w-0"
          >
            <AvatarOrb src={creator.avatarUrl} emoji={creator.emoji || '😎'} size="xl" />
            <span className="font-display text-base sm:text-2xl font-black text-white truncate max-w-full">{creator.name}</span>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 10, delay: 0.6 }}
            className="relative grid place-items-center"
          >
            <span className="absolute w-14 h-14 rounded-full bg-roseNeon/40 animate-ping-soft" />
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-roseNeon to-electricViolet grid place-items-center shadow-[0_0_40px_rgba(255,51,102,0.8)]">
              <Heart className="w-6 h-6 text-white fill-white heartbeat-glow" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="flex flex-col items-center gap-2 min-w-0"
          >
            <AvatarOrb src={responder.avatarUrl} emoji={responder.emoji || '💖'} size="xl" accent="violet" />
            <span className="font-display text-base sm:text-2xl font-black text-white truncate max-w-full">{responder.name}</span>
          </motion.div>
        </div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold"
        >
          {match.sameCount} of {match.totalQuestions} Questions Matched ✨
        </motion.span>
      </div>

      {/* ── Gauge ── */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', delay: 0.3 }}
        className="relative py-6"
      >
        <CompatibilityGauge score={match.compatibilityPercent} size={300} />
      </motion.div>

      {/* ── Sync CTA ── */}
      {!match.isSyncedToBothProfiles && (
        <Reveal className="w-full max-w-xl">
          <HoloCard accent="rose" active className="p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-4">
              <Medallion accent="rose">
                <Sparkles className="w-6 h-6" />
              </Medallion>
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-2">Save Match to Both Profiles!</h3>
            <p className="text-xs sm:text-sm text-white/65 mb-6 max-w-md mx-auto leading-relaxed">
              Sign in with Google so both of you can view this match connection anytime in your permanent Vibe Dashboard.
            </p>
            <GoogleAuthButton pendingMatchId={match.id} text="Save to Google Profile & Sync" />
          </HoloCard>
        </Reveal>
      )}

      {/* ── Mirrored profiles ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
        <ProfileCard accent="rose" person={creator} role="creator" roleBadge="Quiz Creator" about={creator.bio} fromSide={-1}>
          <ContactBlock
            unlocked={!!creator.contactUnlocked}
            instagram={creator.instagramHandle}
            phone={creator.phoneNumber}
            unlockedLabel="Contact Unlocked!"
            lockedLabel="Locked · mutual share or score threshold needed"
          />
        </ProfileCard>
        <ProfileCard
          accent="violet"
          person={responder}
          role="responder"
          roleBadge={responder.moodTag || '💫 Dreamy Vibe'}
          about={responder.aboutMe}
          fromSide={1}
        >
          <ContactBlock
            unlocked={!!responder.contactUnlocked}
            instagram={responder.instagramHandle}
            phone={responder.phoneNumber}
            unlockedLabel="Contact Shared!"
            lockedLabel="Contact not shared"
          />
        </ProfileCard>
      </div>

      {/* ── Confessions (flip reveal) ── */}
      <section className="w-full">
        <SectionHeading
          eyebrow={
            <>
              <MessageSquareHeart className="w-3.5 h-3.5" /> Unlocked 🔓
            </>
          }
          title="Secret Confessions"
          className="mb-8 sm:mb-10"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ConfessionCard accent="rose" from={creator.name} message={creator.secretMessage} delay={200} />
          <ConfessionCard accent="violet" from={responder.name} message={responder.secretMessage} delay={550} />
        </div>
      </section>

      {/* ── Live chat ── */}
      <Reveal className="w-full">
        <VibeChat
          matchId={match.id}
          creatorName={creator.name}
          creatorEmoji={creator.emoji}
          creatorAvatar={creator.avatarUrl}
          responderName={responder.name}
          responderEmoji={responder.emoji}
          responderAvatar={responder.avatarUrl}
          initialMessages={match.messages || []}
        />
      </Reveal>

      {/* ── Matched questions ── */}
      <section className="w-full">
        <SectionHeading
          eyebrow={
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> {onlyMatches.length} Synced
            </>
          }
          title="Where Your Vibes Matched"
          subtitle="Identical choices both of you shared secretly"
          accent="emerald"
          className="mb-8 sm:mb-10"
        />

        {onlyMatches.length === 0 ? (
          <HoloCard accent="amber" className="p-8 text-center">
            <div className="flex justify-center mb-3">
              <Medallion accent="amber">
                <Flame className="w-6 h-6" />
              </Medallion>
            </div>
            <p className="font-display font-bold text-white/85">Opposites Attract! ⚡</p>
            <p className="text-xs text-white/50 mt-1.5 max-w-sm mx-auto">
              You didn&apos;t share identical answers on these questions, but unique perspectives keep things exciting!
            </p>
          </HoloCard>
        ) : (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {onlyMatches.map((qc: any, idx: number) => (
              <StaggerItem key={qc.questionId || idx} className="h-full">
                <HoloCard accent="emerald" corners={false} className="group p-4 sm:p-5 h-full">
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 grid place-items-center font-display text-xs font-black text-emerald-300 group-hover:scale-110 transition-transform">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                    </div>
                    <p className="flex-1 text-sm sm:text-[15px] text-white/90 font-medium leading-relaxed">{qc.text}</p>
                    <span className="shrink-0 grid place-items-center w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 shadow-[0_0_16px_-2px_rgba(52,211,153,0.7)]">
                      <Check className="w-4 h-4 text-emerald-300" strokeWidth={3} />
                    </span>
                  </div>
                </HoloCard>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>

      {/* ── Actions — mirrored ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        <Button onClick={handleShare} variant="outline" size="lg" className="w-full gap-2 rounded-2xl">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? 'c' : 's'}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-roseNeon" /> Share Result
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </Button>
        <Link href="/create" className="w-full">
          <Button size="lg" className="w-full gap-2 rounded-2xl">
            <PlusCircle className="w-4 h-4" />
            Create Your Own Quiz
          </Button>
        </Link>
      </div>
    </div>
  );
}
