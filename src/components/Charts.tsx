import { fmt } from '../utils';

const W = 600, H = 210, P = 30;
const lbl = { fontSize: 11, fill: 'var(--mu)' } as const;

interface LineProps { vals: number[]; dates: string[]; max: number; unit: string; id: string }

export function LineChart({ vals, dates, max, unit, id }: LineProps) {
  const n = vals.length;
  const x = (i: number) => (n === 1 ? W / 2 : P + (i * (W - 2 * P)) / (n - 1));
  const y = (v: number) => H - P - (v / max) * (H - 2 * P);
  const pts = vals.map((v, i) => [x(i), y(v)]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const step = Math.ceil(n / 10);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }} role="img" aria-label="Line chart">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--ac)', stopOpacity: 0.35 }} />
          <stop offset="1" style={{ stopColor: 'var(--ac)', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={P} x2={W - P} y1={y(max * f)} y2={y(max * f)} style={{ stroke: 'var(--bd)' }} />
          <text x={P - 6} y={y(max * f) + 4} textAnchor="end" style={lbl}>{Math.round(max * f)}{unit}</text>
        </g>
      ))}
      {n > 1 && (
        <>
          <path d={`${d} L${pts[n - 1][0]} ${H - P} L${pts[0][0]} ${H - P}Z`} fill={`url(#g${id})`} />
          <path d={d} fill="none" strokeWidth={3} strokeLinejoin="round" style={{ stroke: 'var(--ac)' }} />
        </>
      )}
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={5} strokeWidth={3} style={{ fill: 'var(--card)', stroke: 'var(--ac)' }}>
          <title>{dates[i]}: {Math.round(vals[i])}{unit}</title>
        </circle>
      ))}
      {vals.map((_, i) => i % step === 0 && (
        <text key={i} x={x(i)} y={H - 8} textAnchor="middle" style={lbl}>#{i + 1}</text>
      ))}
    </svg>
  );
}

export function BarChart({ vals, dates }: { vals: number[]; dates: string[] }) {
  const n = vals.length;
  const max = Math.max(...vals, 1) * 1.15;
  const bw = Math.min(46, ((W - 2 * P) / n) * 0.6);
  const step = Math.ceil(n / 10);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }} role="img" aria-label="Bar chart">
      <line x1={P} x2={W - P} y1={H - P} y2={H - P} style={{ stroke: 'var(--bd)' }} />
      {vals.map((v, i) => {
        const cx = P + ((i + 0.5) * (W - 2 * P)) / n;
        const h = (v / max) * (H - 2 * P);
        return (
          <g key={i}>
            <rect x={cx - bw / 2} y={H - P - h} width={bw} height={h} rx={6} style={{ fill: 'var(--ac2)' }}>
              <title>{dates[i]}: {fmt(v)}</title>
            </rect>
            {n <= 12 && <text x={cx} y={H - P - h - 5} textAnchor="middle" style={lbl}>{fmt(v)}</text>}
            {i % step === 0 && <text x={cx} y={H - 8} textAnchor="middle" style={lbl}>#{i + 1}</text>}
          </g>
        );
      })}
    </svg>
  );
}
