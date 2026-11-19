'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  animate,
  useIsPresent,
  useMotionValue,
  useTransform,
  type PanInfo,
  type Variants,
} from 'framer-motion';
import { Check, X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { HoloCard } from './fx/holo-card';

interface QuestionCardProps {
  questionId: string;
  questionNumber: number;
  totalQuestions: number;
  text: string;
  selectedAnswer?: boolean;
  onAnswer: (answer: boolean) => void;
  isCreatorView?: boolean;
}

const SWIPE_DISTANCE = 110;
const SWIPE_VELOCITY = 600;
const EASE = [0.16, 1, 0.3, 1] as const;

const cardVariants: Variants = {
  enter: { opacity: 0, scale: 0.9, y: 30 },
  center: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  // The exiting card is taken out of flow (absolute) so the incoming card takes its place —
  // a manual "popLayout" (framer's popLayout mode hangs parent AnimatePresence exits when nested).
  exit: (dir: number) =>
    dir === 0
      ? {
          opacity: 0,
          scale: 0.92,
          y: -20,
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          transition: { duration: 0.25 },
        }
      : {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          // rotation follows x through useTransform — don't animate the derived value directly
          x: dir * 520,
          opacity: 0,
          pointerEvents: 'none',
          transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
        },
};

interface SwipeCardProps {
  questionId: string;
  questionNumber: number;
  totalQuestions: number;
  text: string;
  selectedAnswer?: boolean;
  isCreatorView: boolean;
  onAnswer: (answer: boolean) => void;
  /** direction this card flies out on exit (-1 FALSE, 1 TRUE, 0 neutral). Frozen once exiting. */
  flyDir: number;
}

/** One draggable card. Owns its own motion values so enter/exit cards never share state. */
const SwipeCard = React.forwardRef<HTMLDivElement, SwipeCardProps>(function SwipeCard(
  { questionNumber, totalQuestions, text, selectedAnswer, isCreatorView, onAnswer, flyDir },
  ref,
) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-16, 16]);
  const trueOpacity = useTransform(x, [20, SWIPE_DISTANCE], [0, 1]);
  const falseOpacity = useTransform(x, [-SWIPE_DISTANCE, -20], [1, 0]);
  const isPresent = useIsPresent();
  const presentRef = useRef(isPresent);
  presentRef.current = isPresent;

  const answer = (value: boolean) => {
    onAnswer(value);
    // if the parent keeps this card on screen (e.g. last question), settle it back —
    // but never interfere with an exit fly-out that is already running
    setTimeout(() => {
      if (presentRef.current) animate(x, 0, { type: 'spring', stiffness: 300, damping: 26 });
    }, 380);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) answer(true);
    else if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) answer(false);
    else animate(x, 0, { type: 'spring', stiffness: 400, damping: 28 });
  };

  return (
    <HoloCard
      ref={ref}
      accent={selectedAnswer === true ? 'emerald' : selectedAnswer === false ? 'rose' : 'violet'}
      active
      custom={flyDir}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      drag="x"
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
      style={{ x, rotate, touchAction: 'pan-y' }}
      className="relative z-[1] p-6 sm:p-9 cursor-grab select-none !bg-[#120820]/80 overflow-hidden"
    >
      {/* swipe tints */}
      <motion.div
        aria-hidden
        style={{ opacity: trueOpacity }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_85%_50%,rgba(52,211,153,0.35),transparent_60%)]"
      />
      <motion.div
        aria-hidden
        style={{ opacity: falseOpacity }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_15%_50%,rgba(255,51,102,0.35),transparent_60%)]"
      />
      <motion.div
        aria-hidden
        style={{ opacity: trueOpacity }}
        className="pointer-events-none absolute top-14 right-4 sm:right-8 px-3 py-1 rounded-lg border-2 border-emerald-400 text-emerald-300 font-display font-black text-sm rotate-12 z-10"
      >
        TRUE
      </motion.div>
      <motion.div
        aria-hidden
        style={{ opacity: falseOpacity }}
        className="pointer-events-none absolute top-14 left-4 sm:left-8 px-3 py-1 rounded-lg border-2 border-roseNeon text-rose-300 font-display font-black text-sm -rotate-12 z-10"
      >
        FALSE
      </motion.div>

      {/* watermark number */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 font-display text-[9rem] sm:text-[11rem] font-black leading-none text-white/[0.035]"
      >
        {String(questionNumber).padStart(2, '0')}
      </span>

      {/* header */}
      <div className="relative flex items-center justify-between gap-3 mb-4">
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/[0.06] border border-white/10 text-white/70 font-mono">
          {String(questionNumber).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
        </span>
        <span className="text-[11px] font-semibold flex items-center gap-1.5 text-rose-300">
          <Sparkles className="w-3.5 h-3.5 text-roseNeon" />
          {isCreatorView ? 'Your Secret Choice 🤫' : 'Pick your true vibe'}
        </span>
      </div>

      {/* question */}
      <div className="relative min-h-[130px] sm:min-h-[150px] flex items-center justify-center text-center my-4 px-1">
        <motion.h3
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-xl sm:text-2xl md:text-[1.75rem] font-bold text-white leading-snug tracking-tight"
        >
          {text}
        </motion.h3>
      </div>

      {/* mirrored answer buttons: FALSE (left) | TRUE (right) — matches swipe direction */}
      <div className="relative grid grid-cols-2 gap-3 sm:gap-4 mt-6">
        {[
          { val: false, label: 'FALSE', sub: 'Nah, not for me 🙅', Icon: X },
          { val: true, label: 'TRUE', sub: 'Haan, bilkul! ✨', Icon: Check },
        ].map(({ val, label, sub, Icon }) => {
          const selected = selectedAnswer === val;
          const isTrue = val;
          return (
            <motion.button
              key={label}
              type="button"
              onPointerDownCapture={(e) => e.stopPropagation()}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => answer(val)}
              className={cn(
                'group relative flex flex-col items-center justify-center py-5 sm:py-6 px-3 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden',
                selected
                  ? isTrue
                    ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_12px_30px_-10px_rgba(52,211,153,0.8)]'
                    : 'bg-roseNeon/20 border-roseNeon shadow-[0_12px_30px_-10px_rgba(255,51,102,0.8)]'
                  : isTrue
                    ? 'bg-white/[0.04] border-white/10 hover:border-emerald-400/50 hover:bg-emerald-500/[0.07]'
                    : 'bg-white/[0.04] border-white/10 hover:border-roseNeon/50 hover:bg-roseNeon/[0.07]',
              )}
            >
              {selected && (
                <span
                  className={cn(
                    'absolute inset-0 rounded-2xl',
                    isTrue
                      ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.35),transparent_70%)]'
                      : 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,51,102,0.35),transparent_70%)]',
                  )}
                />
              )}
              <div
                className={cn(
                  'relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl grid place-items-center mb-2.5 transition-all duration-300',
                  selected
                    ? isTrue
                      ? 'bg-emerald-500 text-white shadow-[0_0_24px_rgba(52,211,153,0.8)] scale-110'
                      : 'bg-roseNeon text-white shadow-[0_0_24px_rgba(255,51,102,0.8)] scale-110'
                    : isTrue
                      ? 'bg-white/10 text-white/70 group-hover:bg-emerald-500/25 group-hover:text-emerald-300'
                      : 'bg-white/10 text-white/70 group-hover:bg-roseNeon/25 group-hover:text-rose-300',
                )}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={3} />
              </div>
              <span
                className={cn(
                  'relative font-display font-black text-sm sm:text-base tracking-[0.2em]',
                  selected ? (isTrue ? 'text-emerald-300' : 'text-rose-300') : 'text-white/85',
                )}
              >
                {label}
              </span>
              <span className="relative text-[10px] sm:text-xs text-white/45 mt-1 font-medium">{sub}</span>
            </motion.button>
          );
        })}
      </div>

      {/* swipe hint */}
      <div className="relative flex items-center justify-center gap-2 mt-5 text-[10px] sm:text-[11px] text-white/35 font-semibold uppercase tracking-[0.2em]">
        <motion.span animate={{ x: [0, -4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronLeft className="w-3.5 h-3.5" />
        </motion.span>
        Swipe or use ← →
        <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.span>
      </div>
    </HoloCard>
  );
});

export function QuestionCard({
  questionId,
  questionNumber,
  totalQuestions,
  text,
  selectedAnswer,
  onAnswer,
  isCreatorView = false,
}: QuestionCardProps) {
  // Remember which card was answered and in which direction. The exiting card's props are
  // frozen by AnimatePresence, so its fly-out direction never changes mid-exit.
  const [lastAnswer, setLastAnswer] = useState<{ id: string; dir: number }>({ id: '', dir: 0 });
  const remaining = Math.max(0, Math.min(2, totalQuestions - questionNumber));

  const handleAnswer = useCallback(
    (value: boolean) => {
      setLastAnswer({ id: questionId, dir: value ? 1 : -1 });
      onAnswer(value);
    },
    [onAnswer, questionId],
  );

  // keyboard: ← FALSE, → TRUE
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.repeat) return;
      if (e.key === 'ArrowRight') handleAnswer(true);
      if (e.key === 'ArrowLeft') handleAnswer(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleAnswer]);

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* segmented progress */}
      <div className="flex items-center gap-1.5 mb-5 px-1" aria-label={`Question ${questionNumber} of ${totalQuestions}`}>
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div key={i} className="relative flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-roseNeon to-electricViolet shadow-[0_0_10px_rgba(255,51,102,0.8)]"
              initial={false}
              animate={{ scaleX: i < questionNumber ? 1 : 0 }}
              style={{ originX: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
        ))}
      </div>

      <div className="relative" style={{ paddingBottom: remaining * 12 }}>
        {/* ghost stack behind */}
        {Array.from({ length: remaining }).map((_, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute inset-x-0 top-0 rounded-[1.75rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all duration-500"
            style={{
              bottom: remaining * 12,
              transform: `translateY(${(i + 1) * 12}px) scale(${1 - (i + 1) * 0.05})`,
              transformOrigin: 'center bottom',
              opacity: 0.8 - i * 0.3,
            }}
          />
        ))}

        <AnimatePresence initial={false}>
          <SwipeCard
            key={questionId}
            flyDir={lastAnswer.id === questionId ? lastAnswer.dir : 0}
            questionId={questionId}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            text={text}
            selectedAnswer={selectedAnswer}
            isCreatorView={isCreatorView}
            onAnswer={handleAnswer}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
