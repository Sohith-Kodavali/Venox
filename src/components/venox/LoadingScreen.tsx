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

// ── Timing (ms) ────────────────────────────────────────────────────────────
const CASCADE_START_MS = 220;
const CASCADE_STEP_MS = 210;
const CASCADE_END_MS = CASCADE_START_MS + CASCADE_STEP_MS * CHARS.length; // 1270
const PROGRESS_APPEAR_MS = 60;      // bar visible almost immediately
const FILL_DURATION_MS = 2400;      // progress reaches 100% here

// Ending choreography
const COMPLETE_BEAT_MS = 380;        // "systems online" beat
const CONVERGE_MS = 520;             // non-V letters get consumed
const ZOOM_MS = 780;                 // V scales up + fades
const OUTRO_MS = COMPLETE_BEAT_MS + CONVERGE_MS + ZOOM_MS; // 1680
const TOTAL_MS = FILL_DURATION_MS + OUTRO_MS;              // 4080

// emit loaded at V-zoom start so hero animations begin as V fades to reveal it
const LOADED_AT_MS = FILL_DURATION_MS + COMPLETE_BEAT_MS + CONVERGE_MS;

const TIP_INTERVAL_MS = 460;

const REVEAL_EASE = [0.2, 0.7, 0.15, 1] as const;
const IN_OUT_EASE = [0.4, 0, 0.2, 1] as const;
const V_ZOOM_EASE = [0.35, 0.02, 0.4, 1] as const;

// ── Scrambled text reveal ──────────────────────────────────────────────────
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$@%&";
function ScrambleText({ text, duration = 560 }: { text: string; duration?: number }) {
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
        if (ch === " ") s += " ";
        else if (i < reveal) s += ch;
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
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

// ── Component ──────────────────────────────────────────────────────────────
export default function LoadingScreen() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [complete, setComplete] = useState(false);   // progress hit 100%
  const [converge, setConverge] = useState(false);   // non-V letters exit
  const [zoom, setZoom] = useState(false);           // V zooms up + fades

  useEffect(() => {
    if (reduceMotion) {
      emitLoaded();
      return;
    }

    // Lock scroll during load — html + body, plus disable Next's scroll
    // restoration briefly so we always start at the top when the loader
    // dismisses (mobile Safari sometimes restored to section 2)
    const prevScrollRestoration =
      typeof history !== "undefined" ? history.scrollRestoration : undefined;
    if (typeof history !== "undefined") history.scrollRestoration = "manual";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.scrollTo(0, 0);

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

    timers.push(window.setTimeout(() => setShowProgress(true), PROGRESS_APPEAR_MS));

    let tipInterval = 0;
    timers.push(
      window.setTimeout(() => {
        tipInterval = window.setInterval(
          () => setTipIndex((i) => (i + 1) % TIPS.length),
          TIP_INTERVAL_MS
        );
      }, PROGRESS_APPEAR_MS + 200)
    );

    let raf = 0;
    const tick = (t: number) => {
      const elapsed = t - start;
      const pct = Math.max(0, Math.min(elapsed / FILL_DURATION_MS, 1));
      setProgress(pct);
      if (elapsed < FILL_DURATION_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Choreograph the outro
    timers.push(window.setTimeout(() => setComplete(true), FILL_DURATION_MS));
    timers.push(
      window.setTimeout(() => setConverge(true), FILL_DURATION_MS + COMPLETE_BEAT_MS)
    );
    timers.push(
      window.setTimeout(() => {
        // Snap to top before hero reveal (mobile browsers can accumulate
        // touch scroll during the loader)
        window.scrollTo(0, 0);
        setZoom(true);
      }, LOADED_AT_MS)
    );
    // Emit loaded + hide overlay together, exactly like the click-to-skip
    // path does. That gives hero animations a clean canvas to enter on
    // instead of arriving mid-V-zoom while the loader is still occupying
    // the frame — the "skipped is smoother" complaint.
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
      document.documentElement.style.overflow = "";
      if (typeof history !== "undefined" && prevScrollRestoration !== undefined) {
        history.scrollRestoration = prevScrollRestoration;
      }
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, 0);
    }
  }, [visible]);

  if (reduceMotion) return null;

  const cascadeComplete = visibleCount >= CHARS.length;

  // During converge, keep only V in the array — non-V letters exit via
  // AnimatePresence's exit animation while V smoothly re-centers via layout.
  const displayedChars = converge
    ? CHARS.slice(0, 1)
    : CHARS.slice(0, visibleCount);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="Loading Vexon Solutions"
          initial={{ opacity: 1 }}
          // Backdrop fade coordinates with V zoom so hero appears through
          exit={{
            opacity: 0,
            transition: { duration: 0.28, ease: IN_OUT_EASE },
          }}
          onClick={() => {
            emitLoaded();
            setVisible(false);
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#050704]"
        >
          {/* Backdrop dims during V zoom so hero shows through as V fades */}
          <motion.div
            className="absolute inset-0 vx-grid-bg opacity-40"
            animate={{ opacity: zoom ? 0 : 0.4 }}
            transition={{ duration: 0.55, ease: IN_OUT_EASE }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(157,255,63,0.055), transparent 65%)",
            }}
            animate={{ opacity: zoom ? 0 : 1 }}
            transition={{ duration: 0.55, ease: IN_OUT_EASE }}
          />

          {/* Solid bg fade — starts partway through zoom so V is still legible */}
          <motion.div
            className="absolute inset-0 bg-[#050704] pointer-events-none"
            animate={{ opacity: zoom ? 0 : 1 }}
            transition={{ duration: 0.55, delay: 0.15, ease: IN_OUT_EASE }}
          />

          {/* Completion / zoom bloom */}
          <motion.div
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: "clamp(360px, 62vw, 1000px)",
              height: "clamp(160px, 22vw, 360px)",
              marginLeft: "calc(clamp(360px, 62vw, 1000px) / -2)",
              marginTop: "calc(clamp(160px, 22vw, 360px) / -2)",
              background:
                "radial-gradient(ellipse at center, rgba(157,255,63,0.32), rgba(157,255,63,0.11) 42%, transparent 72%)",
              filter: "blur(32px)",
              mixBlendMode: "screen",
              willChange: "transform, opacity",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              zoom
                ? { opacity: [0.4, 0.75, 0], scale: [1.1, 2.2, 3] }
                : complete
                ? { opacity: [0, 0.6, 0.4], scale: [0.9, 1.3, 1.1] }
                : { opacity: 0, scale: 0.9 }
            }
            transition={{
              duration: zoom ? 0.75 : 0.7,
              ease: "easeOut",
              times: [0, 0.4, 1],
            }}
          />

          {/* ─── WORDMARK ────────────────────────────────────────────────── */}
          <LayoutGroup>
            <motion.div
              layout
              transition={{ layout: { duration: 0.55, ease: REVEAL_EASE } }}
              className="relative flex items-end gap-1.5 sm:gap-2.5"
            >
              <AnimatePresence initial={false}>
                {displayedChars.map((c, i) => {
                  const isV = c === "V";

                  // V — receives the layout re-center + owns the final zoom
                  if (isV) {
                    return (
                      <motion.span
                        key={c}
                        layout
                        initial={{ opacity: 0, scale: 0.35, y: 44 }}
                        animate={
                          zoom
                            ? { opacity: 0, scale: 7, y: 0 }
                            : complete
                            ? { opacity: 1, scale: 1.05, y: 0 }
                            : { opacity: 1, scale: 1, y: 0 }
                        }
                        transition={{
                          layout: { duration: 0.55, ease: REVEAL_EASE },
                          opacity: {
                            duration: zoom ? ZOOM_MS / 1000 : 0.55,
                            ease: zoom ? V_ZOOM_EASE : REVEAL_EASE,
                          },
                          scale: {
                            duration: zoom ? ZOOM_MS / 1000 : 0.55,
                            ease: zoom ? V_ZOOM_EASE : [0.16, 1.1, 0.3, 1],
                          },
                          y: { duration: 0.75, ease: REVEAL_EASE },
                        }}
                        className="text-[15vw] sm:text-[6.5rem] leading-none font-bold text-transparent"
                        style={{
                          WebkitTextStroke: zoom
                            ? "2.5px #b6ff57"
                            : complete
                            ? "1.9px #b6ff57"
                            : "1.5px #9dff3f",
                          textShadow: zoom
                            ? "0 0 65px rgba(157,255,63,0.55), 0 0 170px rgba(157,255,63,0.28)"
                            : complete
                            ? "0 0 38px rgba(157,255,63,0.45), 0 0 85px rgba(157,255,63,0.24)"
                            : "0 0 24px rgba(157,255,63,0.22)",
                          transitionProperty: "text-shadow, -webkit-text-stroke",
                          transitionDuration: "0.4s",
                          transitionTimingFunction: "ease-out",
                          transformOrigin: "50% 50%",
                          willChange: "transform, opacity",
                        }}
                      >
                        {c}
                      </motion.span>
                    );
                  }

                  // Non-V letters get consumed — shrink + fade toward V
                  const distToV = i; // V is at 0
                  return (
                    <motion.span
                      key={c}
                      layout
                      initial={{ opacity: 0, scale: 0.35, y: 44 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        scale: 0,
                        x: -distToV * 20, // slight pull toward V's original position
                        filter: "blur(2px)",
                        transition: {
                          duration: 0.42,
                          delay: 0.03 * (CHARS.length - 1 - i), // farthest exits first
                          ease: [0.55, 0, 0.55, 1],
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
                        textShadow: "0 0 24px rgba(157,255,63,0.22)",
                        willChange: "transform, opacity",
                      }}
                    >
                      {c}
                    </motion.span>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          {/* Bottom stack — tagline + bar + tip. All fade during zoom. */}
          <motion.div
            className="relative flex flex-col items-center"
            animate={{
              opacity: zoom ? 0 : 1,
              y: zoom ? -8 : 0,
            }}
            transition={{ duration: 0.35, ease: IN_OUT_EASE }}
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={
                cascadeComplete && !converge
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 12 }
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
              transition={{ duration: 0.55, ease: REVEAL_EASE }}
            >
              <div className="h-[2px] bg-[rgba(255,255,255,0.08)] overflow-hidden relative">
                <div
                  className="h-full bg-[#9dff3f]"
                  style={{
                    width: `${progress * 100}%`,
                    transition: "width 90ms linear, box-shadow 0.4s ease-out",
                    boxShadow: complete
                      ? "0 0 16px rgba(157,255,63,0.6), 0 0 40px rgba(157,255,63,0.32)"
                      : "0 0 7px rgba(157,255,63,0.32)",
                  }}
                />
                {complete && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(230,255,184,0.55), transparent)",
                    }}
                    initial={{ opacity: 0, x: "-100%" }}
                    animate={{ opacity: [0, 0.85, 0], x: "100%" }}
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
                      style={{ textShadow: "0 0 9px rgba(157,255,63,0.5)" }}
                    >
                      <span aria-hidden="true" className="mr-1">▸</span>
                      <ScrambleText text="SYSTEMS ONLINE" duration={520} />
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
