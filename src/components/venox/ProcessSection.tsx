"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Tag } from "./ui";
import Reveal from "./Reveal";

function IconSearch() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10150c" strokeWidth="1.4" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" strokeLinecap="square" />
    </svg>
  );
}
function IconNetwork() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10150c" strokeWidth="1.4" aria-hidden="true">
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5" cy="18" r="2.2" />
      <circle cx="19" cy="18" r="2.2" />
      <path d="M12 7.2v4.3M12 11.5 6.5 16M12 11.5l5.5 4.5" />
    </svg>
  );
}
function IconCode() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10150c" strokeWidth="1.4" aria-hidden="true">
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5" strokeLinecap="square" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10150c" strokeWidth="1.4" aria-hidden="true">
      <path d="M12 3 5 5.8v5.4c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V5.8L12 3Z" />
      <path d="m9 11.5 2.2 2.2L15.5 9.5" />
    </svg>
  );
}
function IconRocket() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10150c" strokeWidth="1.4" aria-hidden="true">
      <path d="M12 15c-1-3.5.5-8 6.5-11 .5 6-1 10.5-4.5 12L12 15ZM12 15l-3-3M9.5 12 5 12.5 7 15M12 15.5 11.5 20 14 18" strokeLinejoin="round" />
    </svg>
  );
}
function IconSupport() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10150c" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19a4 4 0 0 1-4 2.5" />
    </svg>
  );
}

const STEPS: { num: string; title: string; desc: string; icon: ReactNode }[] = [
  { num: "01", title: "Discovery", desc: "Understand the objective and challenges.", icon: <IconSearch /> },
  { num: "02", title: "Solution Design", desc: "Architecture, technology and roadmap", icon: <IconNetwork /> },
  { num: "03", title: "Development", desc: "Build, review and iterate in short cycles", icon: <IconCode /> },
  { num: "04", title: "Quality Assurance", desc: "Test, validate and ensure system quality.", icon: <IconShield /> },
  { num: "05", title: "Deployment", desc: "Release to production with confidence.", icon: <IconRocket /> },
  { num: "06", title: "Support", desc: "Monitor, maintain and continuously improve.", icon: <IconSupport /> },
];

export default function ProcessSection() {
  return (
    <section id="process" className="vx-section-light vx-grain">
      <div className="relative vx-container py-24 lg:py-28">
        <div className="grid xl:grid-cols-[300px_1fr] gap-12 items-start">
          <div className="xl:sticky xl:top-28">
            <Reveal>
              <Tag dark>03 — Our Process</Tag>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="vx-h2 mt-6">From first question to long-term support.</h2>
            </Reveal>
          </div>
          <div className="relative">
            <motion.div
              className="hidden xl:block absolute top-[13px] left-0 right-0 h-[1px] bg-[rgba(16,21,12,0.1)] origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="flex flex-wrap gap-y-12 justify-between xl:justify-start xl:gap-x-5">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.num}
                  className="relative flex items-start gap-4"
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="group w-[128px]">
                    <div className="relative z-10 mb-4 w-[42px] h-[42px] bg-[#f1f2ec] border border-[rgba(16,21,12,0.12)] flex items-center justify-center transition-all duration-300 group-hover:bg-[#10150c] group-hover:border-[#10150c] group-hover:-translate-y-1">
                      <span className="transition-colors group-hover:[&>svg]:stroke-[#9dff3f]">{s.icon}</span>
                    </div>
                    <p className="vx-num text-[11px] text-[#5a7a1e]">{s.num}</p>
                    <p className="mt-1 text-[12px] font-bold tracking-[0.12em] uppercase">{s.title}</p>
                    <p className="mt-2 text-[11.5px] leading-relaxed text-[#4c5544]">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
