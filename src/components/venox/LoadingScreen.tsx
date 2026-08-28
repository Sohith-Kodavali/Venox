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

// Timing (ms)
const CASCADE_START_MS = 220;
const CASCADE_STEP_MS = 210;
const CASCADE_END_MS = CASCADE_START_MS + CASCADE_STEP_MS * CHARS.length; // ~1270
const TAG_APPEAR_MS = CASCADE_END_MS + 160;                                // ~1430
const PROGRESS_START_MS = CASCADE_END_MS + 260;                            // ~1530
const DURATION_MS = 2900;
const TIP_INTERVAL_MS = 460;

// Easings
const REVEAL_EASE = [0.2, 0.7, 0.15, 1] as const;
const PORTAL_EASE = [0.55, 0, 0.3, 1] as const;
const EXIT_EASE = [0.72, 0, 0.28, 1] as const;

const X_PATH = "M18,18 L82,82 M82,18 L18,82";

export default function LoadingScreen() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      emitLoaded();
      return;
    }

    document.body.style.overflow = "hidden";
    const start = performance.now();

    const timers: number[] = [];

    // Letter cascade — one at a time, layout-animated so existing letters
    // smoothly slide left as new ones join on the right.
    for (let i = 1; i <= CHARS.length; i++) {
      timers.push(
        window.setTimeout(
          () => setVisibleCount(i),
          CASCADE_START_MS + CASCADE_STEP_MS * (i - 1)
        )
      );
    }

    // Tips cycle after the wordmark is complete
    let tipInterval = 0;
    timers.push(
      window.setTimeout(() => {
        tipInterval = window.setInterval(
          () => setTipIndex((i) => (i + 1) % TIPS.length),
          TIP_INTERVAL_MS
        );
      }, CASCADE_END_MS + 100)
    );

    let raf = 0;
    const tick = (t: number) => {
      const elapsed = t - start;
      const pct = Math.max(
        0,
        Math.min(
          (elapsed - PROGRESS_START_MS) / (DURATION_MS - PROGRESS_START_MS),
          1
        )
      );
      setProgress(pct);
      if (elapsed < DURATION_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const closeTimer = window.setTimeout(() => {
      emitLoaded();
      setVisible(false);
    }, DURATION_MS);
    timers.push(closeTimer);

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
            transition: { duration: 0.12, delay: 1.0, ease: "linear" },
          }}
          onClick={() => {
            emitLoaded();
            setVisible(false);
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden"
          style={{ contain: "layout paint" }}
        >
          {/* Solid backdrop — dissolves so the portal reveals the hero */}
          <motion.div
            className="absolute inset-0 bg-[#050704]"
            exit={{
              opacity: 0,
              transition: { duration: 0.55, delay: 0.3, ease: "easeInOut" },
            }}
          />
          <motion.div
            className="absolute inset-0 vx-grid-bg opacity-40"
            exit={{
              opacity: 0,
              transition: { duration: 0.45, delay: 0.2, ease: "easeInOut" },
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

          {/* Subtle ambient sweep behind the wordmark while cascading */}
          <motion.div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px pointer-events-none"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.35, scaleX: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 1.4, ease: REVEAL_EASE }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(157,255,63,0.45), transparent)",
              transformOrigin: "50% 50%",
            }}
          />

          {/* ─── WORDMARK CASCADE ─────────────────────────────────────────── */}
          <LayoutGroup>
            <motion.div
              layout
              transition={{
                layout: { duration: 0.55, ease: REVEAL_EASE },
              }}
              className="relative flex items-end gap-1.5 sm:gap-2.5"
            >
              <AnimatePresence initial={false}>
                {CHARS.slice(0, visibleCount).map((c, i) => {
                  const isX = i === X_INDEX;
                  const distFromX = i - X_INDEX; // signed
                  const shared = {
                    layout: true,
                    className:
                      "text-[15vw] sm:text-[6.5rem] leading-none font-bold text-transparent",
                    style: {
                      WebkitTextStroke: isX ? "1.8px #9dff3f" : "1.5px #9dff3f",
                      textShadow: isX
                        ? "0 0 34px rgba(157,255,63,0.5)"
                        : "0 0 28px rgba(157,255,63,0.35)",
                      willChange: "transform, opacity",
                    } as React.CSSProperties,
                    transition: {
                      layout: { duration: 0.55, ease: REVEAL_EASE },
                      opacity: { duration: 0.55, ease: REVEAL_EASE },
                      scale: { duration: 0.75, ease: [0.16, 1.1, 0.3, 1] },
                      y: { duration: 0.75, ease: REVEAL_EASE },
                    },
                  } as const;

                  if (isX) {
                    return (
                      <motion.span
                        key={c}
                        {...shared}
                        initial={{ opacity: 0, scale: 0.35, y: 44 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        // X stays and charges up as the others converge into it
                        exit={{
                          opacity: [1, 1, 0],
                          scale: [1, 1.4, 0.85],
                          transition: {
                            duration: 0.55,
                            times: [0, 0.55, 1],
                            ease: [0.6, 0, 0.4, 1],
                          },
                        }}
                      >
                        {c}
                      </motion.span>
                    );
                  }

                  return (
                    <motion.span
                      key={c}
                      {...shared}
                      initial={{ opacity: 0, scale: 0.35, y: 44 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      // Non-X letters drift INTO the X on exit
                      exit={{
                        opacity: 0,
                        scale: 0.35,
                        x: -distFromX * 90,
                        y: 0,
                        transition: {
                          duration: 0.42,
                          delay: 0.02 * Math.abs(distFromX),
                          ease: [0.55, 0, 0.45, 1],
                        },
                      }}
                    >
                      {c}
                    </motion.span>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          <motion.p
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={
              cascadeComplete
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 12, filter: "blur(6px)" }
            }
            exit={{
              opacity: 0,
              y: 20,
              transition: { duration: 0.32, ease: "easeIn" },
            }}
            transition={{ duration: 0.7, delay: 0.05, ease: REVEAL_EASE }}
            className="relative mt-6 text-[9px] sm:text-[10px] font-mono tracking-[0.34em] uppercase text-[#6f7a66]"
          >
            Solutions Inc
          </motion.p>

          <motion.div
            className="relative mt-10 w-[180px] sm:w-[220px]"
            initial={{ opacity: 0, y: 14 }}
            animate={
              cascadeComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
            }
            transition={{ duration: 0.7, delay: 0.2, ease: REVEAL_EASE }}
            exit={{
              opacity: 0,
              y: 30,
              transition: { duration: 0.3, ease: "easeIn" },
            }}
          >
            <div className="h-[2px] bg-[rgba(255,255,255,0.08)] overflow-hidden">
              <motion.div
                className="h-full bg-[#9dff3f]"
                style={{
                  width: `${progress * 100}%`,
                  transition: "width 80ms linear",
                  boxShadow: "0 0 12px rgba(157,255,63,0.55)",
                }}
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

          {/* ─── PORTAL FINALE — depth-stacked SVG Xs + flash ──────────── */}

          {/* Back X — chunky, dimmer, counter-rotates for 3D depth */}
          <motion.svg
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              width: "clamp(260px, 44vw, 720px)",
              height: "clamp(260px, 44vw, 720px)",
              transformOrigin: "50% 50%",
              transformBox: "fill-box",
              willChange: "transform, opacity",
              marginLeft: "calc(clamp(260px, 44vw, 720px) / -2)",
              marginTop: "calc(clamp(260px, 44vw, 720px) / -2)",
            }}
            initial={{ opacity: 0, scale: 0.32, rotate: 6 }}
            animate={{ opacity: 0, scale: 0.32, rotate: 6 }}
            exit={{
              opacity: [0, 0.55, 0.55, 0],
              scale: [0.32, 0.45, 5.4, 5.7],
              rotate: [6, 3, -3, -5],
              transition: {
                duration: 0.98,
                times: [0, 0.2, 0.82, 1],
                ease: PORTAL_EASE,
              },
            }}
          >
            <path
              d={X_PATH}
              stroke="#4a7d1f"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
          </motion.svg>

          {/* Front X — crisp, glowing, the actual portal */}
          <motion.svg
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              width: "clamp(240px, 40vw, 640px)",
              height: "clamp(240px, 40vw, 640px)",
              transformOrigin: "50% 50%",
              transformBox: "fill-box",
              willChange: "transform, opacity",
              marginLeft: "calc(clamp(240px, 40vw, 640px) / -2)",
              marginTop: "calc(clamp(240px, 40vw, 640px) / -2)",
            }}
            initial={{ opacity: 0, scale: 0.5, rotate: -6 }}
            animate={{ opacity: 0, scale: 0.5, rotate: -6 }}
            exit={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 0.65, 4.8, 5.1],
              rotate: [-6, 0, 5, 8],
              transition: {
                duration: 0.96,
                times: [0, 0.2, 0.82, 1],
                ease: PORTAL_EASE,
              },
            }}
          >
            {/* Concentric strokes fake bloom without expensive filters */}
            <path
              d={X_PATH}
              stroke="#9dff3f"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              opacity="0.22"
            />
            <path
              d={X_PATH}
              stroke="#b6ff57"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
              opacity="0.55"
            />
            <path
              d={X_PATH}
              stroke="#e6ffb8"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </motion.svg>

          {/* Bright flash timed to the portal peak */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            exit={{
              opacity: [0, 0.6, 0.2, 0],
              transition: {
                duration: 0.5,
                delay: 0.5,
                times: [0, 0.35, 0.7, 1],
                ease: "easeOut",
              },
            }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(230,255,184,0.75), rgba(157,255,63,0.32) 42%, transparent 74%)",
              mixBlendMode: "screen",
              willChange: "opacity",
            }}
          />

          {/* Shockwave ring — lime radial band expanding outward */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0, scale: 0.9 }}
            exit={{
              opacity: [0, 0, 0.4, 0],
              scale: [0.9, 1.1, 1.9, 2.2],
              transition: {
                duration: 0.75,
                delay: 0.45,
                times: [0, 0.2, 0.55, 1],
                ease: [0.4, 0, 0.6, 1],
              },
            }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 22%, rgba(157,255,63,0.32) 33%, transparent 55%)",
              mixBlendMode: "screen",
              willChange: "transform, opacity",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
