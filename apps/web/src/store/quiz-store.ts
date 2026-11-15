import { create } from 'zustand';
import {
  DEFAULT_TRUE_FALSE_QUESTIONS,
  TrueFalseQuestion,
} from '../lib/constants';

interface CreatorWizardState {
  step: number;
  prefilledFriendName: string;
  creatorSnapshot: {
    name: string;
    avatarEmoji: string;
    tagline: string;
    bio: string;
    secretMessage: string;
    instagramHandle: string;
    phoneNumber: string;
    unlockRule: 'MUTUAL_ONLY' | 'SCORE_THRESHOLD' | 'ALWAYS_ON_COMPLETE';
    minScorePercent: number;
  };
  questions: TrueFalseQuestion[];
  expiresInMinutes: number | null;
  generatedInvite: any | null;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPrefilledFriendName: (name: string) => void;
  setCreatorSnapshotField: (field: string, value: any) => void;
  setQuestionAnswer: (questionId: string, answer: boolean) => void;
  addCustomQuestion: (text: string, answer: boolean) => void;
  removeQuestion: (questionId: string) => void;
  setExpiresInMinutes: (minutes: number | null) => void;
  setGeneratedInvite: (invite: any) => void;
  resetCreatorWizard: () => void;
}

export const useCreatorWizardStore = create<CreatorWizardState>((set) => ({
  step: 1,
  prefilledFriendName: '',
  creatorSnapshot: {
    name: '',
    avatarEmoji: '😎',
    tagline: 'Living life on full volume ✨',
    bio: '',
    secretMessage: '',
    instagramHandle: '',
    phoneNumber: '',
    unlockRule: 'MUTUAL_ONLY',
    minScorePercent: 70,
  },
  questions: DEFAULT_TRUE_FALSE_QUESTIONS.map((q) => ({ ...q })),
  expiresInMinutes: 1440, // 24 hours default
  generatedInvite: null,

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(3, state.step + 1) })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  setPrefilledFriendName: (name) => set({ prefilledFriendName: name }),
  setCreatorSnapshotField: (field, value) =>
    set((state) => ({
      creatorSnapshot: { ...state.creatorSnapshot, [field]: value },
    })),
  setQuestionAnswer: (questionId, answer) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.questionId === questionId ? { ...q, creatorAnswer: answer } : q,
      ),
    })),
  addCustomQuestion: (text, answer) =>
    set((state) => ({
      questions: [
        ...state.questions,
        {
          questionId: `custom_${Date.now()}`,
          text,
          creatorAnswer: answer,
        },
      ],
    })),
  removeQuestion: (questionId) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.questionId !== questionId),
    })),
  setExpiresInMinutes: (expiresInMinutes) => set({ expiresInMinutes }),
  setGeneratedInvite: (generatedInvite) => set({ generatedInvite }),
  resetCreatorWizard: () =>
    set({
      step: 1,
      prefilledFriendName: '',
      questions: DEFAULT_TRUE_FALSE_QUESTIONS.map((q) => ({ ...q })),
      expiresInMinutes: 1440,
      generatedInvite: null,
    }),
}));

interface FriendPlayState {
  responderDisplayName: string;
  responderMoodTag: string;
  responderAboutMe: string;
  responderSecretMessage: string;
  responderSharedContact: boolean;
  responderInstagram: string;
  responderPhone: string;
  answers: Record<string, boolean>;

  setField: (field: string, value: any) => void;
  setAnswer: (questionId: string, answer: boolean) => void;
  resetPlayState: () => void;
}

export const useFriendPlayStore = create<FriendPlayState>((set) => ({
  responderDisplayName: '',
  responderMoodTag: '💫 Dreamy',
  responderAboutMe: '',
  responderSecretMessage: '',
  responderSharedContact: false,
  responderInstagram: '',
  responderPhone: '',
  answers: {},

  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  resetPlayState: () =>
    set({
      responderDisplayName: '',
      responderMoodTag: '💫 Dreamy',
      responderAboutMe: '',
      responderSecretMessage: '',
      responderSharedContact: false,
      responderInstagram: '',
      responderPhone: '',
      answers: {},
    }),
}));
