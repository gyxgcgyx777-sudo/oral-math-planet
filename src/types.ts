export type TabKey = "today" | "pet" | "achievements";

export type LessonStep = "today" | "warmup" | "main" | "challenge" | "settlement";

export type ProblemType = "input" | "judge" | "blank" | "findWrong";

export type SkillTag =
  | "numberSense"
  | "carry"
  | "borrow"
  | "multiplyDivide"
  | "speed"
  | "attention";

export interface SkillProfileItem {
  attempts: number;
  correct: number;
  totalDurationMs: number;
  slowCount: number;
  mistakeCount: number;
  lastPracticedAt?: string;
}

export type SkillProfile = Partial<Record<SkillTag, SkillProfileItem>>;

export interface Problem {
  id: string;
  prompt: string;
  answer: number | boolean | string;
  type: ProblemType;
  skill: SkillTag;
  expression?: string;
  wrongSignAnswer?: number;
  hint: string;
  explanation: string;
}

export interface StageConfig {
  id: Extract<LessonStep, "warmup" | "main" | "challenge">;
  title: string;
  subtitle: string;
  scene: string;
  modeLabel: string;
  goalText: string;
  problems: Problem[];
}

export interface DailyLesson {
  title: string;
  theme: string;
  practiceFocus: string;
  duration: string;
  goal: string;
  streakDays: number;
  weekCompleted: number;
  introLines: string[];
}

export interface AnswerRecord {
  problemId: string;
  prompt: string;
  skill: SkillTag;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  attempts: number;
  durationMs: number;
  stage: string;
  note?: string;
}

export interface DailyProgress {
  completedDates: string[];
  totalStars: number;
  badges: string[];
  activeBuddyId: string;
  unlockedBuddyIds: string[];
  buddyShards: Record<string, number>;
  completedRounds: number;
  skillProfile: SkillProfile;
  records: AnswerRecord[];
}

export interface SessionStats {
  answered: number;
  correct: number;
  stars: number;
  slowCount: number;
  signMistakes: number;
  records: AnswerRecord[];
}
