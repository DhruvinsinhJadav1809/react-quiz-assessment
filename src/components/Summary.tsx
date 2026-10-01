import type { Attempt, Dimension } from '../types';
import { aggregate, fmt } from '../utils';
import { BarChart, LineChart } from './Charts';

const Stat = ({ v, l }: { v: string | number; l: string }) => (
  <div className="stat"><b>{v}</b><span>{l}</span></div>
);

function Rows({ history, k }: { history: Attempt[]; k: Dimension }) {
  const rows = aggregate(history, k);
  if (!rows.length) return <p className="mu">Complete a new attempt to see this breakdown.</p>;
  return (
    <>
      {rows.map((x) => (
        <div className="m" key={x.n} style={{ gridTemplateColumns: '130px 1fr 92px' }}>
          <span title={x.n}>{x.n}</span>
          <div className="bar"><div style={{ width: `${x.p}%` }} /></div>
          <span>{x.p}% · {fmt(x.avg)}</span>
        </div>
      ))}
    </>
  );
}

export default function Summary({ attempts: h, onBack }: { attempts: Attempt[]; onBack: () => void }) {
  if (!h.length) {
    return (
      <div className="card">
        <h1>Overall summary</h1>
        <p className="mu">Finish a quiz to see your progress here.</p>
        <button className="cta" onClick={onBack}>Back to home</button>
      </div>
    );
  }

  const dates = h.map((a) => new Date(a.at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }));
  const timed = h.filter((a) => a.sec != null);
  const timedDates = timed.map((a) => dates[h.indexOf(a)]);
  const tq = h.reduce((s, a) => s + a.t, 0);
  const tc = h.reduce((s, a) => s + a.c, 0);
  const tsec = timed.reduce((s, a) => s + (a.sec ?? 0), 0);
  const tqt = timed.reduce((s, a) => s + a.t, 0);
  const best = Math.max(...h.map((a) => a.pct));
  const trend = h.length > 1 ? h[h.length - 1].pct - h[0].pct : null;
  const topics = aggregate(h, 'topic');
  const strong = topics.filter((x) => x.p >= 70);
  const weak = [...topics].reverse().filter((x) => x.p < 60);
  const avgPerQ = timed.map((a) => (a.sec ?? 0) / a.t);

  return (
    <>
      <div className="top"><button className="ghost" onClick={onBack}>← Back</button><span /></div>

      <div className="card">
        <h1>Overall summary</h1>
        <p className="mu">Based on your last {h.length} attempt{h.length > 1 ? 's' : ''}.</p>
        <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))' }}>
          <Stat v={h.length} l="Attempts" />
          <Stat v={`${Math.round((tc / tq) * 100)}%`} l="Average score" />
          <Stat v={`${best}%`} l="Best score" />
          <Stat v={tq} l="Questions answered" />
          <Stat v={timed.length ? fmt(tsec) : '–'} l="Total time" />
          <Stat v={tqt ? fmt(tsec / tqt) : '–'} l="Avg / question" />
        </div>
        {trend !== null && (
          <p style={{ margin: '14px 0 0' }}>
            {trend > 0 ? '📈 Up' : trend < 0 ? '📉 Down' : '➡️ Flat'} <b>{Math.abs(trend)}%</b> from your first to latest attempt.
          </p>
        )}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Score trend</h3>
        <LineChart vals={h.map((a) => a.pct)} dates={dates} max={100} unit="%" id="score" />
        <h3>Time per attempt</h3>
        {timed.length
          ? <BarChart vals={timed.map((a) => a.sec ?? 0)} dates={timedDates} />
          : <p className="mu">Time data appears after your next attempt.</p>}
        {timed.length > 1 && (
          <>
            <h3>Avg seconds per question</h3>
            <LineChart vals={avgPerQ} dates={timedDates} max={Math.ceil((Math.max(...avgPerQ) * 1.2) / 5) * 5 || 5} unit="s" id="avg" />
          </>
        )}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>💪 Strong topics</h3>
        {strong.length ? strong.map((x) => <span className="tag" key={x.n}>{x.n} {x.p}%</span>) : <span className="mu">None yet.</span>}
        <h3>⚠️ Needs work</h3>
        {weak.length ? weak.map((x) => <span className="tag" key={x.n}>{x.n} {x.p}%</span>) : <span className="mu">Nothing below 60% 🎉</span>}
        <h3>Topics — accuracy · avg time</h3><Rows history={h} k="topic" />
        <h3>Difficulty</h3><Rows history={h} k="difficulty" />
        <h3>Question type</h3><Rows history={h} k="questionType" />
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Attempt history</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 420 }}>
            <thead>
              <tr className="mu" style={{ textAlign: 'left' }}><th>Date</th><th>Score</th><th>Correct</th><th>Time</th><th>Avg/q</th></tr>
            </thead>
            <tbody>
              {[...h].reverse().map((a) => (
                <tr key={a.at} style={{ borderTop: '1px solid var(--bd)' }}>
                  <td style={{ padding: '8px 0' }}>{dates[h.indexOf(a)]}</td>
                  <td><b>{a.pct}%</b></td>
                  <td>{a.c}/{a.t}</td>
                  <td>{a.sec != null ? fmt(a.sec) : '–'}</td>
                  <td>{a.sec != null ? fmt(a.sec / a.t) : '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
