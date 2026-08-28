"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const LIME = "#9dff3f";
const TEAL = "#2dd4bf";

function seededRand(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

type Particle = { x: number; y: number; vx: number; vy: number; r: number; hue: number };

function ParticleNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let particles: Particle[] = [];

    const buildParticles = () => {
      const count = w < 640 ? 46 : 100;
      particles = Array.from({ length: count }, (_, i) => {
        const bandT = seededRand(i * 3.1);
        const x = w * (0.34 + bandT * 0.78);
        const waveY = h * (0.4 + Math.sin(bandT * Math.PI * 2.2) * 0.14);
        const y = waveY + (seededRand(i * 7.7) - 0.5) * h * 0.55 * (0.3 + bandT * 0.9);
        return {
          x,
          y,
          vx: (seededRand(i * 5.3) - 0.5) * 0.14,
          vy: (seededRand(i * 9.1) - 0.5) * 0.1,
          r: 1 + seededRand(i * 4.4) * 1.7,
          hue: seededRand(i * 6.6),
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const maxDist = Math.min(w, h) * 0.16;

      if (!reduceMotion) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(157,255,63,${(1 - dist / maxDist) * 0.35})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = p.hue > 0.45 ? LIME : TEAL;
        ctx.globalAlpha = 0.5 + p.hue * 0.4;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      render();
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const nowVisible = entry.isIntersecting;
        if (nowVisible && !visible) {
          visible = true;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(draw);
        } else if (!nowVisible && visible) {
          visible = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "150px" }
    );
    io.observe(canvas);

    if (reduceMotion) render();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
}

function GlowSphere() {
  return (
    <div
      className="vx-sphere-core"
      style={{
        width: "clamp(220px, 34vw, 560px)",
        aspectRatio: "1",
        right: "-8%",
        top: "6%",
        boxShadow:
          "0 0 140px rgba(157,255,63,0.2), inset -26px -18px 70px rgba(0,0,0,0.65), inset 18px 10px 50px rgba(157,255,63,0.14)",
      }}
    >
      <div className="vx-sphere-shade" />
      <div className="vx-sphere-sheen" />
    </div>
  );
}

const LABELS = [
  { text: "AI & DATA", top: "13%", left: "60%", line: 46, delay: 1.3 },
  { text: "CLOUD & DEVOPS", top: "46%", left: "45%", line: 34, delay: 1.45 },
  { text: "SOFTWARE ENGINEERING", top: "20%", left: "84%", line: 64, delay: 1.6 },
];

function HudLabel({ text, top, left, line, delay }: { text: string; top: string; left: string; line: number; delay: number }) {
  return (
    <motion.div
      className="hidden sm:flex absolute flex-col items-start pointer-events-none"
      style={{ top, left }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 border border-[#9dff3f]" />
        <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#9dff3f] whitespace-nowrap">
          {text}
        </span>
      </span>
      <span
        className="ml-[3px] mt-1.5 w-px"
        style={{ height: line, background: "linear-gradient(180deg, rgba(157,255,63,0.85), transparent)" }}
      />
    </motion.div>
  );
}

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 vx-hero-ambient" />
      <GlowSphere />
      <ParticleNetwork />
      {LABELS.map((l) => (
        <HudLabel key={l.text} text={l.text} top={l.top} left={l.left} line={l.line} delay={l.delay} />
      ))}
    </div>
  );
}
