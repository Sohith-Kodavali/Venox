"use client";

import { useEffect, useRef } from "react";

export default function WaveCanvas({
  color = "#9dff3f",
  layers = 3,
  speed = 1,
  amplitude = 0.35,
  mode = "lines",
  className = "",
  opacity = 1,
}: {
  color?: string;
  layers?: number;
  speed?: number;
  amplitude?: number;
  mode?: "lines" | "dots";
  className?: string;
  opacity?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let w = 0;
    let h = 0;
    let visible = false;
    let startTime: number | null = null;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const render = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const time = (t / 1000) * speed;
      for (let l = 0; l < layers; l++) {
        const lf = l / Math.max(layers - 1, 1);
        const amp = h * amplitude * (0.5 + lf * 0.5);
        const baseY = h * (0.62 + lf * 0.14);
        const freq = 1.6 + l * 0.7;
        const phase = time * (0.7 + l * 0.25) + l * 1.7;

        if (mode === "dots") {
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.28 - lf * 0.14;
          const step = 14;
          for (let x = 0; x <= w; x += step) {
            const y = baseY + Math.sin((x / w) * Math.PI * 2 * freq + phase) * amp * 0.5 + Math.sin((x / w) * Math.PI * 5 + phase * 1.4) * amp * 0.18;
            ctx.beginPath();
            ctx.arc(x, y, 1.1 - lf * 0.3, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          ctx.beginPath();
          ctx.moveTo(0, h);
          for (let x = 0; x <= w; x += 4) {
            const y =
              baseY +
              Math.sin((x / w) * Math.PI * 2 * freq + phase) * amp * 0.5 +
              Math.sin((x / w) * Math.PI * 2 * (freq * 2.3) + phase * 1.6) * amp * 0.22;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(w, h);
          const grad = ctx.createLinearGradient(0, baseY - amp, 0, h);
          grad.addColorStop(0, color);
          grad.addColorStop(1, "transparent");
          ctx.strokeStyle = grad;
          ctx.globalAlpha = 0.5 - lf * 0.15;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.globalAlpha = 0.06;
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const draw = (t: number) => {
      if (startTime === null) startTime = t;
      render(t - startTime);
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const nowVisible = entry.isIntersecting;
        if (nowVisible && !visible) {
          visible = true;
          startTime = null;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(draw);
        } else if (!nowVisible && visible) {
          visible = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "120px" }
    );
    io.observe(canvas);

    if (reduceMotion) render(0);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [color, layers, speed, amplitude, mode]);

  return <canvas ref={ref} className={className} style={{ opacity }} aria-hidden="true" />;
}
