"use client";

import { useEffect, useState } from "react";

/** True only on devices that can comfortably afford a live WebGL scene. */
export function useCanRenderScene() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 900px) and (pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setOk(query.matches && !reduceMotion.matches);
    update();
    query.addEventListener("change", update);
    reduceMotion.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      reduceMotion.removeEventListener("change", update);
    };
  }, []);

  return ok;
}
