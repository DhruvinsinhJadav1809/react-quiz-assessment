export default function ThemeToggle({
  dark,
  onToggle,
}: {
  dark: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className={`tt ${dark ? "dark" : ""}`}
      onClick={onToggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="tt-stars">✦ ✦</span>
      <span className="tt-knob">{dark ? "🌙" : "☀️"}</span>
    </button>
  );
}
