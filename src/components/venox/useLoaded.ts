"use client";

import { useEffect, useState } from "react";

/**
 * Two-stage loader signal:
 *
 *   VX_HERO_ENTER_EVENT   → "start bringing the hero BACKGROUND alive"
 *                           (fires early on natural completion so WebGL
 *                           assembles UNDER the loader outro, giving the
 *                           reveal continuity instead of a pop)
 *
 *   VX_LOADED_EVENT       → "loader is gone, start the hero TEXT"
 *                           (fires when the overlay actually dismisses)
 *
 * Skip path fires both at the same instant, matching the old behavior.
 */
export const VX_LOADED_EVENT = "vexon:loaded";
export const VX_HERO_ENTER_EVENT = "vexon:hero-enter";

export function emitLoaded() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(VX_LOADED_EVENT));
}

export function emitHeroEnter() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(VX_HERO_ENTER_EVENT));
}

function useEventFlag(eventName: string, fallbackMs: number) {
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setFlag(true);
      return;
    }
    const handler = () => setFlag(true);
    window.addEventListener(eventName, handler);
    const t = window.setTimeout(() => setFlag(true), fallbackMs);
    return () => {
      window.removeEventListener(eventName, handler);
      window.clearTimeout(t);
    };
  }, [eventName, fallbackMs]);
  return flag;
}

/** Hero TEXT trigger — fires when the loader overlay actually dismisses. */
export function useLoaded(fallbackMs = 5000) {
  return useEventFlag(VX_LOADED_EVENT, fallbackMs);
}

/** Hero BACKGROUND trigger — fires early on natural completion so the
 *  WebGL scene can start assembling under the V-zoom finale. On skip
 *  and reduced-motion it fires alongside the loaded event. */
export function useHeroEnter(fallbackMs = 5000) {
  return useEventFlag(VX_HERO_ENTER_EVENT, fallbackMs);
}
