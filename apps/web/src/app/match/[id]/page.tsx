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
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { CompatibilityGauge } from '../../../components/compatibility-gauge';
import { triggerRomanticConfetti } from '../../../components/confetti-trigger';
import { GoogleAuthButton } from '../../../components/google-auth-button';
import { Button } from '../../../components/ui/button';
import { VibeChat } from '../../../components/vibe-chat';

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

        // Confetti celebration if high match
        if (data?.compatibilityPercent >= 70) {
          setTimeout(() => {
            triggerRomanticConfetti();
          }, 600);
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
      // Fallback
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[75vh] flex flex-col items-center justify-center px-4">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-6"
        >
          <div className="w-20 h-20 rounded-full border-4 border-roseNeon/20 border-t-roseNeon animate-spin" />
          <Heart className="w-8 h-8 text-roseNeon fill-roseNeon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_12px_rgba(255,51,102,0.8)]" />
        </motion.div>
        <p className="text-white/80 text-base font-semibold tracking-wide animate-pulse">
          Calculating Chemistry & Unlocking Vibe Results...
        </p>
        <span className="text-xs text-white/40 mt-1 font-mono">1-of-1 Cryptographic Verification</span>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex-1 min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-12">
        <div className="w-16 h-16 rounded-3xl bg-roseNeon/20 border border-roseNeon/30 flex items-center justify-center text-roseNeon mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Match Not Found</h2>
        <p className="text-sm text-white/60 mb-6 max-w-sm">
          This match link might be invalid or has expired. Create a new vibe quiz to get started!
        </p>
        <Link href="/">
          <Button variant="default" size="lg">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const creator = match.creator || {};
  const responder = match.responder || {};
  const isHighMatch = match.compatibilityPercent >= 70;
  const onlyMatches = match.questionComparisons?.filter((qc: any) => qc.isMatch) || [];

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex flex-col items-center space-y-10 md:space-y-12">
      {/* Top Tag & Couple Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-roseNeon/20 to-electricViolet/20 border border-roseNeon/40 text-rose-300 text-xs sm:text-sm font-bold shadow-lg shadow-roseNeon/15">
          <Sparkles className="w-4 h-4 text-roseNeon animate-spin" style={{ animationDuration: '4s' }} />
          Compatibility Revealed
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-white via-rose-100 to-white bg-clip-text text-transparent">
            {creator.name}
          </span>{' '}
          <span className="text-roseNeon font-serif italic font-normal">&amp;</span>{' '}
          <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
            {responder.name}
          </span>
        </h1>

        <div className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300 font-bold">
            {match.sameCount} of {match.totalQuestions} Questions Matched ✨
          </span>
        </div>
      </motion.div>

      {/* CIRCULAR COMPATIBILITY GAUGE */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="relative"
      >
        <CompatibilityGauge score={match.compatibilityPercent} size={290} />
      </motion.div>

      {/* GOOGLE PROFILE SYNC CTA (If not yet synced) */}
      {!match.isSyncedToBothProfiles && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl rounded-3xl border border-roseNeon/40 bg-gradient-to-r from-roseNeon/20 via-electricViolet/20 to-transparent p-6 sm:p-7 backdrop-blur-2xl text-center shadow-2xl shadow-roseNeon/15 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-roseNeon/20 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-roseNeon" />
            Save Match Permanently to Both Profiles!
          </h3>
          <p className="text-xs sm:text-sm text-white/75 mb-5 max-w-md mx-auto leading-relaxed">
            Sign in with Google so both of you can view this match connection anytime in your permanent Vibe Dashboard.
          </p>
          <div className="flex justify-center">
            <GoogleAuthButton
              pendingMatchId={match.id}
              text="Save to Google Profile & Sync"
            />
          </div>
        </motion.div>
      )}

      {/* SIDE-BY-SIDE PROFILE & BIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Creator Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl border border-white/15 bg-white/[0.04] p-6 sm:p-7 backdrop-blur-2xl shadow-2xl flex flex-col justify-between hover:border-roseNeon/40 transition-all group"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              {creator.avatarUrl ? (
                <img
                  src={creator.avatarUrl}
                  alt={creator.name}
                  className="w-16 h-16 rounded-3xl object-cover border-2 border-roseNeon shadow-lg shadow-roseNeon/20 group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-16 h-16 rounded-3xl bg-roseNeon/20 border border-roseNeon/40 flex items-center justify-center text-3xl shadow-lg shadow-roseNeon/20 group-hover:scale-105 transition-transform">
                  {creator.emoji || '😎'}
                </div>
              )}
              <div>
                <h4 className="text-xl font-extrabold text-white tracking-tight">{creator.name}</h4>
                <span className="inline-block mt-0.5 text-xs px-2.5 py-0.5 rounded-full bg-roseNeon/20 text-rose-300 font-semibold border border-roseNeon/30">
                  Quiz Creator
                </span>
              </div>
            </div>

            {creator.tagline && (
              <p className="text-xs sm:text-sm italic text-white/80 mb-3 bg-white/5 p-3 rounded-2xl border border-white/10 leading-relaxed">
                &quot;{creator.tagline}&quot;
              </p>
            )}

            {creator.bio && (
              <div className="text-xs sm:text-sm text-white/80 leading-relaxed bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                <span className="font-bold text-white">About:</span> {creator.bio}
              </div>
            )}
          </div>

          {/* Contact Reveal */}
          <div className="mt-6 pt-5 border-t border-white/10">
            {creator.contactUnlocked ? (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  <Unlock className="w-4 h-4" /> Contact Unlocked!
                </div>
                {creator.instagramHandle && (
                  <a
                    href={`https://instagram.com/${creator.instagramHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs sm:text-sm font-semibold hover:bg-pink-500/25 transition-all shadow-sm"
                  >
                    <Instagram className="w-4 h-4" />
                    {creator.instagramHandle}
                  </a>
                )}
                {creator.phoneNumber && (
                  <a
                    href={`https://wa.me/${creator.phoneNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold hover:bg-emerald-500/25 transition-all shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp: {creator.phoneNumber}
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/50">
                <Lock className="w-4 h-4 text-white/40 shrink-0" />
                <span>Contact locked (Mutual contact or score threshold required)</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Responder Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl border border-white/15 bg-white/[0.04] p-6 sm:p-7 backdrop-blur-2xl shadow-2xl flex flex-col justify-between hover:border-electricViolet/40 transition-all group"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              {responder.avatarUrl ? (
                <img
                  src={responder.avatarUrl}
                  alt={responder.name}
                  className="w-16 h-16 rounded-3xl object-cover border-2 border-electricViolet shadow-lg shadow-purple-600/20 group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-16 h-16 rounded-3xl bg-electricViolet/20 border border-electricViolet/40 flex items-center justify-center text-3xl shadow-lg shadow-purple-600/20 group-hover:scale-105 transition-transform">
                  {responder.emoji || '💖'}
                </div>
              )}
              <div>
                <h4 className="text-xl font-extrabold text-white tracking-tight">{responder.name}</h4>
                <span className="inline-block mt-0.5 text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                  {responder.moodTag || '💫 Dreamy Vibe'}
                </span>
              </div>
            </div>

            {responder.aboutMe && (
              <div className="text-xs sm:text-sm text-white/80 leading-relaxed mb-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                <span className="font-bold text-white">About:</span> {responder.aboutMe}
              </div>
            )}
          </div>

          {/* Contact Reveal */}
          <div className="mt-6 pt-5 border-t border-white/10">
            {responder.contactUnlocked ? (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  <Unlock className="w-4 h-4" /> Contact Shared!
                </div>
                {responder.instagramHandle && (
                  <a
                    href={`https://instagram.com/${responder.instagramHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs sm:text-sm font-semibold hover:bg-pink-500/25 transition-all shadow-sm"
                  >
                    <Instagram className="w-4 h-4" />
                    {responder.instagramHandle}
                  </a>
                )}
                {responder.phoneNumber && (
                  <a
                    href={`https://wa.me/${responder.phoneNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold hover:bg-emerald-500/25 transition-all shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp: {responder.phoneNumber}
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/50">
                <Lock className="w-4 h-4 text-white/40 shrink-0" />
                <span>Contact not shared</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* SECRET CONFESSIONS CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <MessageSquareHeart className="w-6 h-6 text-roseNeon" />
            Secret Confessions &amp; Notes
          </h3>
          <span className="text-xs text-rose-300/80 font-semibold px-3 py-1 rounded-full bg-roseNeon/10 border border-roseNeon/20">
            Unlocked 🔓
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Creator Secret Note */}
          <div className="rounded-3xl border border-roseNeon/30 bg-gradient-to-br from-roseNeon/15 via-purple-950/20 to-transparent p-6 sm:p-7 backdrop-blur-2xl shadow-xl relative overflow-hidden group hover:border-roseNeon/50 transition-all">
            <div className="absolute top-3 right-3 text-2xl opacity-40 group-hover:opacity-100 transition-opacity">
              💌
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300 block mb-2.5">
              From {creator.name}:
            </span>
            {creator.secretMessage ? (
              <p className="text-sm sm:text-base text-white/95 italic font-serif leading-relaxed">
                &quot;{creator.secretMessage}&quot;
              </p>
            ) : (
              <p className="text-xs text-white/40 italic">
                (No secret confession added by {creator.name})
              </p>
            )}
          </div>

          {/* Responder Secret Note */}
          <div className="rounded-3xl border border-electricViolet/30 bg-gradient-to-br from-electricViolet/15 via-pink-950/20 to-transparent p-6 sm:p-7 backdrop-blur-2xl shadow-xl relative overflow-hidden group hover:border-electricViolet/50 transition-all">
            <div className="absolute top-3 right-3 text-2xl opacity-40 group-hover:opacity-100 transition-opacity">
              💌
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block mb-2.5">
              From {responder.name}:
            </span>
            {responder.secretMessage ? (
              <p className="text-sm sm:text-base text-white/95 italic font-serif leading-relaxed">
                &quot;{responder.secretMessage}&quot;
              </p>
            ) : (
              <p className="text-xs text-white/40 italic">
                (No secret confession added by {responder.name})
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* REAL-TIME LIVE VIBE CHAT VIA WEBSOCKETS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="w-full"
      >
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
      </motion.div>

      {/* ONLY MATCHED QUESTIONS (NO TRUE/FALSE LABELS, ONLY MATCHES) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              Where Your Vibes Matched 💕
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              Identical choices both of you shared secretly
            </p>
          </div>

          <span className="self-start sm:self-center text-xs px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold shadow-sm shadow-emerald-500/10">
            {onlyMatches.length} Questions Synced ✨
          </span>
        </div>

        <div className="space-y-3">
          {onlyMatches.length === 0 ? (
            <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.03] text-center text-sm text-white/60 space-y-2">
              <Flame className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="font-semibold text-white/80">Opposites Attract! ⚡</p>
              <p className="text-xs text-white/50">
                You didn&apos;t share identical answers on these specific questions, but unique perspectives keep things exciting!
              </p>
            </div>
          ) : (
            onlyMatches.map((qc: any, idx: number) => (
              <motion.div
                key={qc.questionId || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * idx }}
                className="p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.08] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-emerald-500/55 hover:bg-emerald-500/[0.12] shadow-lg shadow-emerald-950/25 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-emerald-400/80 font-black block mb-0.5">
                      Match #{idx + 1}
                    </span>
                    <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                      {qc.text}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/25 text-emerald-300 font-black text-xs border border-emerald-500/40 shadow-sm shadow-emerald-500/30 flex items-center gap-1.5 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    Match! ✨
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* BOTTOM ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-6">
        <Button
          onClick={handleShare}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto gap-2 px-8 h-13 rounded-2xl"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              Copied Match Link!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-roseNeon" />
              Share Result Link
            </>
          )}
        </Button>

        <Link href="/create" className="w-full sm:w-auto">
          <Button variant="default" size="lg" className="w-full gap-2 px-8 h-13 rounded-2xl shadow-xl shadow-roseNeon/25">
            <PlusCircle className="w-4 h-4" />
            Create Your Own Vibe Quiz
          </Button>
        </Link>
      </div>
    </div>
  );
}
