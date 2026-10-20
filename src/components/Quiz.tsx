import { useEffect, useRef, useState } from "react";
import type { Answer, Question } from "../types";
import Confetti from "./Confetti";
import Mascot, { type Mood } from "./Mascot";
interface Props {
  list: Question[];
  timed: boolean;
  onFinish: (answers: Answer[]) => void;
  onQuit: () => void;
}

export default function Quiz({ list, timed, onFinish, onQuit }: Props) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [sec, setSec] = useState(0);
  const [burst, setBurst] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mood, setMood] = useState<Mood>("in");
  const timer = useRef<number | undefined>(undefined);
  const startedAt = useRef(Date.now());
  const q = list[i];
  const last = i + 1 === list.length;
  useEffect(() => {
    const t = window.setTimeout(
      () => setMood((m) => (m === "in" ? "idle" : m)),
      1000,
    );
    return () => {
      clearTimeout(t);
      clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    startedAt.current = Date.now();
    setSec(0);
  }, [i]);

  useEffect(() => {
    if (!timed || done) return;
    const id = setInterval(
      () => setSec(Math.floor((Date.now() - startedAt.current) / 1000)),
      500,
    );
    return () => clearInterval(id);
  }, [timed, done, i]);
  useEffect(() => {
    if (timed && !done && sec > 15) setMood((m) => (m === "idle" ? "wait" : m));
  }, [sec, timed, done]);
  const check = () => {
    if (!picked) return;
    const elapsed = Math.round((Date.now() - startedAt.current) / 1000);
    const ok = picked === q.correctAnswer;
    setAnswers((a) => [...a, { q, picked, ok, sec: elapsed }]);
    setStreak((s) => (ok ? s + 1 : 0));
    setMood(ok ? "happy" : "sad");
    if (ok) setBurst((b) => b + 1);
    setDone(true);
  };

  const next = () => {
    setMood("out");
    timer.current = window.setTimeout(() => {
      if (last) return onFinish(answers);
      setPicked(null);
      setDone(false);
      setI((n) => n + 1);
      setMood("in");
      timer.current = window.setTimeout(
        () => setMood((m) => (m === "in" ? "idle" : m)),
        800,
      );
    }, 750);
  };

  const optClass = (id: string) =>
    !done
      ? picked === id
        ? "sel"
        : ""
      : id === q.correctAnswer
        ? "ok"
        : id === picked
          ? "no"
          : "";

  return (
    <>
      <Confetti burst={burst} count={60} />
      <div className="card">
        <div className="top">
          <span>
            Question {i + 1} / {list.length}
          </span>
          <span>
            {streak >= 2 && (
              <span key={streak} className="streak">
                🔥 {streak} in a row{" "}
              </span>
            )}
            {timed && (
              <span className={sec > 15 ? "late" : ""}>
                ⏱ {Math.floor(sec / 60)}:{String(sec % 60).padStart(2, "0")}
              </span>
            )}
          </span>
          <button className="ghost" onClick={() => setConfirmQuit(true)}>
            Quit
          </button>
        </div>
        <div className="bar">
          <div style={{ width: `${(i / list.length) * 100}%` }} />
        </div>
        <div className="stage">
          <Mascot mood={mood} seed={i} />
        </div>
        <div key={i} className="slide">
          <div style={{ marginTop: 16 }}>
            <span className="tag">{q.topic}</span>
            <span className="tag">{q.subtopic}</span>
            <span className={`tag ${q.difficulty}`}>{q.difficulty}</span>
          </div>
        </div>
        <div className="q">{q.question}</div>
        {q.code && (
          <pre>
            <code>{q.code}</code>
          </pre>
        )}

        <div>
          {q.options.map((o) => (
            <button
              key={o.id}
              className={`opt ${optClass(o.id)}`}
              disabled={done}
              onClick={() => setPicked(o.id)}
            >
              <b>{o.id}</b>
              <span>{o.text}</span>
            </button>
          ))}
        </div>

        {done && (
          <div className="exp">
            <b>
              {picked === q.correctAnswer ? "✅ Correct!" : "❌ Not quite."}
            </b>
            <br />
            {q.explanation}
          </div>
        )}

        <div className="row">
          <button
            className="cta"
            disabled={!picked || mood === "out"}
            onClick={done ? next : check}
          >
            {!done
              ? "Check answer"
              : last
                ? "See results 🎉"
                : "Next question →"}
          </button>
        </div>

        {confirmQuit && (
          <div
            className="modal"
            onClick={(e) =>
              e.target === e.currentTarget && setConfirmQuit(false)
            }
          >
            <div className="card">
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: 18,
                  textTransform: "none",
                  letterSpacing: 0,
                  color: "var(--tx)",
                }}
              >
                Quit this quiz?
              </h3>
              <p className="mu" style={{ margin: 0 }}>
                Your progress in this attempt will be lost.
              </p>
              <div className="row">
                <button
                  className="cta"
                  style={{
                    background: "var(--card)",
                    color: "var(--tx)",
                    border: "1px solid var(--bd)",
                    boxShadow: "none",
                  }}
                  onClick={() => setConfirmQuit(false)}
                >
                  Keep going
                </button>
                <button
                  className="cta"
                  style={{ background: "var(--no)", boxShadow: "none" }}
                  onClick={onQuit}
                >
                  Quit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
