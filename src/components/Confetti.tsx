import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: string;
  a: number;
  va: number;
  life: number;
}
const COLORS = [
  "#6366f1",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#a78bfa",
];

/** Fires a confetti burst every time `burst` changes to a non-zero value. */
export default function Confetti({
  burst,
  count = 70,
}: {
  burst: number;
  count?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const parts = useRef<Particle[]>([]);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const resize = () => {
      cv.width = innerWidth;
      cv.height = innerHeight;
    };
    resize();
    addEventListener("resize", resize);
    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.current = parts.current.filter(
        (p) => p.life > 0 && p.y < cv.height + 20,
      );
      for (const p of parts.current) {
        p.vy += 0.18;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.a += p.va;
        p.life--;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.globalAlpha = Math.min(1, p.life / 30);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx.restore();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (!burst || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const cv = ref.current!;
    for (let i = 0; i < count; i++) {
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
      const sp = 6 + Math.random() * 9;
      parts.current.push({
        x: cv.width / 2,
        y: cv.height * 0.65,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        r: 4 + Math.random() * 5,
        c: COLORS[i % COLORS.length],
        a: Math.random() * 6,
        va: (Math.random() - 0.5) * 0.3,
        life: 90 + Math.random() * 60,
      });
    }
  }, [burst, count]);

  return <canvas ref={ref} className="confetti" aria-hidden="true" />;
}
