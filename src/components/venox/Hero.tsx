"use client";

import { motion } from "framer-motion";
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
  const loaded = useLoaded();

  return (
    <section id="top" className="relative min-h-[100svh] flex flex-col overflow-hidden vx-grain">
      <div className="absolute inset-0 vx-grid-bg" />
      <HeroBackground />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(96deg,rgba(9,30,22,0.72)_0%,rgba(11,36,26,0.4)_36%,rgba(15,52,38,0.06)_62%,rgba(15,52,38,0)_78%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(11,36,26,0.4)_0%,rgba(11,36,26,0)_24%,rgba(11,36,26,0)_56%,rgba(6,18,12,0.92)_100%)]" />
      <div className="vx-scanline" />

      <div className="absolute top-24 left-6 vx-hud-corner !border-t-[1px] !border-l-[1px] hidden md:block" />
      <div className="absolute top-24 right-6 vx-hud-corner !border-t-[1px] !border-r-[1px] hidden md:block" />
      <div className="absolute bottom-24 left-6 vx-hud-corner !border-b-[1px] !border-l-[1px] hidden md:block" />
      <div className="absolute bottom-24 right-6 vx-hud-corner !border-b-[1px] !border-r-[1px] hidden md:block" />

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="vx-container w-full pt-32 pb-20">
          <motion.p
            className="vx-tag mb-8"
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={loaded ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 18, filter: "blur(6px)" }}
            transition={{ duration: 0.85, delay: 0.7, ease }}
          >
            Technology &amp; Digital Engineering Partner
          </motion.p>

          <div className="relative">
            {/* Decorative vertical accent bar next to the headline */}
            <motion.span
              aria-hidden="true"
              className="hidden md:block absolute -left-6 top-2 bottom-2 w-[2px] origin-top"
              style={{
                background:
                  "linear-gradient(180deg, rgba(157,255,63,0) 0%, rgba(157,255,63,0.7) 22%, rgba(157,255,63,0.7) 78%, rgba(157,255,63,0) 100%)",
                boxShadow: "0 0 10px rgba(157,255,63,0.35)",
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={loaded ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
              transition={{ duration: 1.2, delay: 0.7, ease }}
            />

            <h1 className="vx-h1 vx-hero-h1 select-none">
              {LINES.map((line, i) => (
                <span key={line.text} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                  <motion.span
                    className="block will-change-transform"
                    initial={{ y: "115%", scale: 1.04 }}
                    animate={loaded ? { y: 0, scale: 1 } : { y: "115%", scale: 1.04 }}
                    transition={{
                      duration: 1.05,
                      delay: 0.85 + i * 0.13,
                      ease,
                    }}
                  >
                    {line.accent ? (
                      <span className="vx-hero-accent">{line.text}</span>
                    ) : (
                      <span className="text-white">{line.text}</span>
                    )}
                    {i === LINES.length - 1 && <span className="text-[#9dff3f]">.</span>}
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
              transition={{ duration: 0.8, delay: 1.4, ease }}
            >
              <span className="w-[22px] h-[1px] bg-[rgba(157,255,63,0.5)]" />
              01 / Manifesto
            </motion.span>
          </div>

          <motion.p
            className="mt-8 max-w-[400px] text-[15px] leading-relaxed text-[#9aa590]"
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 1.65, ease }}
          >
            Software engineering, AI, data and cloud capabilities delivered as one engineering partner.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 1.8, ease }}
          >
            <LimeButton href="#capabilities">Explore Capabilities</LimeButton>
            <GhostButton href="#contact">Start a Conversation</GhostButton>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="relative z-10 vx-container pb-8 flex items-center justify-between text-[10px] font-mono tracking-[0.22em] uppercase text-[#6f7a66]"
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 2.15 }}
      >
        <span className="flex items-center gap-3">
          <span className="vx-pulse-dot" />
          United States &nbsp;&bull;&nbsp; India Delivery Team
        </span>
        <span className="hidden md:flex items-center gap-2 text-[#9aa590]">
          SYS.STATUS — ONLINE
          <span className="w-12 h-[1px] bg-[rgba(157,255,63,0.4)]" />
        </span>
        <a href="#capabilities" className="flex items-center gap-2 hover:text-[#9dff3f] transition-colors">
          Scroll
          <ArrowDown size={13} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
