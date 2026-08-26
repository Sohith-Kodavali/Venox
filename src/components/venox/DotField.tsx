"use client";

import { useEffect, useRef } from "react";

export default function DotField({
  color = "#9dff3f",
  spacing = 26,
  baseOpacity = 0.2,
  hoverRadius = 130,
  className = "",
}: {
  color?: string;
  spacing?: number;
  baseOpacity?: number;
  hoverRadius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let dots: { x: number; y: number; phase: number }[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let visible = true;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = spacing / 2; y < h; y += spacing) {
        for (let x = spacing / 2; x < w; x += spacing) {
          dots.push({ x, y, phase: (x / w) * 5 + (y / h) * 2.4 });
        }
      }
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    const host = canvas.parentElement;
    host?.addEventListener("pointermove", onMove);
    host?.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const time = t / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const d of dots) {
        const wave = Math.sin(d.phase + time * 1.1) * 0.5 + 0.5;
        let a = baseOpacity * (0.35 + wave * 0.65);
        let s = 1.2;
        let dx = 0;
        let dy = 0;
        if (mouse.active) {
          const mx = d.x - mouse.x;
          const my = d.y - mouse.y;
          const dist = Math.sqrt(mx * mx + my * my);
          if (dist < hoverRadius) {
            const f = 1 - dist / hoverRadius;
            a = Math.min(0.85, a + f * 0.65);
            s = 1.2 + f * 1.5;
            const push = f * 7;
            dx = (mx / (dist || 1)) * push;
            dy = (my / (dist || 1)) * push;
          }
        }
        ctx.globalAlpha = a;
        ctx.fillRect(d.x + dx - s / 2, d.y + dy - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host?.removeEventListener("pointermove", onMove);
      host?.removeEventListener("pointerleave", onLeave);
    };
  }, [color, spacing, baseOpacity, hoverRadius]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
