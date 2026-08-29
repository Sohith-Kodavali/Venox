"use client";

import { useEffect, useState } from "react";

export const VX_LOADED_EVENT = "vexon:loaded";
export const VX_HERO_ENTER_EVENT = "vexon:hero-enter";

export type LoadMode = "natural" | "skip" | "reduced";

export function emitLoaded(mode: LoadMode = "skip") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(VX_LOADED_EVENT, { detail: { mode } }));
}

export function emitHeroEnter() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(VX_HERO_ENTER_EVENT));
}

export type LoadedState = { loaded: boolean; mode: LoadMode | null };

/** Hero TEXT trigger. Also reports HOW the loader dismissed so callers
 *  can tune entry cadence (natural completion has already made the user
 *  wait, so text can arrive slightly sooner than on skip). */
export function useLoaded(fallbackMs = 5000): LoadedState {
  const [state, setState] = useState<LoadedState>({ loaded: false, mode: null });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setState({ loaded: true, mode: "reduced" });
      return;
    }
    const handler = (e: Event) => {
      const mode = ((e as CustomEvent).detail?.mode as LoadMode) ?? "skip";
      setState({ loaded: true, mode });
    };
    window.addEventListener(VX_LOADED_EVENT, handler);
    const t = window.setTimeout(
      () => setState({ loaded: true, mode: "skip" }),
      fallbackMs
    );
    return () => {
      window.removeEventListener(VX_LOADED_EVENT, handler);
      window.clearTimeout(t);
    };
  }, [fallbackMs]);

  return state;
}

/** Hero BACKGROUND trigger — fires early on natural completion so the
 *  WebGL scene assembles under the V-zoom finale. */
export function useHeroEnter(fallbackMs = 5000) {
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setFlag(true);
      return;
    }
    const handler = () => setFlag(true);
    window.addEventListener(VX_HERO_ENTER_EVENT, handler);
    const t = window.setTimeout(() => setFlag(true), fallbackMs);
    return () => {
      window.removeEventListener(VX_HERO_ENTER_EVENT, handler);
      window.clearTimeout(t);
    };
  }, [fallbackMs]);
  return flag;
}
