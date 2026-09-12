"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
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
  // User already sat through the full loader on natural completion, so
  // shave a little off every entry delay for a snappier hero landing.
  const speedup = mode === "natural" ? 0.18 : 0;

  // ─── Scroll-exit parallax ────────────────────────────────────────────────
  // Three layers move at different speeds as the user scrolls off the hero:
  //   background  → lingers  (translate +Ysvh)   feels like it stays
  //   text stack  → normal / slight lead (small −Y)
  //   bottom row  → leads    (larger −Y)         exits first
  // All GPU transforms only; reduced-motion + mobile magnitudes handled.
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const magnitude = reduceMotion ? 0 : isMobile ? 0.5 : 1;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0svh", `${16 * magnitude}svh`]
  );
  const bgOpacity = useTransform(
    scrollYProgress,
    [0, 0.65, 1],
    [1, 0.75, 0.4]
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0svh", `${-6 * magnitude}svh`]
  );
  const bottomY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0svh", `${-14 * magnitude}svh`]
  );

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative min-h-[100svh] flex flex-col overflow-hidden vx-grain"
    >
      <div className="absolute inset-0 vx-grid-bg" />

      {/* Background layer — lingers, opacity dims into next section */}
      <motion.div
        style={{ y: bgY, opacity: bgOpacity, willChange: "transform, opacity" }}
        className="absolute inset-0"
      >
        <HeroBackground />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(96deg,rgba(9,30,22,0.72)_0%,rgba(11,36,26,0.4)_36%,rgba(15,52,38,0.06)_62%,rgba(15,52,38,0)_78%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(11,36,26,0.4)_0%,rgba(11,36,26,0)_24%,rgba(11,36,26,0)_56%,rgba(6,18,12,0.92)_100%)]" />
      <div className="vx-scanline" />

      <div className="absolute top-24 left-6 vx-hud-corner !border-t-[1px] !border-l-[1px] hidden md:block" />
      <div className="absolute top-24 right-6 vx-hud-corner !border-t-[1px] !border-r-[1px] hidden md:block" />
      <div className="absolute bottom-24 left-6 vx-hud-corner !border-b-[1px] !border-l-[1px] hidden md:block" />
      <div className="absolute bottom-24 right-6 vx-hud-corner !border-b-[1px] !border-r-[1px] hidden md:block" />

      {/* Content layer — small upward lead relative to the section scroll */}
      <motion.div
        style={{ y: contentY, willChange: "transform" }}
        className="relative z-10 flex-1 flex flex-col justify-center"
      >
        <div className="vx-container w-full pt-32 pb-20">
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

            {/* Small technical marker in the top-right of the headline */}
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
        </div>
      </motion.div>

      {/* Bottom row — leads on scroll, exits first */}
      <motion.div
        style={{ y: bottomY, willChange: "transform" }}
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
