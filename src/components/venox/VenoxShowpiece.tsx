"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Reveal from "./Reveal";
import { useCanRenderScene } from "./useSceneGate";

const VenoxScene = dynamic(() => import("./VenoxScene"), { ssr: false });

const CHARS = ["V", "E", "X", "O", "N"];

// ── Compact fallback (mobile, reduced-motion, low-power) ─────────────────
// Scroll-driven reveal so the letters cascade in on scroll-down AND reverse
// on scroll-up — the "stays stuck once revealed" complaint. Extra top/bottom
// spacing gives the animation room to breathe before it kicks in.
function CompactLetter({
  char,
  index,
  scrollYProgress,
}: {
  char: string;
  index: number;
  scrollYProgress: import("framer-motion").MotionValue<number>;
}) {
  // Animation window per letter: staggered across scroll progress 0.15 → 0.7
  const start = 0.15 + index * 0.08;
  const end = start + 0.16;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [40, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [0.6, 1]);
  return (
    <motion.span
      style={{
        opacity,
        y,
        scale,
        WebkitTextStroke: "1.5px #9dff3f",
        textShadow: "0 0 24px rgba(157,255,63,0.22)",
      }}
      className="text-[16vw] sm:text-[7rem] leading-none font-bold text-transparent"
    >
      {char}
    </motion.span>
  );
}

function CompactShowpiece() {
  const ref = useRef<HTMLDivElement>(null);
  // Track scroll from when the section top hits the viewport bottom to
  // when its bottom leaves the viewport top — full reversible sweep.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const tagOpacity = useTransform(scrollYProgress, [0.68, 0.82], [0, 1]);
  const tagY = useTransform(scrollYProgress, [0.68, 0.82], [18, 0]);
  const subOpacity = useTransform(scrollYProgress, [0.72, 0.86], [0, 1]);
  const subY = useTransform(scrollYProgress, [0.72, 0.86], [18, 0]);

  return (
    <section
      ref={ref}
      className="relative bg-[#040603] overflow-hidden vx-grain"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 55%, rgba(157,255,63,0.08), transparent 65%), radial-gradient(ellipse 40% 30% at 80% 10%, rgba(157,255,63,0.05), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 vx-grid-bg opacity-50 pointer-events-none" />

      {/* Extra top/bottom padding so the scroll animation has runway
          before the letters start moving in either direction */}
      <div className="relative vx-container flex flex-col items-center justify-center py-36 sm:py-40 min-h-[90svh]">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {CHARS.map((c, i) => (
            <CompactLetter
              key={c}
              char={c}
              index={i}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        <motion.p
          style={{ opacity: tagOpacity, y: tagY }}
          className="mt-8 text-[10px] font-mono tracking-[0.34em] uppercase text-[#9dff3f] text-center"
        >
          Vexon Solutions Inc
        </motion.p>
        <motion.p
          style={{ opacity: subOpacity, y: subY }}
          className="mt-3 text-[13px] text-[#9aa590] max-w-[420px] mx-auto leading-relaxed text-center"
        >
          Technology &amp; Digital Engineering Partner — building the systems
          behind ambitious businesses.
        </motion.p>
      </div>
    </section>
  );
}

// ── Full scroll-driven showpiece (desktop with WebGL scene) ──────────────
function FullShowpiece() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
  });

  const tagOpacity = useTransform(scrollYProgress, [0.78, 0.92], [0, 1]);
  const tagY = useTransform(scrollYProgress, [0.78, 0.92], [20, 0]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.08], [0.4, 1]);
  const sceneScale = useTransform(scrollYProgress, [0, 0.08], [0.96, 1]);

  return (
    <section ref={ref} className="relative h-[220vh] bg-[#040603]">
      <div className="sticky top-0 h-screen overflow-hidden vx-grain">
        <motion.div
          style={{ opacity: sceneOpacity, scale: sceneScale }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(157,255,63,0.08), transparent 65%), radial-gradient(ellipse 40% 30% at 80% 10%, rgba(157,255,63,0.05), transparent 60%)",
            }}
          />
          <div className="absolute inset-0 vx-grid-bg opacity-50" />

          {inView && (
            <div className="absolute inset-0">
              <VenoxScene progress={progress} />
            </div>
          )}
        </motion.div>

        <motion.div
          style={{ opacity: tagOpacity, y: tagY }}
          className="absolute bottom-20 left-0 right-0 text-center pointer-events-none px-6"
        >
          <p className="text-[10px] font-mono tracking-[0.34em] uppercase text-[#9dff3f]">
            Vexon Solutions Inc
          </p>
          <p className="mt-3 text-[13px] text-[#9aa590] max-w-[420px] mx-auto leading-relaxed">
            Technology &amp; Digital Engineering Partner — building the systems
            behind ambitious businesses.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[rgba(255,255,255,0.06)]">
          <motion.div
            className="h-full origin-left bg-[#9dff3f]"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      </div>
    </section>
  );
}

export default function VenoxShowpiece() {
  const canRenderScene = useCanRenderScene();
  // Gate the 220vh scroll experience to devices that can actually render
  // the WebGL scene. Everything else gets a normal one-screen section so
  // mobile doesn't dead-scroll through empty viewports.
  return canRenderScene ? <FullShowpiece /> : <CompactShowpiece />;
}
