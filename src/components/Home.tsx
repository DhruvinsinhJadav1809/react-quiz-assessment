import type { Attempt, Config } from '../types';
import { filterPool, QUESTIONS, uniq } from '../utils';

interface Props {
  cfg: Config;
  setCfg: (c: Config) => void;
  attempts: Attempt[];
  onStart: () => void;
  onSummary: () => void;
  onClear: () => void;
}

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
const outline = { background: 'var(--card)', color: 'var(--tx)', border: '1px solid var(--bd)', boxShadow: 'none' };

export default function Home({ cfg, setCfg, attempts, onStart, onSummary, onClear }: Props) {
  const pool = filterPool(cfg);
  const count = cfg.n === 'All' ? pool.length : Math.min(cfg.n, pool.length);
  const best = attempts.length ? Math.max(...attempts.map((a) => a.pct)) : null;

  return (
    <div className="card">
      <h1>Test your React skills</h1>
      <p className="mu">
        {QUESTIONS.length} questions · {uniq('topic').length} topics · instant explanations & a detailed skill report.
      </p>
      <div className="stats">
        <div className="stat"><b>{QUESTIONS.length}</b><span>Questions</span></div>
        <div className="stat"><b>{attempts.length}</b><span>Attempts</span></div>
        <div className="stat"><b>{best === null ? '–' : `${best}%`}</b><span>Best score</span></div>
      </div>

      {attempts.length > 0 && (
        <button className="cta" style={{ marginTop: 16, ...outline }} onClick={onSummary}>📊 Overall summary</button>
      )}

      <h3>Topics <small>(none = all)</small></h3>
      <div className="chips">
        {uniq('topic').map((t) => (
          <button key={t} className={`chip ${cfg.topics.includes(t) ? 'on' : ''}`}
            onClick={() => setCfg({ ...cfg, topics: toggle(cfg.topics, t) })}>{t}</button>
        ))}
      </div>

      <h3>Difficulty</h3>
      <div className="chips">
        {['Easy', 'Medium', 'Hard'].map((d) => (
          <button key={d} className={`chip ${cfg.diffs.includes(d) ? 'on' : ''}`}
            onClick={() => setCfg({ ...cfg, diffs: toggle(cfg.diffs, d) })}>{d}</button>
        ))}
      </div>

      <h3>Number of questions</h3>
      <div className="chips">
        {([10, 20, 30, 'All'] as const).map((n) => (
          <button key={n} className={`chip ${cfg.n === n ? 'on' : ''}`} onClick={() => setCfg({ ...cfg, n })}>{n}</button>
        ))}
        <button className={`chip ${cfg.timed ? 'on' : ''}`} onClick={() => setCfg({ ...cfg, timed: !cfg.timed })}>
          ⏱ Timer {cfg.timed ? 'on' : 'off'}
        </button>
      </div>

      <button className="cta" disabled={!pool.length} onClick={onStart}>Start quiz ({count} questions)</button>

      {attempts.length > 0 && (
        <>
          <h3>
            Recent attempts
            <button className="chip" style={{ marginLeft: 8, textTransform: 'none', letterSpacing: 0 }} onClick={onClear}>Clear</button>
          </h3>
          {attempts.slice(-5).reverse().map((a) => (
            <div className="m" key={a.at}>
              <span>{new Date(a.at).toLocaleDateString()}</span>
              <div className="bar"><div style={{ width: `${a.pct}%` }} /></div>
              <span>{a.pct}%</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
