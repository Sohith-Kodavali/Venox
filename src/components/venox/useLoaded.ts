"use client";

import { useEffect, useState } from "react";

export const VX_LOADED_EVENT = "vexon:loaded";

export function emitLoaded() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(VX_LOADED_EVENT));
}

/**
 * Resolves to true once the branded loading screen begins its exit,
 * with a safety fallback so downstream animations always eventually run.
 */
export function useLoaded(fallbackMs = 3200) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setLoaded(true);
      return;
    }
    const handler = () => setLoaded(true);
    window.addEventListener(VX_LOADED_EVENT, handler);
    const t = window.setTimeout(() => setLoaded(true), fallbackMs);
    return () => {
      window.removeEventListener(VX_LOADED_EVENT, handler);
      window.clearTimeout(t);
    };
  }, [fallbackMs]);

  return loaded;
}
