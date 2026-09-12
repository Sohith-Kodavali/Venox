"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, GhostButton, LimeButton } from "./ui";
import HeroBackground from "./HeroBackground";
import { useLoaded } from "./useLoaded";

const ease = [0.16, 1, 0.3, 1] as const;

type LineSpec = { text: string; accent?: boolean };
const LINES: LineSpec[] = [
  { text: "We build the" },
  { text: "systems behind" },
  { text: "ambitious", accent: true },
  { text: "businesses" },
];

export default function Hero() {
  const { loaded, mode } = useLoaded();
  const speedup = mode === "natural" ? 0.18 : 0;

  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const magnitude = reduceMotion ? 0 : isMobile ? 0.55 : 1;

  // ─── SCROLL PARALLAX ──────────────────────────────────────────────────
  // Bumped magnitudes so the depth is unmistakable during hero exit.
  // At scroll-through-complete: background lingers 32svh, content leads
  // 14svh, bottom row leads 30svh — a 60svh spread between the slowest
  // and fastest layers.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0svh", `${32 * magnitude}svh`]
  );
  const bgOpacity = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    [1, 0.7, 0.25]
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0svh", `${-14 * magnitude}svh`]
  );
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.9, 0.55]);
  const bottomY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0svh", `${-30 * magnitude}svh`]
  );

  // ─── MOUSE PARALLAX ───────────────────────────────────────────────────
  // Runs on desktop only. Feeds three foreground layers at increasing
  // depth so you see parallax immediately, no scroll needed.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 90, damping: 22, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 90, damping: 22, mass: 0.6 });

  // Near-field (biggest shift), mid-field, far-field
  const nearX = useTransform(smx, [-1, 1], [30, -30]);
  const nearY = useTransform(smy, [-1, 1], [24, -24]);
  const midX = useTransform(smx, [-1, 1], [16, -16]);
  const midY = useTransform(smy, [-1, 1], [12, -12]);
  const farX = useTransform(smx, [-1, 1], [8, -8]);
  const farY = useTransform(smy, [-1, 1], [6, -6]);

  useEffect(() => {
    if (reduceMotion || isTouch) return;
    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx.set((e.clientX / w) * 2 - 1);
      my.set((e.clientY / h) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduceMotion, isTouch]);

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative min-h-[100svh] flex flex-col overflow-hidden vx-grain"
    >
      <div className="absolute inset-0 vx-grid-bg" />

      {/* Background layer — lingers on scroll, drifts far-field with mouse */}
      <motion.div
        style={{
          y: bgY,
          opacity: bgOpacity,
          x: farX,
          willChange: "transform, opacity",
        }}
        className="absolute inset-0"
      >
        <HeroBackground />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(96deg,rgba(9,30,22,0.72)_0%,rgba(11,36,26,0.4)_36%,rgba(15,52,38,0.06)_62%,rgba(15,52,38,0)_78%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(11,36,26,0.4)_0%,rgba(11,36,26,0)_24%,rgba(11,36,26,0)_56%,rgba(6,18,12,0.92)_100%)]" />
      <div className="vx-scanline" />

      {/* HUD corners — near-field mouse parallax (largest shift) */}
      <motion.div
        style={{ x: nearX, y: nearY, willChange: "transform" }}
        className="absolute inset-0 pointer-events-none hidden md:block"
      >
        <span className="absolute top-24 left-6 vx-hud-corner !border-t-[1px] !border-l-[1px]" />
        <span className="absolute top-24 right-6 vx-hud-corner !border-t-[1px] !border-r-[1px]" />
        <span className="absolute bottom-24 left-6 vx-hud-corner !border-b-[1px] !border-l-[1px]" />
        <span className="absolute bottom-24 right-6 vx-hud-corner !border-b-[1px] !border-r-[1px]" />
      </motion.div>

      {/* Content — scroll lead + mid-field mouse drift */}
      <motion.div
        style={{
          y: contentY,
          opacity: contentOpacity,
          x: midX,
          willChange: "transform, opacity",
        }}
        className="relative z-10 flex-1 flex flex-col justify-center"
      >
        <motion.div
          style={{ y: midY }}
          className="vx-container w-full pt-32 pb-20"
        >
          <motion.p
            className="vx-tag mb-8"
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={
              loaded
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 18, filter: "blur(6px)" }
            }
            transition={{ duration: 0.85, delay: 0.7 - speedup, ease }}
          >
            Technology &amp; Digital Engineering Partner
          </motion.p>

          <div className="relative">
            <h1 className="vx-h1 vx-hero-h1 select-none">
              {LINES.map((line, i) => (
                <span
                  key={line.text}
                  className="block overflow-hidden pb-[0.12em] -mb-[0.12em]"
                >
                  <motion.span
                    className="block will-change-transform"
                    initial={{ y: "115%", scale: 1.04 }}
                    animate={
                      loaded
                        ? { y: 0, scale: 1 }
                        : { y: "115%", scale: 1.04 }
                    }
                    transition={{
                      duration: 1.05,
                      delay: 0.85 - speedup + i * 0.13,
                      ease,
                    }}
                  >
                    {line.accent ? (
                      <span className="vx-hero-accent">{line.text}</span>
                    ) : (
                      <span className="text-white">{line.text}</span>
                    )}
                    {i === LINES.length - 1 && (
                      <span className="text-[#9dff3f]">.</span>
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.span
              aria-hidden="true"
              className="hidden lg:flex absolute right-0 top-1 items-center gap-2 text-[10px] font-mono tracking-[0.28em] uppercase text-[#6f7a66]"
              initial={{ opacity: 0, x: 12 }}
              animate={loaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
              transition={{ duration: 0.8, delay: 1.4 - speedup, ease }}
            >
              <span className="w-[22px] h-[1px] bg-[rgba(157,255,63,0.5)]" />
              01 / Manifesto
            </motion.span>
          </div>

          <motion.p
            className="mt-8 max-w-[400px] text-[15px] leading-relaxed text-[#9aa590]"
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 1.65 - speedup, ease }}
          >
            Software engineering, AI, data and cloud capabilities delivered as
            one engineering partner.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 1.8 - speedup, ease }}
          >
            <LimeButton href="#capabilities">Explore Capabilities</LimeButton>
            <GhostButton href="#contact">Start a Conversation</GhostButton>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom row — largest scroll lead, near-field mouse drift */}
      <motion.div
        style={{
          y: bottomY,
          x: nearX,
          willChange: "transform",
        }}
        className="relative z-10 vx-container pb-8 flex items-center justify-between text-[10px] font-mono tracking-[0.22em] uppercase text-[#6f7a66]"
      >
        <motion.span
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 2.15 - speedup }}
        >
          <span className="vx-pulse-dot" />
          Austin, Texas &nbsp;&mdash;&nbsp; United States
        </motion.span>
        <motion.a
          href="#capabilities"
          className="flex items-center gap-2 hover:text-[#9dff3f] transition-colors"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 2.15 - speedup }}
        >
          <span className="hidden md:inline-block w-10 h-[1px] bg-[rgba(157,255,63,0.4)] mr-1" />
          Scroll
          <ArrowDown size={13} className="animate-bounce" />
        </motion.a>
      </motion.div>
    </section>
  );
}
