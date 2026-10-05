import { useEffect, useState } from "react";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import Summary from "./components/Summary";
import type { Answer, Attempt, Config, Question } from "./types";
import { breakdown, loadAttempts, pickQuestions, saveAttempts } from "./utils";

type View =
  | { name: "home" }
  | { name: "quiz"; list: Question[] }
  | { name: "results"; answers: Answer[] }
  | { name: "summary" };

const DEFAULT_CFG: Config = { topics: [], diffs: [], n: 20, timed: true };
const APP_VERSION = "1.0.0";

export default function App() {
  const [view, setView] = useState<View>({ name: "home" });
  const [cfg, setCfg] = useState<Config>(DEFAULT_CFG);
  const [attempts, setAttempts] = useState<Attempt[]>(loadAttempts);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view.name]);

  const toggleTheme = () => {
    const dark = theme
      ? theme === "dark"
      : matchMedia("(prefers-color-scheme:dark)").matches;
    setTheme(dark ? "light" : "dark");
  };

  const start = () => setView({ name: "quiz", list: pickQuestions(cfg) });

  const finish = (answers: Answer[]) => {
    const c = answers.filter((a) => a.ok).length;
    const attempt: Attempt = {
      at: Date.now(),
      pct: Math.round((c / answers.length) * 100),
      c,
      t: answers.length,
      sec: answers.reduce((s, a) => s + a.sec, 0),
      topic: breakdown(answers, "topic"),
      difficulty: breakdown(answers, "difficulty"),
      questionType: breakdown(answers, "questionType"),
    };
    const next = [...attempts, attempt].slice(-30);
    saveAttempts(next);
    setAttempts(next);
    setView({ name: "results", answers });
  };

  const clearHistory = () => {
    saveAttempts([]);
    setAttempts([]);
  };

  const home = () => setView({ name: "home" });

  return (
    <div className="wrap">
      <header>
        <div className="logo">
          <i>⚛</i> React Assessment
        </div>
        <button
          className="ghost"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          🌓
        </button>
      </header>
      <main>
        {view.name === "home" && (
          <Home
            cfg={cfg}
            setCfg={setCfg}
            attempts={attempts}
            onStart={start}
            onSummary={() => setView({ name: "summary" })}
            onClear={clearHistory}
          />
        )}
        {view.name === "quiz" && (
          <Quiz
            key={view.list[0]?.id}
            list={view.list}
            timed={cfg.timed}
            onFinish={finish}
            onQuit={home}
          />
        )}
        {view.name === "results" && (
          <Results
            answers={view.answers}
            onAgain={start}
            onHome={home}
            onSummary={() => setView({ name: "summary" })}
          />
        )}
        {view.name === "summary" && (
          <Summary attempts={attempts} onBack={home} />
        )}
      </main>

      <footer className="footer">
        <span>© 2026 Dhruvinsinh Jadav</span>
        <span>All rights reserved</span> |
        <span>App version : {APP_VERSION}</span>
      </footer>
    </div>
  );
}
