"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { emitLoaded } from "./useLoaded";

const CHARS = ["V", "E", "X", "O", "N"];

const TIPS = [
  "Booting engineering systems",
  "Compiling AI pipelines",
  "Provisioning cloud infrastructure",
  "Calibrating data models",
  "Establishing secure connection",
  "Optimizing delivery pipeline",
  "Indexing software architecture",
  "Synchronizing delivery teams",
  "Initializing Vexon Solutions",
];

const DURATION_MS = 2400;
const TIP_INTERVAL_MS = 480;
const EXIT_EASE = [0.72, 0, 0.28, 1] as const;

export default function LoadingScreen() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      emitLoaded();
      return;
    }

    document.body.style.overflow = "hidden";
    const start = performance.now();

    const tipTimer = window.setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length);
    }, TIP_INTERVAL_MS);

    let raf = 0;
    const tick = (t: number) => {
      const pct = Math.min((t - start) / DURATION_MS, 1);
      setProgress(pct);
      if (pct < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const closeTimer = window.setTimeout(() => {
      emitLoaded();
      setVisible(false);
    }, DURATION_MS);

    return () => {
      window.clearInterval(tipTimer);
      window.clearTimeout(closeTimer);
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!visible) document.body.style.overflow = "";
  }, [visible]);

  if (reduceMotion) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="Loading Vexon Solutions"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: EXIT_EASE } }}
          onClick={() => {
            emitLoaded();
            setVisible(false);
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050704] cursor-pointer"
        >
          <div className="absolute inset-0 vx-grid-bg opacity-40" />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(157,255,63,0.09), transparent 65%)",
            }}
            exit={{
              opacity: 0,
              scale: 1.4,
              transition: { duration: 0.8, ease: EXIT_EASE },
            }}
          />

          <motion.div
            className="relative flex items-end gap-1.5 sm:gap-2.5"
            exit={{
              transition: { duration: 0.85, ease: EXIT_EASE },
            }}
          >
            {CHARS.map((c, i) => {
              const dirX = (i - (CHARS.length - 1) / 2) * 28;
              return (
                <motion.span
                  key={c}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: -60,
                    x: dirX,
                    scale: 7 + i * 0.15,
                    filter: "blur(6px)",
                    transition: {
                      duration: 0.85,
                      delay: i * 0.03,
                      ease: EXIT_EASE,
                    },
                  }}
                  transition={{
                    duration: 0.55,
                    delay: 0.15 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-[15vw] sm:text-[6.5rem] leading-none font-bold text-transparent will-change-transform"
                  style={{
                    WebkitTextStroke: "1.5px #9dff3f",
                    textShadow: "0 0 28px rgba(157,255,63,0.35)",
                  }}
                >
                  {c}
                </motion.span>
              );
            })}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 3.5,
              filter: "blur(4px)",
              transition: { duration: 0.7, ease: EXIT_EASE },
            }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="relative mt-6 text-[9px] sm:text-[10px] font-mono tracking-[0.34em] uppercase text-[#6f7a66]"
          >
            Solutions Inc
          </motion.p>

          <motion.div
            className="relative mt-10 w-[180px] sm:w-[220px]"
            exit={{
              opacity: 0,
              y: 40,
              transition: { duration: 0.45, ease: EXIT_EASE },
            }}
          >
            <div className="h-[2px] bg-[rgba(255,255,255,0.08)] overflow-hidden">
              <div
                className="h-full bg-[#9dff3f]"
                style={{ width: `${progress * 100}%`, transition: "width 80ms linear" }}
              />
            </div>
            <div className="mt-4 h-4 relative overflow-hidden text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tipIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-x-0 text-[9px] font-mono tracking-[0.18em] uppercase text-[#9aa590]"
                >
                  {TIPS[tipIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
