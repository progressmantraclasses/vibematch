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
  XCircle,
  Share2,
  PlusCircle,
  MessageSquareHeart,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { CompatibilityGauge } from '../../../components/compatibility-gauge';
import { triggerRomanticConfetti } from '../../../components/confetti-trigger';
import { GoogleAuthButton } from '../../../components/google-auth-button';
import { Button } from '../../../components/ui/button';

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<any>(null);
  const [flippedSecret, setFlippedSecret] = useState(false);
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
      <div className="flex-1 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-roseNeon/20 border-t-roseNeon animate-spin" />
          <Heart className="w-6 h-6 text-roseNeon fill-roseNeon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-white/70 text-sm mt-4 font-medium">
          Calculating Chemistry & Unlocking Results...
        </p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex-1 min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Match Not Found</h2>
        <p className="text-sm text-white/60 mb-6">
          This match link might be invalid or has expired.
        </p>
        <Link href="/">
          <Button variant="default">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const creator = match.creator || {};
  const responder = match.responder || {};
  const isHighMatch = match.compatibilityPercent >= 70;

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full flex flex-col items-center space-y-10">
      {/* Top Tag & Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-roseNeon/15 border border-roseNeon/30 text-rose-300 text-xs font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-roseNeon" />
          Compatibility Revealed
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {creator.name} & {responder.name}
        </h1>
        <p className="text-white/60 text-sm mt-1">
          {match.sameCount} out of {match.totalQuestions} questions matched!
        </p>
      </motion.div>

      {/* CIRCULAR COMPATIBILITY GAUGE */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <CompatibilityGauge score={match.compatibilityPercent} size={280} />
      </motion.div>

      {/* GOOGLE PROFILE SYNC CTA (If not yet synced) */}
      {!match.isSyncedToBothProfiles && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg rounded-3xl border border-roseNeon/40 bg-gradient-to-r from-roseNeon/20 via-electricViolet/20 to-transparent p-6 backdrop-blur-2xl text-center shadow-xl shadow-roseNeon/10"
        >
          <h3 className="text-lg font-bold text-white mb-1">
            Save Match Permanently to Both Profiles! ✨
          </h3>
          <p className="text-xs text-white/70 mb-4">
            Sign in with Google so both of you can view this match anytime in your permanent Vibe Dashboard.
          </p>
          <GoogleAuthButton
            pendingMatchId={match.id}
            text="Save to Google Profile & Sync"
          />
        </motion.div>
      )}

      {/* SIDE-BY-SIDE PROFILE & BIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Creator Card */}
        <div className="rounded-3xl border border-white/15 bg-white/[0.03] p-6 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {creator.avatarUrl ? (
                <img
                  src={creator.avatarUrl}
                  alt={creator.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-roseNeon"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-roseNeon/20 border border-roseNeon/40 flex items-center justify-center text-2xl">
                  {creator.emoji || '😎'}
                </div>
              )}
              <div>
                <h4 className="text-lg font-bold text-white">{creator.name}</h4>
                <p className="text-xs text-rose-300 font-medium">Quiz Creator</p>
              </div>
            </div>

            {creator.tagline && (
              <p className="text-xs italic text-white/70 mb-3 bg-white/5 p-2.5 rounded-xl border border-white/10">
                &quot;{creator.tagline}&quot;
              </p>
            )}

            {creator.bio && (
              <div className="text-xs text-white/80 leading-relaxed">
                <span className="font-semibold text-white">About:</span> {creator.bio}
              </div>
            )}
          </div>

          {/* Contact Reveal */}
          <div className="mt-6 pt-4 border-t border-white/10">
            {creator.contactUnlocked ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <Unlock className="w-3.5 h-3.5" /> Contact Unlocked!
                </div>
                {creator.instagramHandle && (
                  <a
                    href={`https://instagram.com/${creator.instagramHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-semibold hover:bg-pink-500/25 transition-colors"
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
                    className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp: {creator.phoneNumber}
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/50">
                <Lock className="w-4 h-4 text-white/40" />
                Contact locked (Mutual contact or score threshold required)
              </div>
            )}
          </div>
        </div>

        {/* Responder Card */}
        <div className="rounded-3xl border border-white/15 bg-white/[0.03] p-6 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {responder.avatarUrl ? (
                <img
                  src={responder.avatarUrl}
                  alt={responder.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-electricViolet"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-electricViolet/20 border border-electricViolet/40 flex items-center justify-center text-2xl">
                  {responder.emoji || '💖'}
                </div>
              )}
              <div>
                <h4 className="text-lg font-bold text-white">{responder.name}</h4>
                <p className="text-xs text-purple-300 font-medium">
                  {responder.moodTag || '💫 Dreamy'}
                </p>
              </div>
            </div>

            {responder.aboutMe && (
              <div className="text-xs text-white/80 leading-relaxed mb-3 bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="font-semibold text-white">About:</span> {responder.aboutMe}
              </div>
            )}
          </div>

          {/* Contact Reveal */}
          <div className="mt-6 pt-4 border-t border-white/10">
            {responder.contactUnlocked ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <Unlock className="w-3.5 h-3.5" /> Contact Shared!
                </div>
                {responder.instagramHandle && (
                  <a
                    href={`https://instagram.com/${responder.instagramHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-semibold hover:bg-pink-500/25 transition-colors"
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
                    className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp: {responder.phoneNumber}
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/50">
                <Lock className="w-4 h-4 text-white/40" />
                Contact not shared
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3D FLIP SECRET CONFESSIONS CARD */}
      <div className="w-full">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <MessageSquareHeart className="w-5 h-5 text-roseNeon" />
          Secret Messages & Confessions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Creator Secret Note */}
          <div className="rounded-3xl border border-roseNeon/30 bg-gradient-to-br from-roseNeon/15 via-purple-900/15 to-transparent p-6 backdrop-blur-xl">
            <span className="text-xs font-bold text-rose-300 block mb-2">
              💌 From {creator.name}:
            </span>
            {creator.secretMessage ? (
              <p className="text-sm text-white/90 italic leading-relaxed">
                &quot;{creator.secretMessage}&quot;
              </p>
            ) : (
              <p className="text-xs text-white/40 italic">
                (No secret confession added by {creator.name})
              </p>
            )}
          </div>

          {/* Responder Secret Note */}
          <div className="rounded-3xl border border-electricViolet/30 bg-gradient-to-br from-electricViolet/15 via-pink-900/15 to-transparent p-6 backdrop-blur-xl">
            <span className="text-xs font-bold text-purple-300 block mb-2">
              💌 From {responder.name}:
            </span>
            {responder.secretMessage ? (
              <p className="text-sm text-white/90 italic leading-relaxed">
                &quot;{responder.secretMessage}&quot;
              </p>
            ) : (
              <p className="text-xs text-white/40 italic">
                (No secret confession added by {responder.name})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* QUESTION COMPARISONS BREAKDOWN */}
      <div className="w-full space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Question-by-Question Comparison
        </h3>

        <div className="space-y-3">
          {match.questionComparisons?.map((qc: any, idx: number) => (
            <div
              key={qc.questionId || idx}
              className={`p-4 rounded-2xl border backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                qc.isMatch
                  ? 'bg-emerald-500/[0.06] border-emerald-500/25'
                  : 'bg-white/[0.02] border-white/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {qc.isMatch ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-white/40 shrink-0" />
                  )}
                </div>
                <div>
                  <span className="text-xs text-white/50 font-semibold block">
                    Q{idx + 1}
                  </span>
                  <p className="text-sm text-white font-medium">{qc.text}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                  {creator.name}: <strong>{qc.creatorAnswer ? 'TRUE' : 'FALSE'}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                  {responder.name}: <strong>{qc.responderAnswer ? 'TRUE' : 'FALSE'}</strong>
                </span>
                {qc.isMatch ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Match! ✨
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40">
                    Differed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-4">
        <Button
          onClick={handleShare}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied Match URL!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-roseNeon" />
              Share Result
            </>
          )}
        </Button>

        <Link href="/create" className="w-full sm:w-auto">
          <Button variant="default" size="lg" className="w-full gap-2">
            <PlusCircle className="w-4 h-4" />
            Create Your Own Vibe Quiz
          </Button>
        </Link>
      </div>
    </div>
  );
}
