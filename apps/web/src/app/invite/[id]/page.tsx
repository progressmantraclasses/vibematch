'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, ArrowLeft, Instagram, Phone, MessageSquareHeart, Mail } from 'lucide-react';
import { api } from '../../../lib/api';
import { MOOD_TAGS } from '../../../lib/constants';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import { QuestionCard } from '../../../components/question-card';
import { LockedScreen } from '../../../components/locked-screen';
import { CountdownTimer } from '../../../components/countdown-timer';
import { HoloCard } from '../../../components/fx/holo-card';
import { HeartLoader } from '../../../components/fx/heart-loader';
import { MandalaRing } from '../../../components/fx/mandala-ring';
import { OrnamentDivider } from '../../../components/fx/ornament-divider';
import { AvatarOrb } from '../../../components/fx/avatar-orb';
import { cn } from '../../../lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

const stageVariants: Variants = {
  enter: { opacity: 0, y: 30, scale: 0.97, filter: 'blur(8px)' },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: EASE },
    transitionEnd: { filter: 'none' },
  },
  exit: { opacity: 0, y: -20, scale: 0.98, filter: 'blur(6px)', transition: { duration: 0.3 } },
};

type Stage = 'welcome' | 'questions' | 'confession';
const STAGES: Stage[] = ['welcome', 'questions', 'confession'];

export default function InviteScannerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const inviteId = params?.id as string;
  const rawToken = searchParams.get('t') || '';

  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<'ALREADY_USED' | 'EXPIRED' | 'REVOKED' | 'NOT_FOUND' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [inviteData, setInviteData] = useState<any>(null);

  const [stage, setStage] = useState<Stage>('welcome');
  const [friendName, setFriendName] = useState('');
  const [selectedMood, setSelectedMood] = useState('💫 Dreamy');
  const [aboutMe, setAboutMe] = useState('');
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const [secretMessage, setSecretMessage] = useState('');
  const [shareContact, setShareContact] = useState(false);
  const [instagram, setInstagram] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function claimInvite() {
      if (!inviteId || !rawToken) {
        setErrorType('NOT_FOUND');
        setErrorMessage('Missing security token in QR invite link.');
        setLoading(false);
        return;
      }
      try {
        const res = await api.post<any>(`/invites/${inviteId}/claim`, { token: rawToken });
        const data = res?.data || res;
        setInviteData(data);
        if (data?.prefilledFriendName) setFriendName(data.prefilledFriendName);
      } catch (err: any) {
        console.error('Claim error:', err);
        const code = err.code || err.data?.code;
        if (code === 'QR_ALREADY_USED' || code === 'QR_ALREADY_CLAIMED') {
          setErrorType('ALREADY_USED');
          setErrorMessage(err.message);
        } else if (code === 'QR_EXPIRED') {
          setErrorType('EXPIRED');
          setErrorMessage(err.message);
        } else if (code === 'QR_REVOKED') {
          setErrorType('REVOKED');
          setErrorMessage(err.message);
        } else {
          setErrorType('NOT_FOUND');
          setErrorMessage(err.message || 'Could not verify invite.');
        }
      } finally {
        setLoading(false);
      }
    }
    claimInvite();
  }, [inviteId, rawToken]);

  const goStage = (s: Stage) => {
    setStage(s);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const answersList = Object.entries(answers).map(([questionId, responderAnswer]) => ({
        questionId,
        responderAnswer,
      }));
      const payload = {
        responderDisplayName: friendName.trim() || 'Friend',
        responderMoodTag: selectedMood,
        responderAboutMe: aboutMe.trim(),
        responderSecretMessage: secretMessage.trim(),
        responderSharedContact: shareContact,
        responderInstagram: shareContact ? instagram.trim() : undefined,
        responderPhone: shareContact ? phone.trim() : undefined,
        answers: answersList,
      };
      const res = await api.post<any>(`/invites/${inviteId}/submit`, payload);
      const data = res?.data || res;
      router.push(`/match/${data.matchId}`);
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'Failed to submit quiz.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <HeartLoader label="Verifying 1-of-1 Cryptographic QR…" sublabel="Single-Use Anti-Replay Guard" />;
  }

  if (errorType) {
    return <LockedScreen type={errorType} customMessage={errorMessage} />;
  }

  const questions = inviteData?.questions || [];
  const creator = inviteData?.creator || {};
  const stageIndex = STAGES.indexOf(stage);

  return (
    <div className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 w-full flex flex-col items-center">
      {/* Top banner — creator ⟷ timer, with stage dots centered */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full grid grid-cols-[1fr_auto_1fr] items-center mb-8 gap-3"
      >
        <div className="flex items-center gap-2 min-w-0 justify-self-start">
          <AvatarOrb emoji={creator.avatarEmoji || '😎'} size="sm" />
          <span className="text-[11px] sm:text-sm text-white/60 truncate">
            by <strong className="text-white">{creator.name}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {STAGES.map((s, i) => (
            <motion.span
              key={s}
              animate={{ width: i === stageIndex ? 24 : 8 }}
              className={cn(
                'h-2 rounded-full transition-colors',
                i <= stageIndex ? 'bg-gradient-to-r from-roseNeon to-electricViolet' : 'bg-white/15',
              )}
            />
          ))}
        </div>
        <div className="justify-self-end">
          <CountdownTimer expiresAt={inviteData?.expiresAt} className="hidden sm:inline-flex" />
        </div>
      </motion.div>

      <div className="sm:hidden -mt-4 mb-6">
        <CountdownTimer expiresAt={inviteData?.expiresAt} />
      </div>

      <AnimatePresence mode="wait">
        {/* ── STAGE 1: WELCOME ── */}
        {stage === 'welcome' && (
          <motion.div key="welcome" variants={stageVariants} initial="enter" animate="center" exit="exit" className="w-full">
            <HoloCard accent="rose" active className="p-6 sm:p-10 overflow-hidden">
              <MandalaRing className="absolute left-1/2 -top-24 -translate-x-1/2 w-[440px] opacity-50" />

              <div className="relative text-center flex flex-col items-center">
                {/* envelope → heart reveal */}
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.15 }}
                  className="relative mb-6"
                >
                  <span className="absolute inset-0 rounded-3xl bg-roseNeon/40 animate-ping-soft" />
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-roseNeon via-fuchsia-500 to-electricViolet grid place-items-center shadow-[0_20px_50px_-10px_rgba(255,51,102,0.9)] ring-1 ring-white/25">
                    <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-white fill-white heartbeat-glow" />
                  </div>
                </motion.div>

                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold bg-roseNeon/15 border border-roseNeon/35 text-rose-200 mb-4">
                  <Mail className="w-3.5 h-3.5" /> Private Vibe Check
                </span>
                <h2 className="font-display text-[1.75rem] leading-tight sm:text-4xl font-black text-white tracking-tight">
                  {inviteData?.prefilledFriendName ? (
                    <>
                      Hey <span className="text-shimmer">{inviteData.prefilledFriendName}</span>! ✨
                    </>
                  ) : (
                    <>
                      Welcome to <span className="text-shimmer">DilSe</span> ✨
                    </>
                  )}
                </h2>
                <OrnamentDivider className="my-4" />
                <p className="text-white/65 text-sm sm:text-base max-w-md leading-relaxed">
                  <strong className="text-white">{creator.name}</strong> ne tumhare liye {questions.length} secret True/False sawaal banaye hain. Imaandari se answer karo aur apna vibe % reveal karo!
                </p>
              </div>

              <div className="relative text-left space-y-5 mt-8 pt-6 border-t border-white/10">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-white/90 block mb-2">Apna Naam Confirm Karein</label>
                  <Input placeholder="Aapka naam" value={friendName} onChange={(e) => setFriendName(e.target.value)} />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-white/90 block mb-2.5">Aapka Current Vibe / Mood</label>
                  <div className="flex flex-wrap justify-center gap-2">
                    {MOOD_TAGS.map((tag) => {
                      const sel = selectedMood === tag.label;
                      return (
                        <motion.button
                          key={tag.id}
                          type="button"
                          whileTap={{ scale: 0.9 }}
                          whileHover={{ y: -2 }}
                          onClick={() => setSelectedMood(tag.label)}
                          className={cn(
                            'relative px-4 h-10 rounded-2xl text-xs font-bold border transition-colors cursor-pointer',
                            sel ? 'border-roseNeon text-white' : 'bg-white/[0.04] border-white/10 text-white/60 hover:text-white hover:border-white/25',
                          )}
                        >
                          {sel && (
                            // no layoutId: it would block the stage's AnimatePresence exit
                            <motion.span
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute inset-0 rounded-2xl bg-[linear-gradient(110deg,rgba(255,51,102,0.35),rgba(168,85,247,0.3))] shadow-[0_8px_20px_-6px_rgba(255,51,102,0.8)]"
                              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                            />
                          )}
                          <span className="relative">{tag.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-white/90 block mb-2">About Me / Bio (Optional)</label>
                  <Textarea
                    placeholder="Ek chhoti si line apne baare mein…"
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    rows={2}
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <Button size="xl" onClick={() => goStage('questions')} className="relative w-full gap-2 mt-8">
                Start Answering
                <ArrowRight className="w-5 h-5" />
              </Button>
            </HoloCard>
          </motion.div>
        )}

        {/* ── STAGE 2: QUESTION DECK ── */}
        {stage === 'questions' && questions.length > 0 && (
          <motion.div key="questions" variants={stageVariants} initial="enter" animate="center" exit="exit" className="w-full space-y-6">
            <QuestionCard
              questionId={questions[currentQIndex]?.questionId}
              questionNumber={currentQIndex + 1}
              totalQuestions={questions.length}
              text={questions[currentQIndex]?.text}
              selectedAnswer={answers[questions[currentQIndex]?.questionId]}
              onAnswer={(ans) => {
                setAnswers((prev) => ({ ...prev, [questions[currentQIndex].questionId]: ans }));
                if (currentQIndex < questions.length - 1) {
                  setTimeout(() => setCurrentQIndex((prev) => prev + 1), 220);
                } else {
                  setTimeout(() => goStage('confession'), 420);
                }
              }}
            />

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                className="justify-self-start gap-1.5 h-11 px-4 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                Prev
              </Button>
              <span className="font-mono text-xs text-white/55 font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                {Object.keys(answers).length}/{questions.length}
              </span>
              {currentQIndex < questions.length - 1 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentQIndex((prev) => prev + 1)}
                  className="justify-self-end gap-1.5 h-11 px-4 rounded-xl"
                >
                  Skip
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button variant="rose" size="sm" onClick={() => goStage('confession')} className="justify-self-end gap-1.5 h-11 px-4 rounded-xl">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── STAGE 3: CONFESSION ── */}
        {stage === 'confession' && (
          <motion.div key="confession" variants={stageVariants} initial="enter" animate="center" exit="exit" className="w-full space-y-5">
            <HoloCard accent="violet" active className="p-6 sm:p-9 overflow-hidden">
              <div className="text-center flex flex-col items-center mb-7">
                {/* animated envelope */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 160, damping: 14 }}
                  className="relative w-20 h-14 mb-5"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-roseNeon/40 to-electricViolet/40 border border-white/25 shadow-[0_15px_40px_-10px_rgba(168,85,247,0.8)]" />
                  <motion.div
                    className="absolute inset-x-0 top-0 h-8 origin-top"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.1))' }}
                    initial={{ rotateX: 0 }}
                    animate={{ rotateX: 180 }}
                    transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
                  />
                  <motion.div
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -22, opacity: 1 }}
                    transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 12 }}
                    className="absolute left-1/2 top-2 -translate-x-1/2"
                  >
                    <Heart className="w-7 h-7 text-roseNeon fill-roseNeon drop-shadow-[0_0_12px_rgba(255,51,102,0.9)]" />
                  </motion.div>
                </motion.div>

                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-300 px-3.5 py-1 rounded-full bg-electricViolet/10 border border-electricViolet/30">
                  Final Step
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight mt-3">
                  Secret Message &amp; <span className="text-shimmer">Mutual Vibe</span>
                </h3>
                <p className="text-white/55 text-xs sm:text-sm mt-2 leading-relaxed max-w-sm">
                  Dono ke confessions aur contacts match reveal hone tak locked rahenge!
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-white/90 mb-2 flex items-center gap-2">
                    <MessageSquareHeart className="w-4 h-4 text-roseNeon" />
                    {creator.name} ke liye koi Secret Note? 💭
                  </label>
                  <Textarea
                    placeholder="Kuch aisa jo tum unhe batana chahte ho…"
                    value={secretMessage}
                    onChange={(e) => setSecretMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                <div
                  className={cn(
                    'p-5 sm:p-6 rounded-2xl border transition-all duration-500',
                    shareContact
                      ? 'border-roseNeon/50 bg-gradient-to-br from-roseNeon/15 to-electricViolet/10 shadow-[0_15px_40px_-15px_rgba(255,51,102,0.7)]'
                      : 'border-white/10 bg-white/[0.03]',
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-roseNeon" />
                        Mujhe tumhari vibe pasand aayi! 💖
                      </span>
                      <span className="text-[11px] sm:text-xs text-white/55 mt-1 leading-relaxed">
                        Share my Instagram / WhatsApp with {creator.name}
                      </span>
                    </div>
                    <Switch checked={shareContact} onCheckedChange={setShareContact} />
                  </div>

                  <AnimatePresence initial={false}>
                    {shareContact && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 mt-4 border-t border-white/10">
                          <div>
                            <label className="text-xs text-white/70 mb-1.5 font-medium flex items-center gap-1.5">
                              <Instagram className="w-3.5 h-3.5 text-pink-400" /> Instagram
                            </label>
                            <Input placeholder="@yourhandle" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="h-11" />
                          </div>
                          <div>
                            <label className="text-xs text-white/70 mb-1.5 font-medium flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp
                            </label>
                            <Input placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </HoloCard>

            {submitError && (
              <div className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-sm text-red-300 text-center">{submitError}</div>
            )}

            <div className="grid grid-cols-[auto_1fr] gap-3">
              <Button variant="outline" onClick={() => goStage('questions')} className="gap-2 h-14 sm:h-16 px-5 rounded-2xl" aria-label="Back to questions">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <Button size="xl" disabled={submitting} onClick={handleSubmit} className="gap-2 w-full">
                <Heart className={cn('w-5 h-5 fill-white', submitting && 'animate-pulse')} />
                {submitting ? 'Calculating Vibe…' : 'Reveal Compatibility'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
