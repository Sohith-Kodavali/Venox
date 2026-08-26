"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const VenoxScene = dynamic(() => import("./VenoxScene"), { ssr: false });

export default function VenoxShowpiece() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
  });

  const tagOpacity = useTransform(scrollYProgress, [0.78, 0.92], [0, 1]);
  const tagY = useTransform(scrollYProgress, [0.78, 0.92], [20, 0]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.08], [0.4, 1]);
  const sceneScale = useTransform(scrollYProgress, [0, 0.08], [0.96, 1]);

  return (
    <section ref={ref} className="relative h-[220vh] bg-[#040603]">
      <div className="sticky top-0 h-screen overflow-hidden vx-grain">
        <motion.div style={{ opacity: sceneOpacity, scale: sceneScale }} className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(157,255,63,0.08), transparent 65%), radial-gradient(ellipse 40% 30% at 80% 10%, rgba(157,255,63,0.05), transparent 60%)",
            }}
          />
          <div className="absolute inset-0 vx-grid-bg opacity-50" />

          <div className="absolute inset-0">
            <VenoxScene progress={progress} />
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: tagOpacity, y: tagY }}
          className="absolute bottom-20 left-0 right-0 text-center pointer-events-none px-6"
        >
          <p className="text-[10px] font-mono tracking-[0.34em] uppercase text-[#9dff3f]">Venox Solutions Inc</p>
          <p className="mt-3 text-[13px] text-[#9aa590] max-w-[420px] mx-auto leading-relaxed">
            Technology &amp; Digital Engineering Partner — building the systems behind ambitious businesses.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[rgba(255,255,255,0.06)]">
          <motion.div className="h-full origin-left bg-[#9dff3f]" style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}
