'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface QuestionCardProps {
  questionId: string;
  questionNumber: number;
  totalQuestions: number;
  text: string;
  selectedAnswer?: boolean;
  onAnswer: (answer: boolean) => void;
  isCreatorView?: boolean;
}

export function QuestionCard({
  questionNumber,
  totalQuestions,
  text,
  selectedAnswer,
  onAnswer,
  isCreatorView = false,
}: QuestionCardProps) {
  const progressPercent = Math.round((questionNumber / totalQuestions) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto rounded-3xl border border-white/20 bg-gradient-to-b from-[#1b092e]/90 via-[#0f071a]/90 to-[#0b0414]/90 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
    >
      {/* Top Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-roseNeon via-electricViolet to-warmAmber" />

      {/* Progress & Badge Header */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-roseNeon/20 border border-roseNeon/35 text-rose-300 shadow-sm shadow-roseNeon/15">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-xs text-white/40 font-mono hidden sm:inline">
            ({progressPercent}% complete)
          </span>
        </div>

        {isCreatorView ? (
          <span className="text-xs text-white/60 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-roseNeon" />
            Your Secret Choice 🤫
          </span>
        ) : (
          <span className="text-xs text-rose-300 font-semibold flex items-center gap-1">
            Pick your true vibe ✨
          </span>
        )}
      </div>

      {/* Question Text with fluid typography */}
      <div className="min-h-[110px] sm:min-h-[130px] flex items-center justify-center text-center my-4 px-2">
        <AnimatePresence mode="wait">
          <motion.h3
            key={text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug sm:leading-relaxed tracking-tight"
          >
            {text}
          </motion.h3>
        </AnimatePresence>
      </div>

      {/* True / False Tactile Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 mt-8">
        {/* TRUE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => onAnswer(true)}
          className={cn(
            'flex flex-col items-center justify-center py-5 sm:py-6 px-4 rounded-2xl border transition-all duration-300 cursor-pointer shadow-lg relative group',
            selectedAnswer === true
              ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-emerald-500/35 ring-2 ring-emerald-400/50'
              : 'bg-white/5 border-white/15 text-white/85 hover:bg-white/10 hover:border-emerald-500/40 hover:text-white',
          )}
        >
          <div
            className={cn(
              'w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-2.5 transition-all shadow-md',
              selectedAnswer === true
                ? 'bg-emerald-500 text-white shadow-emerald-500/50 scale-105'
                : 'bg-white/10 text-white/70 group-hover:bg-emerald-500/20 group-hover:text-emerald-300',
            )}
          >
            <Check className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
          </div>
          <span className="font-black text-base sm:text-lg tracking-wider">TRUE</span>
          <span className="text-[11px] sm:text-xs text-white/50 mt-1 font-medium">Haan, bilkul! ✨</span>
        </motion.button>

        {/* FALSE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => onAnswer(false)}
          className={cn(
            'flex flex-col items-center justify-center py-5 sm:py-6 px-4 rounded-2xl border transition-all duration-300 cursor-pointer shadow-lg relative group',
            selectedAnswer === false
              ? 'bg-rose-500/25 border-rose-400 text-rose-300 shadow-rose-500/35 ring-2 ring-rose-400/50'
              : 'bg-white/5 border-white/15 text-white/85 hover:bg-white/10 hover:border-rose-500/40 hover:text-white',
          )}
        >
          <div
            className={cn(
              'w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-2.5 transition-all shadow-md',
              selectedAnswer === false
                ? 'bg-roseNeon text-white shadow-roseNeon/50 scale-105'
                : 'bg-white/10 text-white/70 group-hover:bg-roseNeon/20 group-hover:text-rose-300',
            )}
          >
            <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
          </div>
          <span className="font-black text-base sm:text-lg tracking-wider">FALSE</span>
          <span className="text-[11px] sm:text-xs text-white/50 mt-1 font-medium">Nah, not for me 🙅‍♂️</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
