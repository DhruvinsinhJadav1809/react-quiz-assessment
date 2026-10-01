import raw from './data/questions.json';
import type { Answer, Attempt, Breakdown, Config, Dimension, Question } from './types';

export const QUESTIONS = raw as unknown as Question[];

export const uniq = (k: Dimension): string[] => [...new Set(QUESTIONS.map((q) => q[k]))];

export const fmt = (s: number): string =>
  s >= 3600 ? `${Math.floor(s / 3600)}h ${Math.round((s % 3600) / 60)}m`
  : s >= 60 ? `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`
  : `${Math.round(s)}s`;

export function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/** Shuffle options, re-letter them A-D and keep correctAnswer pointing at the right text. */
export function mix(q: Question): Question {
  const right = q.options.find((o) => o.id === q.correctAnswer)!.text;
  const options = shuffle(q.options).map((o, i) => ({ id: 'ABCD'[i], text: o.text }));
  return { ...q, options, correctAnswer: options.find((o) => o.text === right)!.id };
}

export const filterPool = (cfg: Config): Question[] =>
  QUESTIONS.filter(
    (q) => (!cfg.topics.length || cfg.topics.includes(q.topic)) && (!cfg.diffs.length || cfg.diffs.includes(q.difficulty)),
  );

export const pickQuestions = (cfg: Config): Question[] => {
  const pool = filterPool(cfg);
  return shuffle(pool).slice(0, cfg.n === 'All' ? pool.length : cfg.n).map(mix);
};

export function breakdown(answers: Answer[], k: Dimension): Breakdown {
  const m: Breakdown = {};
  answers.forEach((a) => {
    const e = (m[a.q[k]] ??= [0, 0, 0]);
    e[1]++;
    e[2] += a.sec;
    if (a.ok) e[0]++;
  });
  return m;
}

export interface Row { n: string; c: number; t: number; p: number; avg: number }

export function toRows(m: Breakdown): Row[] {
  return Object.entries(m)
    .map(([n, [c, t, s]]) => ({ n, c, t, p: Math.round((c / t) * 100), avg: s / t }))
    .sort((a, b) => b.p - a.p);
}

export function aggregate(history: Attempt[], k: Dimension): Row[] {
  const m: Breakdown = {};
  history.forEach((a) =>
    Object.entries(a[k] ?? {}).forEach(([n, [c, t, s]]) => {
      const e = (m[n] ??= [0, 0, 0]);
      e[0] += c; e[1] += t; e[2] += s;
    }),
  );
  return toRows(m);
}

const KEY = 'rda_hist';
export function loadAttempts(): Attempt[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
export function saveAttempts(a: Attempt[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(a.slice(-30))); } catch { /* storage unavailable */ }
}
