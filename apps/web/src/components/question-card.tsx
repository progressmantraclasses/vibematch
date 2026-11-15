'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-lg mx-auto rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 via-white/[0.04] to-transparent p-7 md:p-9 shadow-2xl backdrop-blur-2xl"
    >
      {/* Progress & Badge Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-roseNeon/15 border border-roseNeon/30 text-rose-300">
          Question {questionNumber} of {totalQuestions}
        </span>
        {isCreatorView && (
          <span className="text-xs text-white/50 font-medium">
            Your Secret Answer 🤫
          </span>
        )}
      </div>

      {/* Question Text */}
      <div className="min-h-[100px] flex items-center justify-center text-center my-4">
        <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
          {text}
        </h3>
      </div>

      {/* True / False Tactile Buttons */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAnswer(true)}
          className={cn(
            'flex flex-col items-center justify-center py-5 px-4 rounded-2xl border transition-all duration-300 cursor-pointer shadow-lg',
            selectedAnswer === true
              ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-emerald-500/30 ring-2 ring-emerald-400/50'
              : 'bg-white/5 border-white/15 text-white/80 hover:bg-white/10 hover:border-emerald-500/40 hover:text-white',
          )}
        >
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors',
              selectedAnswer === true
                ? 'bg-emerald-500 text-white'
                : 'bg-white/10 text-white/70',
            )}
          >
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="font-bold text-base tracking-wide">TRUE</span>
          <span className="text-xs text-white/50 mt-0.5">Haan, bilkul!</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAnswer(false)}
          className={cn(
            'flex flex-col items-center justify-center py-5 px-4 rounded-2xl border transition-all duration-300 cursor-pointer shadow-lg',
            selectedAnswer === false
              ? 'bg-rose-500/25 border-rose-400 text-rose-300 shadow-rose-500/30 ring-2 ring-rose-400/50'
              : 'bg-white/5 border-white/15 text-white/80 hover:bg-white/10 hover:border-rose-500/40 hover:text-white',
          )}
        >
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors',
              selectedAnswer === false
                ? 'bg-roseNeon text-white'
                : 'bg-white/10 text-white/70',
            )}
          >
            <X className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="font-bold text-base tracking-wide">FALSE</span>
          <span className="text-xs text-white/50 mt-0.5">Nah, not for me</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
