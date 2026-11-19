'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Plus,
  Clock,
  Instagram,
  MessageSquareHeart,
  CheckCircle,
  Check,
  User,
  Lock,
  ListChecks,
  QrCode,
  RotateCcw,
} from 'lucide-react';
import { useCreatorWizardStore } from '../../store/quiz-store';
import { EXPIRY_OPTIONS, CONTACT_UNLOCK_RULES } from '../../lib/constants';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { QuestionCard } from '../../components/question-card';
import { QrPoster } from '../../components/qr-poster';
import { triggerRomanticConfetti } from '../../components/confetti-trigger';
import { HoloCard } from '../../components/fx/holo-card';
import { Medallion } from '../../components/fx/medallion';
import { OrnamentDivider } from '../../components/fx/ornament-divider';
import { cn } from '../../lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;
const AVATAR_EMOJIS = ['😎', '🥰', '😍', '🦋', '🌸', '🔥', '✨', '🌙'];

const STEPS = [
  { n: 1, label: 'Details', icon: User },
  { n: 2, label: 'Questions', icon: ListChecks },
  { n: 3, label: 'Security & QR', icon: Lock },
];

const stepVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 60, filter: 'blur(8px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE }, transitionEnd: { filter: 'none' } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -60, filter: 'blur(8px)', transition: { duration: 0.3 } }),
};

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-2 mb-2">
      <label className="text-xs sm:text-sm font-bold text-white/90 flex items-center gap-2">{children}</label>
      {hint && <span className="text-[10px] text-white/35 font-mono">{hint}</span>}
    </div>
  );
}

function SectionTitle({ icon: Icon, accent, title, sub }: { icon: React.ElementType; accent: 'rose' | 'violet' | 'amber' | 'emerald'; title: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
      <Medallion accent={accent} className="mb-3">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </Medallion>
      <h3 className="font-display text-lg sm:text-xl font-bold text-white">{title}</h3>
      {sub && <p className="text-xs sm:text-sm text-white/50 mt-1.5 max-w-sm">{sub}</p>}
    </div>
  );
}

export default function CreateInvitePage() {
  const store = useCreatorWizardStore();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customQuestionText, setCustomQuestionText] = useState('');
  const [customQuestionAnswer, setCustomQuestionAnswer] = useState(true);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await api.get<{ user: any }>('/auth/me');
        if (data?.user) {
          setCurrentUser(data.user);
          if (!store.creatorSnapshot.name) store.setCreatorSnapshotField('name', data.user.name);
          if (data.user.instagramHandle && !store.creatorSnapshot.instagramHandle) {
            store.setCreatorSnapshotField('instagramHandle', data.user.instagramHandle);
          }
        }
      } catch {
        // guest
      }
    }
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (step: number) => {
    if (step === store.step) return;
    setDirection(step > store.step ? 1 : -1);
    store.setStep(step);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      let creatorId = currentUser?.id;
      if (!creatorId) {
        const devRes = await api.post<any>('/auth/dev-login', {
          name: store.creatorSnapshot.name || 'DilSe Creator',
          email: `creator_${Date.now()}@example.com`,
        });
        creatorId = devRes?.user?.id;
      }

      const payload = {
        prefilledFriendName: store.prefilledFriendName || undefined,
        expiresInMinutes: store.expiresInMinutes || undefined,
        creatorSnapshot: {
          name: store.creatorSnapshot.name || 'DilSe Creator',
          avatarEmoji: store.creatorSnapshot.avatarEmoji || '😎',
          tagline: store.creatorSnapshot.tagline,
          bio: store.creatorSnapshot.bio,
          secretMessage: store.creatorSnapshot.secretMessage,
          instagramHandle: store.creatorSnapshot.instagramHandle,
          phoneNumber: store.creatorSnapshot.phoneNumber,
          unlockRule: store.creatorSnapshot.unlockRule,
          minScorePercent: store.creatorSnapshot.minScorePercent,
        },
        questions: store.questions.map((q) => ({
          questionId: q.questionId,
          text: q.text,
          creatorAnswer: q.creatorAnswer ?? true,
        })),
      };

      const result = await api.post<any>('/invites', payload);
      store.setGeneratedInvite(result?.data || result);
      triggerRomanticConfetti();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate invite');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestionText.trim()) return;
    store.addCustomQuestion(customQuestionText.trim(), customQuestionAnswer);
    setCustomQuestionText('');
    setShowCustomModal(false);
    setActiveQuestionIndex(store.questions.length); // jump to the new one
  };

  /* ─────────────── SUCCESS ─────────────── */
  if (store.generatedInvite) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col items-center w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-10 flex flex-col items-center gap-3"
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs sm:text-sm font-bold shadow-[0_8px_30px_-8px_rgba(52,211,153,0.6)]"
          >
            <CheckCircle className="w-4 h-4" />
            1-of-1 QR Created Successfully!
          </motion.div>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            Your Secret <span className="text-shimmer">Vibe QR</span> is Live! 💖
          </h1>
          <OrnamentDivider />
          <p className="text-white/65 text-sm sm:text-base max-w-lg leading-relaxed">
            Share this private QR code with{' '}
            <span className="text-white font-bold underline decoration-roseNeon underline-offset-4">
              {store.prefilledFriendName || 'your friend'}
            </span>
            . It locks to their device on the very first scan!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 30 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          style={{ transformPerspective: 1200 }}
          className="w-full"
        >
          <QrPoster
            shareUrl={store.generatedInvite.shareUrl}
            shortCode={store.generatedInvite.shortCode}
            friendName={store.prefilledFriendName}
            creatorName={store.creatorSnapshot.name || 'You'}
            expiresAt={store.generatedInvite.expiresAt}
          />
        </motion.div>

        <Button variant="ghost" onClick={() => store.resetCreatorWizard()} className="mt-8 gap-2 text-xs text-white/50 hover:text-white">
          <RotateCcw className="w-3.5 h-3.5" />
          Create Another New Invite
        </Button>
      </div>
    );
  }

  const answeredCount = store.questions.filter((q) => q.creatorAnswer !== undefined).length;
  const progress = ((store.step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex flex-col items-center">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center mb-8 sm:mb-10 flex flex-col items-center gap-3 w-full"
      >
        <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-rose-300 px-4 py-1.5 rounded-full bg-roseNeon/10 border border-roseNeon/25">
          <Sparkles className="w-3.5 h-3.5" /> Creator Studio
        </span>
        <h1 className="font-display text-[1.9rem] leading-tight sm:text-5xl font-black text-white tracking-tight">
          Create Secret <span className="text-shimmer">Vibe Invite</span>
        </h1>

        {/* Stepper — symmetric nodes on a filling rail */}
        <div className="relative w-full max-w-md mt-6">
          <div className="absolute left-[16.66%] right-[16.66%] top-6 h-[3px] rounded-full bg-white/10" />
          <motion.div
            className="absolute left-[16.66%] top-6 h-[3px] rounded-full bg-gradient-to-r from-roseNeon to-electricViolet shadow-[0_0_12px_rgba(255,51,102,0.8)]"
            initial={false}
            animate={{ width: `${(progress / 100) * 66.68}%` }}
            transition={{ duration: 0.6, ease: EASE }}
          />
          <div className="relative grid grid-cols-3">
            {STEPS.map(({ n, label, icon: Icon }) => {
              const active = store.step === n;
              const done = store.step > n;
              return (
                <button key={n} type="button" onClick={() => goTo(n)} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <motion.span
                    animate={{ scale: active ? 1.1 : 1 }}
                    className={cn(
                      'relative grid place-items-center w-12 h-12 rounded-2xl border transition-colors duration-300',
                      active
                        ? 'bg-gradient-to-br from-roseNeon to-electricViolet border-transparent text-white shadow-[0_10px_30px_-6px_rgba(255,51,102,0.9)]'
                        : done
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-[#120820] border-white/10 text-white/40 group-hover:border-white/25',
                    )}
                  >
                    {active && <span className="absolute inset-0 rounded-2xl bg-roseNeon/40 animate-ping-soft" />}
                    {done ? <Check className="relative w-5 h-5" strokeWidth={3} /> : <Icon className="relative w-5 h-5" />}
                  </motion.span>
                  <span className={cn('text-[10px] sm:text-xs font-bold transition-colors', active ? 'text-white' : 'text-white/40')}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Steps ── */}
      <div className="w-full">
        <AnimatePresence mode="wait" custom={direction}>
          {/* STEP 1 */}
          {store.step === 1 && (
            <motion.div key="s1" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" className="space-y-5">
              <HoloCard accent="rose" className="p-6 sm:p-9">
                <SectionTitle icon={User} accent="rose" title="You & Your Friend" sub="Personal greeting, avatar aur ek chhota sa intro." />

                <div className="space-y-5">
                  {/* emoji avatar picker — symmetric row */}
                  <div>
                    <FieldLabel>Apna Vibe Avatar</FieldLabel>
                    <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
                      {AVATAR_EMOJIS.map((e) => {
                        const sel = store.creatorSnapshot.avatarEmoji === e;
                        return (
                          <motion.button
                            key={e}
                            type="button"
                            whileTap={{ scale: 0.85 }}
                            whileHover={{ y: -3 }}
                            onClick={() => store.setCreatorSnapshotField('avatarEmoji', e)}
                            className={cn(
                              'aspect-square rounded-xl sm:rounded-2xl text-lg sm:text-2xl grid place-items-center border transition-all cursor-pointer',
                              sel
                                ? 'bg-roseNeon/20 border-roseNeon shadow-[0_8px_20px_-6px_rgba(255,51,102,0.8)] scale-105'
                                : 'bg-white/[0.04] border-white/10 hover:border-white/25',
                            )}
                          >
                            {e}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Friend Ka Naam / Nickname (Optional)</FieldLabel>
                    <Input
                      placeholder="Riya, Kabir, ya khali chhodo…"
                      value={store.prefilledFriendName}
                      onChange={(e) => store.setPrefilledFriendName(e.target.value)}
                    />
                    <p className="text-[11px] text-white/45 mt-2 leading-relaxed">
                      Naam daaloge toh scan karte hi &quot;Hey [Naam]!&quot; greeting dikhegi. Khali chhodoge toh friend khud apna naam daalega.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Aapka Display Name</FieldLabel>
                      <Input
                        placeholder="Aapka naam"
                        value={store.creatorSnapshot.name}
                        onChange={(e) => store.setCreatorSnapshotField('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <FieldLabel>Aapki Tagline</FieldLabel>
                      <Input
                        placeholder="Chai & late night conversations ✨"
                        value={store.creatorSnapshot.tagline}
                        onChange={(e) => store.setCreatorSnapshotField('tagline', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel hint={`${store.creatorSnapshot.bio.length} / 280`}>About Me (Bio)</FieldLabel>
                    <Textarea
                      placeholder="Apne baare mein 2-3 lines likhein…"
                      value={store.creatorSnapshot.bio}
                      maxLength={280}
                      onChange={(e) => store.setCreatorSnapshotField('bio', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </HoloCard>

              <HoloCard accent="violet" className="p-6 sm:p-9">
                <SectionTitle icon={MessageSquareHeart} accent="violet" title="Secret & Contact" sub="Match hone ke baad hi reveal hoga 🔒" />

                <div className="space-y-5">
                  <div>
                    <FieldLabel>
                      <MessageSquareHeart className="w-4 h-4 text-roseNeon" /> Secret Message / Confession 💌
                    </FieldLabel>
                    <Textarea
                      placeholder="Koi secret baat ya confession jo match ke baad reveal ho…"
                      value={store.creatorSnapshot.secretMessage}
                      onChange={(e) => store.setCreatorSnapshotField('secretMessage', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>
                        <Instagram className="w-4 h-4 text-pink-400" /> Instagram Handle
                      </FieldLabel>
                      <Input
                        placeholder="@yourhandle"
                        value={store.creatorSnapshot.instagramHandle}
                        onChange={(e) => store.setCreatorSnapshotField('instagramHandle', e.target.value)}
                      />
                    </div>
                    <div>
                      <FieldLabel>Phone / WhatsApp (Optional)</FieldLabel>
                      <Input
                        placeholder="+91 9876543210"
                        value={store.creatorSnapshot.phoneNumber}
                        onChange={(e) => store.setCreatorSnapshotField('phoneNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel>When Should Your Contact Unlock?</FieldLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {CONTACT_UNLOCK_RULES.map((rule) => {
                        const sel = store.creatorSnapshot.unlockRule === rule.value;
                        return (
                          <HoloCard
                            key={rule.value}
                            accent="violet"
                            active={sel}
                            corners={sel}
                            role="button"
                            tabIndex={0}
                            onClick={() => store.setCreatorSnapshotField('unlockRule', rule.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') store.setCreatorSnapshotField('unlockRule', rule.value);
                            }}
                            whileTap={{ scale: 0.97 }}
                            className={cn('p-4 cursor-pointer text-center !rounded-2xl', sel ? '!bg-electricViolet/15' : '')}
                          >
                            <div className="text-2xl mb-2">{rule.icon}</div>
                            <div className="text-xs font-bold text-white">{rule.title}</div>
                            <div className="text-[11px] text-white/50 mt-1 leading-snug">{rule.description}</div>
                            <div
                              className={cn(
                                'mx-auto mt-3 w-5 h-5 rounded-full border-2 grid place-items-center transition-colors',
                                sel ? 'border-electricViolet bg-electricViolet' : 'border-white/20',
                              )}
                            >
                              {sel && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </div>
                          </HoloCard>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </HoloCard>

              <div className="flex justify-center pt-2">
                <Button size="xl" onClick={() => goTo(2)} className="w-full sm:w-auto gap-2">
                  Proceed to True/False Deck
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {store.step === 2 && (
            <motion.div key="s2" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
              {store.questions.length > 0 && store.questions[activeQuestionIndex] && (
                <QuestionCard
                  questionId={store.questions[activeQuestionIndex].questionId}
                  questionNumber={activeQuestionIndex + 1}
                  totalQuestions={store.questions.length}
                  text={store.questions[activeQuestionIndex].text}
                  selectedAnswer={store.questions[activeQuestionIndex].creatorAnswer}
                  onAnswer={(ans) => {
                    store.setQuestionAnswer(store.questions[activeQuestionIndex].questionId, ans);
                    if (activeQuestionIndex < store.questions.length - 1) {
                      setTimeout(() => setActiveQuestionIndex((prev) => prev + 1), 220);
                    }
                  }}
                  isCreatorView
                />
              )}

              {/* question chips — centered & symmetric */}
              <HoloCard accent="violet" corners={false} className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 text-[11px] font-bold uppercase tracking-[0.18em]">
                  <span className="text-white/45">Jump to</span>
                  <span className="text-emerald-300">
                    {answeredCount}/{store.questions.length} answered
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {store.questions.map((q, idx) => {
                    const active = activeQuestionIndex === idx;
                    return (
                      <motion.button
                        key={q.questionId}
                        whileTap={{ scale: 0.88 }}
                        onClick={() => setActiveQuestionIndex(idx)}
                        className={cn(
                          'relative w-10 h-10 rounded-xl text-xs font-bold transition-colors cursor-pointer',
                          active
                            ? 'text-white'
                            : q.creatorAnswer === true
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/35'
                              : q.creatorAnswer === false
                                ? 'bg-roseNeon/15 text-rose-300 border border-roseNeon/35'
                                : 'bg-white/5 text-white/40 border border-white/10',
                        )}
                      >
                        {active && (
                          <motion.span
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                            className="absolute inset-0 rounded-xl bg-gradient-to-br from-roseNeon to-electricViolet shadow-[0_8px_20px_-6px_rgba(255,51,102,0.9)]"
                          />
                        )}
                        <span className="relative">{idx + 1}</span>
                      </motion.button>
                    );
                  })}
                  <button
                    onClick={() => setShowCustomModal(true)}
                    className="h-10 px-3.5 rounded-xl text-xs font-bold border border-dashed border-roseNeon/50 text-rose-300 hover:bg-roseNeon/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Custom
                  </button>
                </div>
              </HoloCard>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => goTo(1)} className="gap-2 h-13 rounded-2xl">
                  <ArrowLeft className="w-4 h-4" />
                  Details
                </Button>
                <Button onClick={() => goTo(3)} className="gap-2 h-13 rounded-2xl">
                  Security
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {store.step === 3 && (
            <motion.div key="s3" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" className="space-y-5">
              <HoloCard accent="emerald" active className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <Medallion accent="emerald" className="shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </Medallion>
                  <div>
                    <h4 className="font-display text-base sm:text-lg font-bold text-white">Cryptographically Enforced Single-Use Lock</h4>
                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed mt-1.5">
                      Once your friend scans and submits this invite, the token is permanently burned. No one else can ever access, replay, or submit this quiz.
                    </p>
                  </div>
                </div>
              </HoloCard>

              <HoloCard accent="amber" className="p-6 sm:p-8">
                <SectionTitle icon={Clock} accent="amber" title="Set Expiry Timer" sub="Kitni der tak QR zinda rahe?" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {EXPIRY_OPTIONS.map((opt) => {
                    const sel = store.expiresInMinutes === opt.minutes;
                    return (
                      <motion.button
                        key={opt.label}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ y: -3 }}
                        onClick={() => store.setExpiresInMinutes(opt.minutes)}
                        className={cn(
                          'relative p-4 rounded-2xl border text-center transition-colors cursor-pointer overflow-hidden',
                          sel
                            ? 'bg-amber-500/15 border-amber-400 shadow-[0_10px_30px_-10px_rgba(251,191,36,0.8)]'
                            : 'bg-white/[0.04] border-white/10 hover:border-white/25',
                        )}
                      >
                        {sel && (
                          // NOTE: no layoutId here — shared-layout nodes inside an AnimatePresence
                          // mode="wait" subtree stop the step exit from ever completing.
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.3),transparent_70%)]"
                          />
                        )}
                        <div className="relative font-display text-sm font-bold text-white">{opt.label}</div>
                        <div className="relative text-[11px] text-amber-300 mt-1 font-semibold">{opt.tag}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </HoloCard>

              {/* summary — mirrored label/value rows */}
              <HoloCard accent="rose" corners={false} className="p-5 sm:p-6">
                <div className="grid grid-cols-3 divide-x divide-white/10 text-center">
                  {[
                    { k: 'Friend', v: store.prefilledFriendName || 'Open' },
                    { k: 'Questions', v: `${store.questions.length}` },
                    {
                      k: 'Unlock',
                      v: CONTACT_UNLOCK_RULES.find((r) => r.value === store.creatorSnapshot.unlockRule)?.icon || '🤝',
                    },
                  ].map((row) => (
                    <div key={row.k} className="px-2">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">{row.k}</div>
                      <div className="font-display text-base sm:text-lg font-bold text-white mt-1 truncate">{row.v}</div>
                    </div>
                  ))}
                </div>
              </HoloCard>

              {error && (
                <div className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-sm text-red-300 text-center">{error}</div>
              )}

              <div className="grid grid-cols-[auto_1fr] gap-3">
                <Button variant="outline" onClick={() => goTo(2)} className="gap-2 h-14 sm:h-16 px-5 rounded-2xl" aria-label="Back to questions">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                <Button size="xl" disabled={loading} onClick={handleGenerate} className="gap-2 w-full">
                  {loading ? (
                    <>
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <Sparkles className="w-5 h-5" />
                      </motion.span>
                      Generating…
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5" />
                      Generate My Secret QR
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CUSTOM QUESTION DIALOG */}
      <Dialog open={showCustomModal} onOpenChange={setShowCustomModal}>
        <DialogContent>
          <DialogTitle>Add Your Own Question</DialogTitle>
          <DialogDescription>Type any dating or vibe question. Both of you will answer True or False!</DialogDescription>
          <form onSubmit={handleAddCustom} className="space-y-4 mt-5">
            <Textarea
              placeholder="e.g. Kya tum weekend pe movies dekhna prefer karte ho?"
              value={customQuestionText}
              onChange={(e) => setCustomQuestionText(e.target.value)}
              rows={3}
              required
            />
            <div>
              <label className="text-xs text-white/70 block mb-2 font-semibold">Your Secret Answer</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: false, l: 'FALSE ✕', on: 'bg-roseNeon/20 border-roseNeon text-rose-200' },
                  { v: true, l: 'TRUE ✓', on: 'bg-emerald-500/20 border-emerald-400 text-emerald-200' },
                ].map((o) => (
                  <button
                    key={o.l}
                    type="button"
                    onClick={() => setCustomQuestionAnswer(o.v)}
                    className={cn(
                      'h-12 rounded-2xl text-xs font-bold border transition-all cursor-pointer',
                      customQuestionAnswer === o.v ? o.on : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10',
                    )}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowCustomModal(false)} className="h-11 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="h-11 rounded-xl">
                Add Question
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
