"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { emitLoaded } from "./useLoaded";

const CHARS = ["V", "E", "X", "O", "N"];
const X_INDEX = 2;

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
const X_EXIT_EASE = [0.55, 0, 0.35, 1] as const;

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
          // Container removal delayed until after the X portal finishes.
          exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.9, ease: "linear" } }}
          onClick={() => {
            emitLoaded();
            setVisible(false);
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer"
        >
          {/* Solid backdrop — fades out MID-exit so the growing X frames the hero */}
          <motion.div
            className="absolute inset-0 bg-[#050704]"
            exit={{
              opacity: 0,
              transition: { duration: 0.55, delay: 0.2, ease: "easeInOut" },
            }}
          />
          <motion.div
            className="absolute inset-0 vx-grid-bg opacity-40"
            exit={{
              opacity: 0,
              transition: { duration: 0.45, delay: 0.15, ease: "easeInOut" },
            }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(157,255,63,0.09), transparent 65%)",
            }}
            exit={{
              opacity: 0,
              scale: 1.6,
              transition: { duration: 0.65, ease: EXIT_EASE },
            }}
          />

          <div className="relative flex items-end gap-1.5 sm:gap-2.5">
            {CHARS.map((c, i) => {
              const isX = i === X_INDEX;
              if (isX) {
                return (
                  <motion.span
                    key={c}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    // The camera flies INTO the X — it inflates to fill the frame,
                    // becoming a lime portal through which the hero is revealed.
                    exit={{
                      scale: 60,
                      opacity: 0,
                      filter: "blur(28px)",
                      transition: {
                        default: { duration: 0.95, ease: X_EXIT_EASE },
                        opacity: { duration: 0.32, delay: 0.63, ease: "easeOut" },
                        filter: { duration: 0.7, delay: 0.3, ease: "easeOut" },
                      },
                    }}
                    transition={{
                      duration: 0.55,
                      delay: 0.15 + i * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-[15vw] sm:text-[6.5rem] leading-none font-bold text-transparent will-change-transform"
                    style={{
                      WebkitTextStroke: "2px #9dff3f",
                      textShadow: "0 0 40px rgba(157,255,63,0.55)",
                      transformOrigin: "50% 50%",
                    }}
                  >
                    {c}
                  </motion.span>
                );
              }

              // Surrounding glyphs collapse quickly to hand the frame to X
              const distFromX = Math.abs(i - X_INDEX);
              return (
                <motion.span
                  key={c}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.55,
                    y: 14,
                    filter: "blur(6px)",
                    transition: {
                      duration: 0.32,
                      delay: 0.02 * distFromX,
                      ease: "easeIn",
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
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: 20,
              filter: "blur(4px)",
              transition: { duration: 0.32, ease: "easeIn" },
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
              y: 30,
              transition: { duration: 0.32, ease: "easeIn" },
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
