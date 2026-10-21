import { useState, type CSSProperties } from "react";
import Mascot from "./Mascot";
import { useCountUp } from "../hooks";
import type { Attempt, Config } from "../types";
import { filterPool, fmt, QUESTIONS, uniq } from "../utils";

interface Props {
  cfg: Config;
  setCfg: (c: Config) => void;
  attempts: Attempt[];
  onStart: () => void;
  onSummary: () => void;
  onClear: () => void;
}

const ICONS: [string, string][] = [
  ["hook", "🪝"],
  ["state", "🗃️"],
  ["perform", "⚡"],
  ["test", "🧪"],
  ["secur", "🔒"],
  ["advanc", "🚀"],
  ["fundament", "📘"],
  ["rout", "🧭"],
  ["form", "📝"],
  ["api", "🌐"],
  ["data", "🌐"],
  ["style", "🎨"],
  ["css", "🎨"],
  ["access", "♿"],
  ["type", "🔷"],
  ["pattern", "🧩"],
  ["server", "🖥️"],
  ["ssr", "🖥️"],
  ["tool", "🛠️"],
  ["build", "🛠️"],
];
const iconFor = (t: string) =>
  ICONS.find(([k]) => t.toLowerCase().includes(k))?.[1] ?? "⚛️";
const DIFFS = [
  { k: "Easy", e: "🌱" },
  { k: "Medium", e: "🔥" },
  { k: "Hard", e: "💀" },
];
const toggle = (list: string[], v: string) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
const scoreClass = (p: number) => (p >= 70 ? "good" : p >= 50 ? "mid" : "low");

function Stat({
  icon,
  value,
  label,
  suffix = "",
}: {
  icon: string;
  value: number | null;
  label: string;
  suffix?: string;
}) {
  const v = useCountUp(value ?? 0, 900);
  return (
    <div className="hstat">
      <span className="hico">{icon}</span>
      <b>{value === null ? "–" : `${v}${suffix}`}</b>
      <span>{label}</span>
    </div>
  );
}

export default function Home({
  cfg,
  setCfg,
  attempts,
  onStart,
  onSummary,
  onClear,
}: Props) {
  const pool = filterPool(cfg);
  const count = cfg.n === "All" ? pool.length : Math.min(cfg.n, pool.length);
  const best = attempts.length ? Math.max(...attempts.map((a) => a.pct)) : null;
  const topics = uniq("topic");
  const perTopic = (t: string) => QUESTIONS.filter((q) => q.topic === t).length;
  const [topicsOpen, setTopicsOpen] = useState(true);
  return (
    <div className="stack">
      <section className="hero card">
        <span className="pill">⚛ React Developer Assessment</span>
        <h1>Test your React skills</h1>
        <p className="mu">
          Pick your topics, beat the clock and get a full skill report with
          instant explanations.
        </p>
        <div className="hstats">
          <Stat icon="📚" value={QUESTIONS.length} label="Questions" />
          <Stat icon="🎯" value={attempts.length} label="Attempts" />
          <Stat icon="🏆" value={best} label="Best score" suffix="%" />
        </div>
        <div className="stage hstage">
          <Mascot mood="hello" seed={0} />
        </div>
      </section>

      {attempts.length > 0 && (
        <button className="tile" onClick={onSummary}>
          <span className="tile-ico">📊</span>
          <span className="tile-txt">
            <b>Overall summary</b>
            <small>
              Charts, time & strengths from {attempts.length} attempt
              {attempts.length > 1 ? "s" : ""}
            </small>
          </span>
          <span className="tile-go">→</span>
        </button>
      )}

      <section className="card">
        <div className="sec-h">
          <button
            className="coll-h"
            onClick={() => setTopicsOpen((o) => !o)}
            aria-expanded={topicsOpen}
          >
            <span className="coll-t">1 · Choose topics</span>
            <span className="mu small">
              {cfg.topics.length
                ? `${cfg.topics.length} selected`
                : "All topics"}
            </span>
            <span className="chev" />
          </button>
          {cfg.topics.length > 0 && (
            <button
              className="link"
              onClick={() => setCfg({ ...cfg, topics: [] })}
            >
              Clear
            </button>
          )}
        </div>

        {!topicsOpen && cfg.topics.length > 0 && (
          <div className="sel-chips">
            {cfg.topics.map((t) => (
              <span key={t} className="tag">
                {iconFor(t)} {t}
              </span>
            ))}
          </div>
        )}

        <div className={`collapse ${topicsOpen ? "open" : ""}`}>
          <div className="collapse-in">
            <div className="tgrid">
              {topics.map((t, i) => {
                const on = cfg.topics.includes(t);
                return (
                  <button
                    key={t}
                    className={`topic ${on ? "on" : ""}`}
                    style={{ "--i": i } as CSSProperties}
                    aria-pressed={on}
                    onClick={() =>
                      setCfg({ ...cfg, topics: toggle(cfg.topics, t) })
                    }
                  >
                    <span className="t-ico">{iconFor(t)}</span>
                    <span className="t-name">{t}</span>
                    <span className="t-n">{perTopic(t)} Qs</span>
                    <span className="t-check">✓</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sec-h">
          <h3>2 · Difficulty</h3>
          <span className="mu small">
            {cfg.diffs.length ? "" : "All levels"}
          </span>
        </div>
        <div className="seg">
          {DIFFS.map((d) => (
            <button
              key={d.k}
              className={`segb ${cfg.diffs.includes(d.k) ? "on" : ""}`}
              onClick={() => setCfg({ ...cfg, diffs: toggle(cfg.diffs, d.k) })}
            >
              <span>{d.e}</span>
              {d.k}
            </button>
          ))}
        </div>

        <div className="sec-h">
          <h3>3 · Quiz length</h3>
        </div>
        <div className="seg">
          {([10, 20, 30, "All"] as const).map((n) => (
            <button
              key={n}
              className={`segb ${cfg.n === n ? "on" : ""}`}
              onClick={() => setCfg({ ...cfg, n })}
            >
              {n}
            </button>
          ))}
        </div>

        <button className="start" disabled={!pool.length} onClick={onStart}>
          <span className="start-ico">🚀</span>
          <span>Start quiz</span>
          <small>{count} questions</small>
        </button>
        {!pool.length && (
          <p className="mu" style={{ textAlign: "center", marginBottom: 0 }}>
            No questions match this filter — try another one.
          </p>
        )}
      </section>

      {attempts.length > 0 && (
        <section className="card">
          <div className="sec-h">
            <h3>Recent attempts</h3>
            <button className="link" onClick={onClear}>
              Clear history
            </button>
          </div>
          {attempts
            .slice(-5)
            .reverse()
            .map((a) => (
              <button key={a.at} className="hrow" onClick={onSummary}>
                <span className={`badge ${scoreClass(a.pct)}`}>{a.pct}%</span>
                <span className="h-mid">
                  <b>
                    {a.c}/{a.t} correct
                  </b>
                  <small>
                    {new Date(a.at).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    {a.sec != null && ` · ${fmt(a.sec)}`}
                  </small>
                  <span className="mbar">
                    <i style={{ width: `${a.pct}%` }} />
                  </span>
                </span>
                <span className="tile-go">→</span>
              </button>
            ))}
        </section>
      )}
    </div>
  );
}
