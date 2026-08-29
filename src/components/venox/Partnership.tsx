"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { ArrowLink, Tag } from "./ui";
import Reveal from "./Reveal";
import WaveCanvas from "./WaveCanvas";

const STATS = [
  { num: "3", label: "AI · Cloud · Software", sub: "Disciplines" },
  { num: "6", label: "Discovery to Support", sub: "Delivery Stages" },
  { num: "4", label: "Project · Team · Partner · Managed", sub: "Engagement Models" },
  { num: "2", label: "US HQ · India Delivery", sub: "Global Presence" },
];

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);
  const target = parseInt(value, 10);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <p
      ref={ref}
      className="vx-num text-[34px] font-semibold text-[#10150c] group-hover:text-[#9dff3f] transition-colors"
    >
      {display}
    </p>
  );
}

export default function Partnership() {
  return (
    <section id="about" className="vx-section-light relative overflow-hidden vx-grain">
      <div className="absolute inset-x-0 bottom-0 h-40 opacity-70 pointer-events-none">
        <WaveCanvas color="#5a7a1e" mode="dots" layers={4} amplitude={0.5} speed={0.7} className="w-full h-full" />
      </div>

      <div className="relative vx-container py-24 lg:py-32 grid lg:grid-cols-2 gap-14 items-start">
        <div>
          <Reveal>
            <Tag dark>01 — The Partnership</Tag>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="vx-h2 mt-6 max-w-[16ch]">
              Technology should solve the business problem. Not become another one.
            </h2>
          </Reveal>
        </div>
        <div className="lg:pt-14">
          <Reveal delay={0.15}>
            <p className="text-[15px] leading-relaxed text-[#4c5544] max-w-[440px]">
              We work with businesses that need to build new digital products, modernize existing systems, or extend
              their engineering capabilities—from discovery through deployment and ongoing support.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <ArrowLink href="#process" dark className="mt-8">
              How We Work
            </ArrowLink>
          </Reveal>
        </div>
      </div>

      <div className="relative vx-container pb-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-[rgba(16,21,12,0.08)] border border-[rgba(16,21,12,0.08)]">
        {STATS.map((s, i) => (
          <Reveal key={s.sub} delay={i * 0.08} className="bg-[#f1f2ec]">
            <div className="px-6 py-7 group hover:bg-[#0b0f09] transition-colors duration-300">
              <CountUp value={s.num} />
              <p className="mt-2 text-[11px] font-semibold tracking-[0.06em] text-[#10150c] group-hover:text-[#eef2e6] transition-colors leading-snug">
                {s.label}
              </p>
              <p className="mt-1 text-[9.5px] font-mono tracking-[0.18em] uppercase text-[#4c5544] group-hover:text-[#9aa590] transition-colors">
                {s.sub}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
