'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Plus,
  Trash2,
  Clock,
  Instagram,
  Phone,
  MessageSquareHeart,
  CheckCircle,
} from 'lucide-react';
import { useCreatorWizardStore } from '../../store/quiz-store';
import { EXPIRY_OPTIONS, CONTACT_UNLOCK_RULES } from '../../lib/constants';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { QuestionCard } from '../../components/question-card';
import { QrPoster } from '../../components/qr-poster';
import { triggerRomanticConfetti } from '../../components/confetti-trigger';

export default function CreateInvitePage() {
  const store = useCreatorWizardStore();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customQuestionText, setCustomQuestionText] = useState('');
  const [customQuestionAnswer, setCustomQuestionAnswer] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await api.get<{ user: any }>('/auth/me');
        if (data?.user) {
          setCurrentUser(data.user);
          if (!store.creatorSnapshot.name) {
            store.setCreatorSnapshotField('name', data.user.name);
          }
          if (data.user.instagramHandle && !store.creatorSnapshot.instagramHandle) {
            store.setCreatorSnapshotField('instagramHandle', data.user.instagramHandle);
          }
        }
      } catch {
        // Not logged in or guest
      }
    }
    loadUser();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // If user isn't logged in, login via dev login seamlessly or prompt
      let creatorId = currentUser?.id;
      if (!creatorId) {
        // Fast create fallback
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
      const inviteData = result?.data || result;
      store.setGeneratedInvite(inviteData);
      triggerRomanticConfetti();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to generate invite');
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
  };

  // If already generated, render the Poster screen!
  if (store.generatedInvite) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <CheckCircle className="w-4 h-4" />
            1-of-1 QR Created Successfully!
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Your Secret Vibe QR is Live! 💖
          </h1>
          <p className="text-white/60 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Share this private QR code with{' '}
            <span className="text-white font-semibold">
              {store.prefilledFriendName || 'your friend'}
            </span>
            . It locks to their device on the very first scan!
          </p>
        </motion.div>

        <QrPoster
          shareUrl={store.generatedInvite.shareUrl}
          shortCode={store.generatedInvite.shortCode}
          friendName={store.prefilledFriendName}
          creatorName={store.creatorSnapshot.name || 'You'}
          expiresAt={store.generatedInvite.expiresAt}
        />

        <div className="mt-8">
          <Button
            variant="ghost"
            onClick={() => store.resetCreatorWizard()}
            className="text-xs text-white/50 hover:text-white"
          >
            Create Another New Invite
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full flex flex-col items-center">
      {/* Wizard Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-roseNeon">
          Creator Studio
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1">
          Create Secret Vibe Invite
        </h1>
        <p className="text-white/60 text-sm mt-2">
          Step {store.step} of 3: {store.step === 1 && 'Profile & Friend Details'}
          {store.step === 2 && 'True/False Vibe Deck'}
          {store.step === 3 && 'Security & QR Expiry'}
        </p>

        {/* Step Progress Line */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              onClick={() => store.setStep(s)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                store.step === s
                  ? 'bg-roseNeon text-white shadow-lg shadow-roseNeon/30 ring-2 ring-roseNeon/50'
                  : store.step > s
                  ? 'bg-white/10 text-white/90 border border-white/20'
                  : 'bg-white/5 text-white/40 border border-white/5'
              }`}
            >
              <span>{s}</span>
              <span className="hidden sm:inline">
                {s === 1 ? 'Details' : s === 2 ? 'Questions' : 'Security & QR'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* WIZARD STEPS */}
      <div className="w-full">
        {/* STEP 1: Profile & Friend Info */}
        {store.step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-3xl border border-white/15 bg-white/[0.03] p-7 md:p-9 backdrop-blur-2xl space-y-6 shadow-2xl"
          >
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Friend Ka Naam / Nickname (Optional)
              </label>
              <Input
                placeholder="Riya, Kabir, ya khali chhodo..."
                value={store.prefilledFriendName}
                onChange={(e) => store.setPrefilledFriendName(e.target.value)}
              />
              <p className="text-xs text-white/50 mt-1.5">
                Agar naam daaloge toh scan karte hi &quot;Hey [Naam]!&quot; personal greeting dikhegi. Khali chhodoge toh friend khud apna naam daalega.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Aapka Display Name
                </label>
                <Input
                  placeholder="Aapka naam"
                  value={store.creatorSnapshot.name}
                  onChange={(e) =>
                    store.setCreatorSnapshotField('name', e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Aapki Tagline
                </label>
                <Input
                  placeholder="e.g. Chai & late night conversations ✨"
                  value={store.creatorSnapshot.tagline}
                  onChange={(e) =>
                    store.setCreatorSnapshotField('tagline', e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                About Me (Bio)
              </label>
              <Textarea
                placeholder="Apne baare mein 2-3 lines likhein..."
                value={store.creatorSnapshot.bio}
                maxLength={280}
                onChange={(e) =>
                  store.setCreatorSnapshotField('bio', e.target.value)
                }
              />
              <span className="text-[11px] text-white/40 block text-right mt-1">
                {store.creatorSnapshot.bio.length} / 280
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
                <MessageSquareHeart className="w-4 h-4 text-roseNeon" />
                Secret Message / Confession 💌 (Locked until match!)
              </label>
              <Textarea
                placeholder="Koi secret baat ya confession jo compatibility match hone ke baad reveal ho..."
                value={store.creatorSnapshot.secretMessage}
                onChange={(e) =>
                  store.setCreatorSnapshotField('secretMessage', e.target.value)
                }
              />
            </div>

            {/* Social & Unlock Rule */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-400" />
                Contact Exchange & Mutual Unlock
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/70 block mb-1">
                    Instagram Handle
                  </label>
                  <Input
                    placeholder="@yourhandle"
                    value={store.creatorSnapshot.instagramHandle}
                    onChange={(e) =>
                      store.setCreatorSnapshotField(
                        'instagramHandle',
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-white/70 block mb-1">
                    Phone / WhatsApp (Optional)
                  </label>
                  <Input
                    placeholder="+91 9876543210"
                    value={store.creatorSnapshot.phoneNumber}
                    onChange={(e) =>
                      store.setCreatorSnapshotField('phoneNumber', e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Radio cards for Unlock Rule */}
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-2">
                  When Should Your Contact Unlock?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CONTACT_UNLOCK_RULES.map((rule) => (
                    <div
                      key={rule.value}
                      onClick={() =>
                        store.setCreatorSnapshotField('unlockRule', rule.value)
                      }
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        store.creatorSnapshot.unlockRule === rule.value
                          ? 'bg-roseNeon/20 border-roseNeon shadow-lg shadow-roseNeon/20 text-white'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-lg mb-1">{rule.icon}</div>
                      <div className="text-xs font-bold text-white">
                        {rule.title}
                      </div>
                      <div className="text-[11px] text-white/50 mt-1 leading-snug">
                        {rule.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-4">
              <Button
                variant="default"
                size="lg"
                onClick={() => store.nextStep()}
                className="gap-2"
              >
                Proceed to True/False Deck
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: True/False Question Deck */}
        {store.step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Active Question Carousel */}
            {store.questions.length > 0 && (
              <QuestionCard
                questionId={store.questions[activeQuestionIndex].questionId}
                questionNumber={activeQuestionIndex + 1}
                totalQuestions={store.questions.length}
                text={store.questions[activeQuestionIndex].text}
                selectedAnswer={store.questions[activeQuestionIndex].creatorAnswer}
                onAnswer={(ans) => {
                  store.setQuestionAnswer(
                    store.questions[activeQuestionIndex].questionId,
                    ans,
                  );
                  if (activeQuestionIndex < store.questions.length - 1) {
                    setActiveQuestionIndex((prev) => prev + 1);
                  }
                }}
                isCreatorView={true}
              />
            )}

            {/* Question Selector Dots / Numbers */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {store.questions.map((q, idx) => (
                <button
                  key={q.questionId}
                  onClick={() => setActiveQuestionIndex(idx)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeQuestionIndex === idx
                      ? 'bg-roseNeon text-white ring-2 ring-roseNeon shadow-md'
                      : q.creatorAnswer !== undefined
                      ? 'bg-white/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomModal(true)}
                className="gap-1 text-xs"
              >
                <Plus className="w-3.5 h-3.5 text-roseNeon" />
                Add Custom
              </Button>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => store.prevStep()}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Details
              </Button>

              <Button
                variant="default"
                size="lg"
                onClick={() => store.nextStep()}
                className="gap-2"
              >
                Proceed to Security & Expiry
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Security & QR Generation */}
        {store.step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-3xl border border-white/15 bg-white/[0.03] p-7 md:p-9 backdrop-blur-2xl space-y-8 shadow-2xl"
          >
            {/* Single Use Security Badge */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Cryptographically Enforced Single-Use Lock (maxUses: 1)
                </h4>
                <p className="text-xs text-white/70 leading-relaxed mt-1">
                  Once your friend scans and submits this invite, the token is permanently burned. No one else can ever access, replay, or submit this quiz.
                </p>
              </div>
            </div>

            {/* Expiry Timer Selector */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-amber-400" />
                <label className="text-sm font-bold text-white">
                  Set Optional Expiry Timer
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EXPIRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => store.setExpiresInMinutes(opt.minutes)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      store.expiresInMinutes === opt.minutes
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/20'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{opt.label}</div>
                    <div className="text-[11px] text-amber-400 mt-1 font-medium">
                      {opt.tag}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary preview */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-white/70">
                <span>Friend:</span>
                <span className="font-semibold text-white">
                  {store.prefilledFriendName || 'Open Name (Friend enters on scan)'}
                </span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Total True/False Questions:</span>
                <span className="font-semibold text-white">
                  {store.questions.length} Questions
                </span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Contact Unlock:</span>
                <span className="font-semibold text-white">
                  {store.creatorSnapshot.unlockRule}
                </span>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => store.prevStep()}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Questions
              </Button>

              <Button
                variant="default"
                size="lg"
                disabled={loading}
                onClick={handleGenerate}
                className="gap-2 shadow-xl shadow-roseNeon/30"
              >
                <Sparkles className="w-5 h-5 text-white" />
                {loading ? 'Generating 1-of-1 QR...' : 'Generate My Secret QR Now'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* CUSTOM QUESTION MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-3xl border border-white/20 bg-[#120820] p-6 shadow-2xl"
          >
            <h4 className="text-lg font-bold text-white mb-2">
              Add Your Own Question
            </h4>
            <p className="text-xs text-white/60 mb-4">
              Type any dating or vibe question. Both of you will answer True or False!
            </p>

            <form onSubmit={handleAddCustom} className="space-y-4">
              <Textarea
                placeholder="e.g. Kya tum weekend pe movies dekhna prefer karte ho ya clubbing?"
                value={customQuestionText}
                onChange={(e) => setCustomQuestionText(e.target.value)}
                required
              />

              <div>
                <label className="text-xs text-white/70 block mb-2 font-medium">
                  Your Answer:
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomQuestionAnswer(true)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      customQuestionAnswer === true
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-white/60'
                    }`}
                  >
                    TRUE ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomQuestionAnswer(false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      customQuestionAnswer === false
                        ? 'bg-rose-500/25 border-rose-400 text-rose-300'
                        : 'bg-white/5 border-white/10 text-white/60'
                    }`}
                  >
                    FALSE ✕
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="flex-1">
                  Add Question
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
