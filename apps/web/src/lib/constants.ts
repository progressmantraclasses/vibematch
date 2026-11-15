export const APP_NAME = 'DilSe VibeMatch';
export const APP_TAGLINE = 'Secret Friend & Crush Compatibility Platform ✨';

export interface TrueFalseQuestion {
  questionId: string;
  text: string;
  creatorAnswer?: boolean;
}

export const DEFAULT_TRUE_FALSE_QUESTIONS: TrueFalseQuestion[] = [
  {
    questionId: 'q1',
    text: 'Kya tum late night deep conversations enjoy karte ho? (Do you enjoy late night deep talks?)',
    creatorAnswer: true,
  },
  {
    questionId: 'q2',
    text: 'Kya tumhe lagta hai ki pyaar mein pehle strong friendship zaroori hai?',
    creatorAnswer: true,
  },
  {
    questionId: 'q3',
    text: 'Kya tum relationship mein spontaneous surprises and small gestures pasand karte ho?',
    creatorAnswer: true,
  },
  {
    questionId: 'q4',
    text: 'Kya tumhe monsoon/rain mein chai-coffee ke saath time spend karna romantic lagta hai?',
    creatorAnswer: true,
  },
  {
    questionId: 'q5',
    text: 'Kya tum apne special someone ke saath unplanned road trips pe nikal jaana chahoge?',
    creatorAnswer: true,
  },
  {
    questionId: 'q6',
    text: 'Kya tumhe cheesy pickup lines aur cute banter cute lagti hain?',
    creatorAnswer: true,
  },
  {
    questionId: 'q7',
    text: 'Kya tum past heartbreak ke baad bhi true love and soulmate connection mein believe karte ho?',
    creatorAnswer: true,
  },
  {
    questionId: 'q8',
    text: 'Kya tumhare liye deep emotional connection physical attraction se pehle aati hai?',
    creatorAnswer: true,
  },
];

export const EXPIRY_OPTIONS = [
  { label: '15 Minutes', minutes: 15, tag: '⚡ Quick Vibe' },
  { label: '1 Hour', minutes: 60, tag: '⏱️ High Urgency' },
  { label: '6 Hours', minutes: 360, tag: '🌅 Today Only' },
  { label: '24 Hours', minutes: 1440, tag: '🌙 1 Day' },
  { label: '7 Days', minutes: 10080, tag: '🗓️ 1 Week' },
  { label: 'No Expiry', minutes: null, tag: '♾️ 1-Use Lock' },
];

export const CONTACT_UNLOCK_RULES = [
  {
    value: 'MUTUAL_ONLY',
    title: 'Mutual Consent 🤝',
    description: 'Unlock my Instagram/WhatsApp ONLY if my friend also shares theirs.',
    icon: '🤝',
  },
  {
    value: 'SCORE_THRESHOLD',
    title: 'High Vibe Match 🎯',
    description: 'Unlock my contact only if our compatibility score is 70% or higher.',
    icon: '🎯',
  },
  {
    value: 'ALWAYS_ON_COMPLETE',
    title: 'Always Reveal 💝',
    description: 'Unlock my contact as soon as they finish answering the quiz.',
    icon: '💝',
  },
];

export const MOOD_TAGS = [
  { id: 'romantic', label: '😍 Romantic', emoji: '😍' },
  { id: 'cute', label: '🥰 Cute & Shy', emoji: '🥰' },
  { id: 'chill', label: '😎 Chill & Fun', emoji: '😎' },
  { id: 'bold', label: '🔥 Bold & Flirty', emoji: '🔥' },
  { id: 'dreamy', label: '💫 Dreamy Soul', emoji: '💫' },
];

export const COLOR_TOKENS = {
  velvetNight: '#0b0714',
  roseNeon: '#ff3366',
  electricViolet: '#a855f7',
  warmAmber: '#fbbf24',
  deepPlum: '#1a0a2e',
  cardGlass: 'rgba(255, 255, 255, 0.05)',
} as const;
