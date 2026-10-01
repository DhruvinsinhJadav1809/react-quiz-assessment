export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionType = 'conceptual' | 'code' | 'output' | 'debugging' | 'scenario';
export type Dimension = 'topic' | 'difficulty' | 'questionType';

export interface Option { id: string; text: string }

export interface Question {
  id: number;
  topic: string;
  subtopic: string;
  difficulty: Difficulty;
  questionType: QuestionType;
  question: string;
  code: string | null;
  options: Option[];
  correctAnswer: string;
  explanation: string;
}

export interface Answer { q: Question; picked: string; ok: boolean; sec: number }

/** name -> [correct, total, seconds] */
export type Breakdown = Record<string, [number, number, number]>;

export interface Attempt {
  at: number;
  pct: number;
  c: number;
  t: number;
  sec?: number;
  topic?: Breakdown;
  difficulty?: Breakdown;
  questionType?: Breakdown;
}

export interface Config {
  topics: string[];
  diffs: string[];
  n: number | 'All';
  timed: boolean;
}
