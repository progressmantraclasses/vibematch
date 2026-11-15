export interface DefaultQuestion {
  questionId: string;
  text: string;
  creatorAnswer: boolean;
}

export const DEFAULT_QUIZ_QUESTIONS: DefaultQuestion[] = [
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
