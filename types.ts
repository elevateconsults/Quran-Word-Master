export interface Word {
  id: string;
  arabic: string;
  english: string;
  transliteration: string;
  root?: string;
  context?: string; // e.g. "Al-Baqarah 2:5"
  source: 'quranic' | 'user-added';
  masteryLevel: number; // 0-5
  lastReviewed?: number; // timestamp
  isBookmarked?: boolean; // True if added to user's personal practice list
}

export interface Settings {
  notificationsEnabled: boolean;
  notificationFrequency: number; // in minutes
  activeHourStart: number; // 0-23
  activeHourEnd: number; // 0-23
  lockScreenEnabled: boolean;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
}

export interface QuizQuestion {
  id: string;
  questionWord: Word;
  options: string[]; // 4 english meanings
  correctAnswer: string;
}

export interface QuizResult {
  total: number;
  correct: number;
}