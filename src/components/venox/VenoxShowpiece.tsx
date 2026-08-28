"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useCanRenderScene } from "./useSceneGate";

const VenoxScene = dynamic(() => import("./VenoxScene"), { ssr: false });

const CHARS = ["V", "E", "X", "O", "N"];

function FallbackLetter({
  char,
  index,
  scrollYProgress,
}: {
  char: string;
  index: number;
  scrollYProgress: import("framer-motion").MotionValue<number>;
}) {
  const start = 0.12 + index * 0.09;
  const opacity = useTransform(scrollYProgress, [start, start + 0.16], [0, 1]);
  const y = useTransform(scrollYProgress, [start, start + 0.16], [26, 0]);
  return (
    <motion.span
      style={{ opacity, y, WebkitTextStroke: "1.5px #9dff3f", textShadow: "0 0 28px rgba(157,255,63,0.35)" }}
      className="text-[15vw] sm:text-[9rem] leading-none font-bold text-transparent"
    >
      {char}
    </motion.span>
  );
}

function LetterFallback({ scrollYProgress }: { scrollYProgress: import("framer-motion").MotionValue<number> }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {CHARS.map((c, i) => (
        <FallbackLetter key={c} char={c} index={i} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
}

export default function VenoxShowpiece() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const canRenderScene = useCanRenderScene();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "300px" });
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

  const showScene = canRenderScene && inView;

  return (
    <section ref={ref} className="relative h-[220vh] bg-[#040603]">
      <div className="sticky top-0 h-screen overflow-hidden vx-grain">
        <motion.div style={{ opacity: sceneOpacity, scale: sceneScale }} className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(157,255,63,0.08), transparent 65%), radial-gradient(ellipse 40% 30% at 80% 10%, rgba(157,255,63,0.05), transparent 60%)",
            }}
          />
          <div className="absolute inset-0 vx-grid-bg opacity-50" />

          {showScene ? (
            <div className="absolute inset-0">
              <VenoxScene progress={progress} />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <LetterFallback scrollYProgress={scrollYProgress} />
            </div>
          )}
        </motion.div>

        <motion.div
          style={{ opacity: tagOpacity, y: tagY }}
          className="absolute bottom-20 left-0 right-0 text-center pointer-events-none px-6"
        >
          <p className="text-[10px] font-mono tracking-[0.34em] uppercase text-[#9dff3f]">Vexon Solutions Inc</p>
          <p className="mt-3 text-[13px] text-[#9aa590] max-w-[420px] mx-auto leading-relaxed">
            Technology &amp; Digital Engineering Partner — building the systems behind ambitious businesses.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[rgba(255,255,255,0.06)]">
          <motion.div className="h-full origin-left bg-[#9dff3f]" style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}
