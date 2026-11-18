'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Instagram,
  Phone,
  MessageSquareHeart,
  ShieldCheck,
  User,
  Clock,
} from 'lucide-react';
import { api, ApiError } from '../../../lib/api';
import { MOOD_TAGS } from '../../../lib/constants';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import { QuestionCard } from '../../../components/question-card';
import { LockedScreen } from '../../../components/locked-screen';
import { CountdownTimer } from '../../../components/countdown-timer';

export default function InviteScannerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const inviteId = params?.id as string;
  const rawToken = searchParams.get('t') || '';

  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<
    'ALREADY_USED' | 'EXPIRED' | 'REVOKED' | 'NOT_FOUND' | null
  >(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [inviteData, setInviteData] = useState<any>(null);

  // Friend Flow State
  const [stage, setStage] = useState<'welcome' | 'questions' | 'confession'>(
    'welcome',
  );
  const [friendName, setFriendName] = useState('');
  const [selectedMood, setSelectedMood] = useState('💫 Dreamy');
  const [aboutMe, setAboutMe] = useState('');
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Secret confession & Mutual contact
  const [secretMessage, setSecretMessage] = useState('');
  const [shareContact, setShareContact] = useState(false);
  const [instagram, setInstagram] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function claimInvite() {
      if (!inviteId || !rawToken) {
        setErrorType('NOT_FOUND');
        setErrorMessage('Missing security token in QR invite link.');
        setLoading(false);
        return;
      }

      try {
        const res = await api.post<any>(`/invites/${inviteId}/claim`, {
          token: rawToken,
        });
        const data = res?.data || res;
        setInviteData(data);
        if (data?.prefilledFriendName) {
          setFriendName(data.prefilledFriendName);
        }
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

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answersList = Object.entries(answers).map(
        ([questionId, responderAnswer]) => ({
          questionId,
          responderAnswer,
        }),
      );

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
      alert(err.message || 'Failed to submit quiz.');
      setSubmitting(false);
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
          Verifying 1-of-1 Cryptographic QR Code...
        </p>
        <span className="text-xs text-white/40 mt-1 font-mono">Single-Use Anti-Replay Guard</span>
      </div>
    );
  }

  if (errorType) {
    return <LockedScreen type={errorType} customMessage={errorMessage} />;
  }

  const questions = inviteData?.questions || [];
  const creator = inviteData?.creator || {};

  return (
    <div className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex flex-col items-center">
      {/* Top Banner with Expiry & Creator pill */}
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-white/10 gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-2xl bg-roseNeon/20 border border-roseNeon/40 flex items-center justify-center text-base shadow-sm">
            {creator.avatarEmoji || '😎'}
          </span>
          <span className="text-xs sm:text-sm text-white/70">
            Quiz by <strong className="text-white">{creator.name}</strong>
          </span>
        </div>

        <CountdownTimer expiresAt={inviteData?.expiresAt} />
      </div>

      {/* STAGE 1: PERSONALIZED WELCOME */}
      {stage === 'welcome' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full rounded-3xl border border-white/15 bg-white/[0.04] p-6 sm:p-10 backdrop-blur-2xl shadow-2xl text-center space-y-6 relative overflow-hidden"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-roseNeon to-electricViolet flex items-center justify-center mx-auto shadow-xl shadow-roseNeon/30">
            <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-roseNeon/20 border border-roseNeon/40 text-rose-300">
              Private Vibe Check 💌
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {inviteData?.prefilledFriendName ? (
                <>Hey {inviteData.prefilledFriendName}! ✨</>
              ) : (
                <>Welcome to DilSe VibeMatch ✨</>
              )}
            </h2>
            <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              <strong className="text-white">{creator.name}</strong> created this 1-of-1 private quiz for you with {questions.length} secret True/False questions. Answer honestly to reveal your vibe compatibility %!
            </p>
          </div>

          {/* Name Confirmation/Input */}
          <div className="text-left space-y-5 pt-3 border-t border-white/10">
            <div>
              <label className="text-xs sm:text-sm font-bold text-white/90 block mb-1.5">
                Apna Naam Confirm Karein
              </label>
              <Input
                placeholder="Aapka naam"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                className="h-12 bg-white/5 border-white/15 focus-visible:ring-roseNeon rounded-2xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-bold text-white/90 block mb-2">
                Aapka Current Vibe / Mood
              </label>
              <div className="flex flex-wrap gap-2">
                {MOOD_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedMood(tag.label)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedMood === tag.label
                        ? 'bg-roseNeon/25 border-roseNeon text-white shadow-md shadow-roseNeon/20 scale-105'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-bold text-white/90 block mb-1.5">
                About Me / Bio (Optional)
              </label>
              <Textarea
                placeholder="Ek chhoti si line apne baare mein..."
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                rows={2}
                className="bg-white/5 border-white/15 focus-visible:ring-roseNeon rounded-2xl text-sm"
              />
            </div>
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={() => setStage('questions')}
            className="w-full gap-2 h-13 rounded-2xl shadow-xl shadow-roseNeon/30 text-base font-bold"
          >
            Start Answering Quiz
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      )}

      {/* STAGE 2: TRUE / FALSE DECK */}
      {stage === 'questions' && questions.length > 0 && (
        <div className="w-full space-y-6">
          <QuestionCard
            questionId={questions[currentQIndex]?.questionId}
            questionNumber={currentQIndex + 1}
            totalQuestions={questions.length}
            text={questions[currentQIndex]?.text}
            selectedAnswer={answers[questions[currentQIndex]?.questionId]}
            onAnswer={(ans) => {
              setAnswers((prev) => ({
                ...prev,
                [questions[currentQIndex].questionId]: ans,
              }));

              if (currentQIndex < questions.length - 1) {
                setTimeout(() => {
                  setCurrentQIndex((prev) => prev + 1);
                }, 220);
              } else {
                setTimeout(() => {
                  setStage('confession');
                }, 320);
              }
            }}
          />

          <div className="flex items-center justify-between gap-4 px-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
              className="gap-1.5 h-10 px-4 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <span className="text-xs sm:text-sm text-white/60 font-semibold font-mono">
              {Object.keys(answers).length} / {questions.length} Answered
            </span>

            {currentQIndex < questions.length - 1 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentQIndex((prev) => prev + 1)}
                className="gap-1.5 h-10 px-4 rounded-xl text-white/60 hover:text-white"
              >
                Skip
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="rose"
                size="sm"
                onClick={() => setStage('confession')}
                className="gap-1.5 h-10 px-5 rounded-xl font-bold"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* STAGE 3: SECRET CONFESSION & CONTACT EXCHANGE */}
      {stage === 'confession' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full rounded-3xl border border-white/15 bg-white/[0.04] p-6 sm:p-9 backdrop-blur-2xl shadow-2xl space-y-6 relative overflow-hidden"
        >
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-roseNeon px-3 py-1 rounded-full bg-roseNeon/10 border border-roseNeon/20">
              Final Step
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
              Secret Message &amp; Mutual Vibe 💖
            </h3>
            <p className="text-white/60 text-xs sm:text-sm mt-1 leading-relaxed">
              Both of your confessions and contact info stay locked until the match results are revealed!
            </p>
          </div>

          {/* Secret Message */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-white/90 block mb-2 flex items-center gap-2">
              <MessageSquareHeart className="w-4 h-4 text-roseNeon" />
              {creator.name} ke liye koi Secret Note / Confession? 💭
            </label>
            <Textarea
              placeholder="Kuch aisa jo tum unhe batana chahte ho..."
              value={secretMessage}
              onChange={(e) => setSecretMessage(e.target.value)}
              rows={3}
              className="bg-white/5 border-white/15 focus-visible:ring-roseNeon rounded-2xl text-sm"
            />
          </div>

          {/* Mutual Contact Toggle */}
          <div className="p-5 sm:p-6 rounded-2xl border border-roseNeon/30 bg-roseNeon/10 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-roseNeon" />
                  Mujhe tumhari vibe pasand aayi! 💖
                </span>
                <span className="text-xs text-white/65 mt-0.5 leading-relaxed">
                  Share my Instagram / WhatsApp number with {creator.name}
                </span>
              </div>
              <Switch checked={shareContact} onCheckedChange={setShareContact} />
            </div>

            {shareContact && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10"
              >
                <div>
                  <label className="text-xs text-white/70 block mb-1.5 font-medium">
                    Instagram Handle
                  </label>
                  <Input
                    placeholder="@yourhandle"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="h-11 bg-white/5 border-white/15 focus-visible:ring-roseNeon rounded-2xl"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/70 block mb-1.5 font-medium">
                    Phone / WhatsApp
                  </label>
                  <Input
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 bg-white/5 border-white/15 focus-visible:ring-roseNeon rounded-2xl"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 gap-4">
            <Button
              variant="outline"
              onClick={() => setStage('questions')}
              className="gap-1.5 h-12 px-6 rounded-2xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Questions
            </Button>

            <Button
              variant="default"
              size="lg"
              disabled={submitting}
              onClick={handleSubmit}
              className="gap-2 h-13 px-8 rounded-2xl shadow-xl shadow-roseNeon/30 text-base font-bold"
            >
              <Heart className="w-5 h-5 fill-white" />
              {submitting ? 'Calculating Vibe Match...' : 'Reveal Vibe Compatibility'}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
