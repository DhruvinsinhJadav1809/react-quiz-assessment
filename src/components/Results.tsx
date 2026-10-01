import type { CSSProperties } from 'react';
import type { Answer, Dimension } from '../types';
import { breakdown, toRows } from '../utils';

interface Props {
  answers: Answer[];
  onAgain: () => void;
  onHome: () => void;
  onSummary: () => void;
}

const outline: CSSProperties = { background: 'var(--card)', color: 'var(--tx)', border: '1px solid var(--bd)', boxShadow: 'none' };

function Bars({ answers, k }: { answers: Answer[]; k: Dimension }) {
  return (
    <>
      {toRows(breakdown(answers, k)).map((x) => (
        <div className="m" key={x.n}>
          <span title={x.n}>{x.n}</span>
          <div className="bar"><div style={{ width: `${x.p}%` }} /></div>
          <span>{x.c}/{x.t}</span>
        </div>
      ))}
    </>
  );
}

export default function Results({ answers, onAgain, onHome, onSummary }: Props) {
  const t = answers.length;
  const c = answers.filter((a) => a.ok).length;
  const pct = Math.round((c / t) * 100);
  const avg = Math.round(answers.reduce((s, a) => s + a.sec, 0) / t);
  const topics = toRows(breakdown(answers, 'topic'));
  const strong = topics.filter((x) => x.p >= 70);
  const weak = [...topics].reverse().filter((x) => x.p < 60);
  const msg = pct >= 85 ? 'Outstanding! 🏆' : pct >= 70 ? 'Great work! 🔥' : pct >= 50 ? 'Good start — keep going 💪' : 'Time to revise 📚';

  return (
    <>
      <div className="card" style={{ textAlign: 'center' }}>
        <h1>{msg}</h1>
        <div className="ring" style={{ '--p': pct } as CSSProperties}><div>{pct}%</div></div>
        <p className="mu">{c} correct · {t - c} incorrect · avg {avg}s / question</p>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>💪 Strong topics</h3>
        {strong.length ? strong.map((x) => <span className="tag" key={x.n}>{x.n} {x.p}%</span>) : <span className="mu">None yet — keep practising.</span>}
        <h3>⚠️ Weak topics</h3>
        {weak.length ? weak.map((x) => <span className="tag" key={x.n}>{x.n} {x.p}%</span>) : <span className="mu">No weak topics 🎉</span>}
        <h3>By topic</h3><Bars answers={answers} k="topic" />
        <h3>By difficulty</h3><Bars answers={answers} k="difficulty" />
        <h3>By question type</h3><Bars answers={answers} k="questionType" />
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Review answers</h3>
        {answers.map((a, i) => (
          <details className="rv" key={a.q.id}>
            <summary>{a.ok ? '✅' : '❌'} <span>{i + 1}. {a.q.question}</span></summary>
            {a.q.code && <pre><code>{a.q.code}</code></pre>}
            <p>
              Your answer: <b>{a.picked}</b> · Correct: <b>{a.q.correctAnswer}</b> — {a.q.options.find((o) => o.id === a.q.correctAnswer)?.text}
            </p>
            <p className="mu">{a.q.explanation}</p>
          </details>
        ))}
      </div>

      <div className="row">
        <button className="cta" onClick={onAgain}>Try again 🔁</button>
        <button className="cta" style={outline} onClick={onSummary}>📊 Overall summary</button>
        <button className="cta" style={outline} onClick={onHome}>Home</button>
      </div>
    </>
  );
}
