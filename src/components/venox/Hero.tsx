"use client";

import { motion } from "framer-motion";
import { ArrowDown, GhostButton, LimeButton } from "./ui";
import HeroBackground from "./HeroBackground";

const ease = [0.16, 1, 0.3, 1] as const;
const LINES = ["We build the", "systems behind", "ambitious", "businesses"];

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] flex flex-col overflow-hidden vx-grain">
      <div className="absolute inset-0 vx-grid-bg" />
      <HeroBackground />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(5,7,4,0.82)_0%,rgba(5,7,4,0.45)_34%,rgba(5,7,4,0.05)_62%,rgba(5,7,4,0)_78%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(5,7,4,0.55)_0%,rgba(5,7,4,0)_26%,rgba(5,7,4,0)_58%,rgba(5,7,4,0.96)_100%)]" />
      <div className="vx-scanline" />

      <div className="absolute top-24 left-6 vx-hud-corner !border-t-[1px] !border-l-[1px] hidden md:block" />
      <div className="absolute top-24 right-6 vx-hud-corner !border-t-[1px] !border-r-[1px] hidden md:block" />
      <div className="absolute bottom-24 left-6 vx-hud-corner !border-b-[1px] !border-l-[1px] hidden md:block" />
      <div className="absolute bottom-24 right-6 vx-hud-corner !border-b-[1px] !border-r-[1px] hidden md:block" />

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="vx-container w-full pt-32 pb-20">
          <motion.p
            className="vx-tag mb-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
          >
            Technology &amp; Digital Engineering Partner
          </motion.p>

          <h1 className="vx-h1 text-white select-none">
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                <motion.span
                  className="block"
                  initial={{ y: "112%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.11, ease }}
                >
                  {line}
                  {i === LINES.length - 1 && <span className="text-[#9dff3f]">.</span>}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-8 max-w-[400px] text-[15px] leading-relaxed text-[#9aa590]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95, ease }}
          >
            Software engineering, AI, data and cloud capabilities delivered as one engineering partner.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease }}
          >
            <LimeButton href="#capabilities">Explore Capabilities</LimeButton>
            <GhostButton href="#contact">Start a Conversation</GhostButton>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="relative z-10 vx-container pb-8 flex items-center justify-between text-[10px] font-mono tracking-[0.22em] uppercase text-[#6f7a66]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
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
