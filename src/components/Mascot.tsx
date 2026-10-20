export type Mood = "idle" | "happy" | "sad" | "in" | "out" | "wait";

const LINES: Record<Mood, string[]> = {
  idle: [
    "Think carefully 🤔",
    "You got this! 💪",
    "Take your time ⏳",
    "Hmm, tricky one…",
  ],
  happy: [
    "Nailed it! 🎉",
    "Brilliant! ✨",
    "Correct! You rock 🤘",
    "Yesss! 🔥",
  ],
  sad: [
    "Oops! Read the explanation 📖",
    "Not quite… next one! 💪",
    "So close! 😅",
    "Learn from it 🌱",
  ],
  in: ["Here comes a new one! 👀"],
  out: [],
  wait: [
    "Hurry up! ⏰",
    "Still thinking? 😴",
    "Tick tock… ⏳",
    "I'm getting sleepy 💤",
  ],
};

export default function Mascot({ mood, seed }: { mood: Mood; seed: number }) {
  const lines = LINES[mood];
  const line = lines.length ? lines[seed % lines.length] : "";
  const pupilY = mood === "sad" ? 56 : 53;

  return (
    <>
      <svg
        className={`mascot m-${mood}`}
        viewBox="0 0 100 120"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#818cf8" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="116" rx="26" ry="4" fill="#0002" />
        <g className="m-body">
          <rect
            className="leg l1"
            x="34"
            y="90"
            width="12"
            height="24"
            rx="6"
            fill="#4338ca"
          />
          <rect
            className="leg l2"
            x="54"
            y="90"
            width="12"
            height="24"
            rx="6"
            fill="#4338ca"
          />
          <rect
            className="arm a1"
            x="12"
            y="50"
            width="11"
            height="30"
            rx="5.5"
            fill="#6366f1"
          />
          <rect
            className="arm a2"
            x="77"
            y="50"
            width="11"
            height="30"
            rx="5.5"
            fill="#6366f1"
          />
          <line
            x1="50"
            y1="14"
            x2="50"
            y2="28"
            stroke="#4338ca"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle className="ant" cx="50" cy="11" r="5" fill="#f59e0b" />
          <rect x="22" y="24" width="56" height="72" rx="28" fill="url(#mg)" />
          <g className="eyes">
            <ellipse cx="39" cy="52" rx="7" ry="8" fill="#fff" />
            <ellipse cx="61" cy="52" rx="7" ry="8" fill="#fff" />
            <g className="pupils">
              <circle cx="40" cy={pupilY} r="3.6" fill="#1e1b4b" />
              <circle cx="62" cy={pupilY} r="3.6" fill="#1e1b4b" />
            </g>
          </g>
          <circle cx="30" cy="66" r="4" fill="#f472b6" opacity=".55" />
          <circle cx="70" cy="66" r="4" fill="#f472b6" opacity=".55" />
          {mood === "wait" ? (
            <path
              d="M43 72 L57 72"
              stroke="#1e1b4b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ) : mood === "happy" ? (
            <path
              d="M40 68 Q50 84 60 68 Z"
              fill="#7c2d12"
              stroke="#1e1b4b"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          ) : mood === "sad" ? (
            <path
              d="M42 77 Q50 68 58 77"
              fill="none"
              stroke="#1e1b4b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M42 70 Q50 77 58 70"
              fill="none"
              stroke="#1e1b4b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
          {mood === "sad" && (
            <path
              className="tear"
              d="M33 62 q-3 6 0 8 q3 -2 0 -8z"
              fill="#7dd3fc"
            />
          )}
          {mood === "wait" && (
            <>
              <path
                className="sweat"
                d="M72 40 q-4 7 0 10 q4 -3 0 -10z"
                fill="#7dd3fc"
              />
              <text className="clock" x="70" y="12" fontSize="16">
                ⏰
              </text>
            </>
          )}
        </g>
        {mood === "happy" && (
          <>
            <text className="spark s1" x="4" y="30" fontSize="14">
              ✨
            </text>
            <text className="spark s2" x="80" y="22" fontSize="14">
              ⭐
            </text>
          </>
        )}
      </svg>
      {line && (
        <div key={mood + line} className="bubble">
          {line}
        </div>
      )}
    </>
  );
}
