"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
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

// Timing (ms)
const CASCADE_START_MS = 220;
const CASCADE_STEP_MS = 210;
const CASCADE_END_MS = CASCADE_START_MS + CASCADE_STEP_MS * CHARS.length; // ~1270
const PROGRESS_APPEAR_MS = 650;           // bar fades in mid-cascade
const FILL_DURATION_MS = 2900;             // bar fills over the whole load
const COMPLETE_HOLD_MS = 380;              // pause on 100% for the "ready" pulse
const TOTAL_MS = FILL_DURATION_MS + COMPLETE_HOLD_MS;
const TIP_INTERVAL_MS = 480;

const REVEAL_EASE = [0.2, 0.7, 0.15, 1] as const;

export default function LoadingScreen() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      emitLoaded();
      return;
    }

    document.body.style.overflow = "hidden";
    const start = performance.now();
    const timers: number[] = [];

    for (let i = 1; i <= CHARS.length; i++) {
      timers.push(
        window.setTimeout(
          () => setVisibleCount(i),
          CASCADE_START_MS + CASCADE_STEP_MS * (i - 1)
        )
      );
    }

    timers.push(
      window.setTimeout(() => setShowProgress(true), PROGRESS_APPEAR_MS)
    );

    let tipInterval = 0;
    timers.push(
      window.setTimeout(() => {
        tipInterval = window.setInterval(
          () => setTipIndex((i) => (i + 1) % TIPS.length),
          TIP_INTERVAL_MS
        );
      }, PROGRESS_APPEAR_MS + 100)
    );

    let raf = 0;
    const tick = (t: number) => {
      const elapsed = t - start;
      const pct = Math.max(0, Math.min(elapsed / FILL_DURATION_MS, 1));
      setProgress(pct);
      if (elapsed < FILL_DURATION_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Progress hits 100% → celebrate for COMPLETE_HOLD_MS → exit
    timers.push(
      window.setTimeout(() => setComplete(true), FILL_DURATION_MS)
    );
    timers.push(
      window.setTimeout(() => {
        emitLoaded();
        setVisible(false);
      }, TOTAL_MS)
    );

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      if (tipInterval) window.clearInterval(tipInterval);
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!visible) document.body.style.overflow = "";
  }, [visible]);

  if (reduceMotion) return null;

  const cascadeComplete = visibleCount >= CHARS.length;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="Loading Vexon Solutions"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
          }}
          onClick={() => {
            emitLoaded();
            setVisible(false);
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#050704]"
        >
          <div className="absolute inset-0 vx-grid-bg opacity-40" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(157,255,63,0.08), transparent 65%)",
            }}
          />

          {/* Horizon sweep behind the wordmark; intensifies at completion */}
          <motion.div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px pointer-events-none"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{
              opacity: complete ? 0.8 : 0.35,
              scaleX: 1,
            }}
            transition={{ duration: 1.4, ease: REVEAL_EASE }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(157,255,63,0.55), transparent)",
              transformOrigin: "50% 50%",
            }}
          />

          {/* Completion bloom — a soft lime aura fires from behind the wordmark */}
          <motion.div
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: "clamp(320px, 55vw, 900px)",
              height: "clamp(140px, 20vw, 320px)",
              marginLeft: "calc(clamp(320px, 55vw, 900px) / -2)",
              marginTop: "calc(clamp(140px, 20vw, 320px) / -2)",
              background:
                "radial-gradient(ellipse at center, rgba(157,255,63,0.42), rgba(157,255,63,0.15) 42%, transparent 72%)",
              filter: "blur(28px)",
              mixBlendMode: "screen",
              willChange: "transform, opacity",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              complete
                ? { opacity: [0, 0.9, 0.55], scale: [0.9, 1.15, 1.05] }
                : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.55, ease: "easeOut", times: [0, 0.5, 1] }}
          />

          {/* ─── WORDMARK CASCADE ─────────────────────────────────────────── */}
          <motion.div
            animate={complete ? { scale: [1, 1.032, 1] } : { scale: 1 }}
            transition={{ duration: 0.55, ease: [0.2, 0.7, 0.15, 1] }}
            style={{ willChange: "transform" }}
          >
            <LayoutGroup>
              <motion.div
                layout
                transition={{
                  layout: { duration: 0.55, ease: REVEAL_EASE },
                }}
                className="relative flex items-end gap-1.5 sm:gap-2.5"
              >
                <AnimatePresence initial={false}>
                  {CHARS.slice(0, visibleCount).map((c, i) => (
                    <motion.span
                      key={c}
                      layout
                      initial={{ opacity: 0, scale: 0.35, y: 44 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -14,
                        transition: {
                          duration: 0.5,
                          delay: 0.02 * i,
                          ease: [0.4, 0, 0.2, 1],
                        },
                      }}
                      transition={{
                        layout: { duration: 0.55, ease: REVEAL_EASE },
                        opacity: { duration: 0.55, ease: REVEAL_EASE },
                        scale: { duration: 0.75, ease: [0.16, 1.1, 0.3, 1] },
                        y: { duration: 0.75, ease: REVEAL_EASE },
                      }}
                      className="text-[15vw] sm:text-[6.5rem] leading-none font-bold text-transparent"
                      style={{
                        WebkitTextStroke: "1.5px #9dff3f",
                        textShadow: complete
                          ? "0 0 40px rgba(157,255,63,0.75), 0 0 90px rgba(157,255,63,0.35)"
                          : "0 0 28px rgba(157,255,63,0.35)",
                        transitionProperty: "text-shadow",
                        transitionDuration: "0.4s",
                        transitionTimingFunction: "ease-out",
                        willChange: "transform, opacity",
                      }}
                    >
                      {c}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={
              cascadeComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.7, delay: 0.05, ease: REVEAL_EASE }}
            className="relative mt-6 text-[9px] sm:text-[10px] font-mono tracking-[0.34em] uppercase text-[#6f7a66]"
          >
            Solutions Inc
          </motion.p>

          <motion.div
            className="relative mt-10 w-[180px] sm:w-[220px]"
            initial={{ opacity: 0, y: 14 }}
            animate={
              showProgress ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
            }
            transition={{ duration: 0.65, ease: REVEAL_EASE }}
          >
            <div className="h-[2px] bg-[rgba(255,255,255,0.08)] overflow-hidden">
              <div
                className="h-full bg-[#9dff3f]"
                style={{
                  width: `${progress * 100}%`,
                  transition:
                    "width 90ms linear, box-shadow 0.4s ease-out",
                  boxShadow: complete
                    ? "0 0 22px rgba(157,255,63,0.95)"
                    : "0 0 10px rgba(157,255,63,0.5)",
                }}
              />
            </div>
            <div className="mt-4 h-4 relative overflow-hidden text-center">
              <AnimatePresence mode="wait">
                {complete ? (
                  <motion.p
                    key="ready"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="absolute inset-x-0 text-[9px] font-mono tracking-[0.24em] uppercase text-[#9dff3f]"
                    style={{ textShadow: "0 0 10px rgba(157,255,63,0.6)" }}
                  >
                    Systems Online
                  </motion.p>
                ) : (
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
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
