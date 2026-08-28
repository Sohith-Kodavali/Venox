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
const CASCADE_END_MS = CASCADE_START_MS + CASCADE_STEP_MS * CHARS.length;
const PROGRESS_APPEAR_MS = 650;
const FILL_DURATION_MS = 2900;
const COMPLETE_HOLD_MS = 900; // longer, cinematic completion beat
const TOTAL_MS = FILL_DURATION_MS + COMPLETE_HOLD_MS;
const TIP_INTERVAL_MS = 480;

const REVEAL_EASE = [0.2, 0.7, 0.15, 1] as const;

// ─── Scrambled-text reveal ────────────────────────────────────────────────
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$@%&";

function ScrambleText({
  text,
  duration = 620,
}: {
  text: string;
  duration?: number;
}) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const reveal = Math.floor(text.length * p);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " ") {
          s += " ";
        } else if (i < reveal) {
          s += ch;
        } else {
          s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setOutput(s);
      if (p < 1) raf = requestAnimationFrame(step);
      else setOutput(text);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, duration]);

  return <>{output}</>;
}

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

          {/* Horizon sweep behind wordmark; intensifies on completion */}
          <motion.div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px pointer-events-none"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{
              opacity: complete ? 0.9 : 0.35,
              scaleX: 1,
            }}
            transition={{ duration: 1.4, ease: REVEAL_EASE }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(157,255,63,0.6), transparent)",
              transformOrigin: "50% 50%",
            }}
          />

          {/* COMPLETION SCAN LINE — a bright horizontal beam sweeps DOWN
              across the wordmark at the moment progress hits 100% */}
          {complete && (
            <>
              <motion.div
                className="absolute inset-x-0 pointer-events-none"
                style={{
                  height: "3px",
                  top: "calc(50% - 90px)",
                  background:
                    "linear-gradient(90deg, transparent, rgba(230,255,184,0.95) 20%, #e6ffb8 50%, rgba(230,255,184,0.95) 80%, transparent)",
                  boxShadow:
                    "0 0 24px rgba(157,255,63,0.9), 0 0 60px rgba(157,255,63,0.55)",
                  willChange: "transform, opacity",
                }}
                initial={{ opacity: 0, y: 0, scaleX: 0.2 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [0, 180],
                  scaleX: [0.2, 1, 1, 1],
                }}
                transition={{
                  duration: 0.75,
                  times: [0, 0.1, 0.9, 1],
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
              {/* Trailing fainter echo of the scan */}
              <motion.div
                className="absolute inset-x-0 pointer-events-none"
                style={{
                  height: "1px",
                  top: "calc(50% - 90px)",
                  background:
                    "linear-gradient(90deg, transparent, rgba(157,255,63,0.6), transparent)",
                  boxShadow: "0 0 8px rgba(157,255,63,0.5)",
                }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.7, 0], y: [0, 180] }}
                transition={{
                  duration: 0.85,
                  delay: 0.12,
                  times: [0, 0.5, 1],
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            </>
          )}

          {/* Completion bloom — larger, brighter, layered flashes */}
          <motion.div
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: "clamp(360px, 62vw, 1000px)",
              height: "clamp(160px, 22vw, 360px)",
              marginLeft: "calc(clamp(360px, 62vw, 1000px) / -2)",
              marginTop: "calc(clamp(160px, 22vw, 360px) / -2)",
              background:
                "radial-gradient(ellipse at center, rgba(157,255,63,0.55), rgba(157,255,63,0.18) 42%, transparent 72%)",
              filter: "blur(32px)",
              mixBlendMode: "screen",
              willChange: "transform, opacity",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              complete
                ? {
                    opacity: [0, 1, 0.55, 0.85, 0.55],
                    scale: [0.9, 1.25, 1.05, 1.15, 1.08],
                  }
                : { opacity: 0, scale: 0.9 }
            }
            transition={{
              duration: 0.9,
              ease: "easeOut",
              times: [0, 0.2, 0.5, 0.75, 1],
            }}
          />

          {/* Radial energy ring — expands outward from wordmark on completion */}
          {complete && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, transparent 18%, rgba(157,255,63,0.28) 26%, transparent 40%)",
                mixBlendMode: "screen",
                willChange: "transform, opacity",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.55, 0], scale: [0.8, 1.8, 2.2] }}
              transition={{
                duration: 0.85,
                times: [0, 0.4, 1],
                ease: [0.4, 0, 0.6, 1],
              }}
            />
          )}

          {/* ─── WORDMARK CASCADE ─────────────────────────────────────────── */}
          <motion.div
            animate={
              complete
                ? { scale: [1, 1.045, 1, 1.025, 1] }
                : { scale: 1 }
            }
            transition={{
              duration: 0.75,
              ease: [0.2, 0.7, 0.15, 1],
              times: [0, 0.2, 0.5, 0.75, 1],
            }}
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
                        WebkitTextStroke: complete
                          ? "1.8px #b6ff57"
                          : "1.5px #9dff3f",
                        textShadow: complete
                          ? "0 0 50px rgba(157,255,63,0.85), 0 0 120px rgba(157,255,63,0.45)"
                          : "0 0 28px rgba(157,255,63,0.35)",
                        transitionProperty: "text-shadow, -webkit-text-stroke",
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
            <div className="h-[2px] bg-[rgba(255,255,255,0.08)] overflow-hidden relative">
              <div
                className="h-full bg-[#9dff3f]"
                style={{
                  width: `${progress * 100}%`,
                  transition:
                    "width 90ms linear, box-shadow 0.4s ease-out",
                  boxShadow: complete
                    ? "0 0 26px rgba(157,255,63,1), 0 0 60px rgba(157,255,63,0.55)"
                    : "0 0 10px rgba(157,255,63,0.5)",
                }}
              />
              {/* Progress bar completion flash */}
              {complete && (
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(230,255,184,0.9), transparent)",
                  }}
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={{ opacity: [0, 1, 0], x: "100%" }}
                  transition={{
                    duration: 0.5,
                    times: [0, 0.4, 1],
                    ease: "easeOut",
                  }}
                />
              )}
            </div>
            <div className="mt-4 h-4 relative overflow-hidden text-center">
              <AnimatePresence mode="wait">
                {complete ? (
                  <motion.p
                    key="ready"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="absolute inset-x-0 text-[9px] font-mono tracking-[0.26em] uppercase text-[#9dff3f]"
                    style={{ textShadow: "0 0 12px rgba(157,255,63,0.7)" }}
                  >
                    <span aria-hidden="true" className="mr-1">▸</span>
                    <ScrambleText text="SYSTEMS ONLINE" duration={620} />
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
