"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Reveal from "./Reveal";
import { useCanRenderScene } from "./useSceneGate";

const VenoxScene = dynamic(() => import("./VenoxScene"), { ssr: false });

const CHARS = ["V", "E", "X", "O", "N"];

// ── Compact fallback (mobile, reduced-motion, low-power) ─────────────────
// Renders as a normal one-viewport-tall section with a simple animated
// wordmark reveal instead of a 220vh scroll stunt that dead-scrolls on
// devices where the WebGL scene is gated off.
function CompactShowpiece() {
  return (
    <section className="relative bg-[#040603] overflow-hidden vx-grain">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 55%, rgba(157,255,63,0.08), transparent 65%), radial-gradient(ellipse 40% 30% at 80% 10%, rgba(157,255,63,0.05), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 vx-grid-bg opacity-50 pointer-events-none" />

      <div className="relative vx-container flex flex-col items-center justify-center py-24 sm:py-28 min-h-[80svh]">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {CHARS.map((c, i) => (
            <motion.span
              key={c}
              initial={{ opacity: 0, y: 30, scale: 0.6 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: 0.08 + i * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[16vw] sm:text-[7rem] leading-none font-bold text-transparent"
              style={{
                WebkitTextStroke: "1.5px #9dff3f",
                textShadow: "0 0 24px rgba(157,255,63,0.22)",
              }}
            >
              {c}
            </motion.span>
          ))}
        </div>

        <Reveal delay={0.55}>
          <p className="mt-8 text-[10px] font-mono tracking-[0.34em] uppercase text-[#9dff3f] text-center">
            Vexon Solutions Inc
          </p>
        </Reveal>
        <Reveal delay={0.7}>
          <p className="mt-3 text-[13px] text-[#9aa590] max-w-[420px] mx-auto leading-relaxed text-center">
            Technology &amp; Digital Engineering Partner — building the systems
            behind ambitious businesses.
          </p>
        </Reveal>
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
