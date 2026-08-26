import type { ReactNode } from "react";
import Reveal from "./Reveal";

function BrainIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#9dff3f" strokeWidth="1.3" aria-hidden="true">
      <path d="M9.5 3.5a2.5 2.5 0 0 0-2.45 3 2.5 2.5 0 0 0-1.3 4.2A2.6 2.6 0 0 0 5 13a2.5 2.5 0 0 0 2 2.45V17a2.5 2.5 0 0 0 2.5 2.5h.5V3.5h-.5ZM14.5 3.5a2.5 2.5 0 0 1 2.45 3 2.5 2.5 0 0 1 1.3 4.2A2.6 2.6 0 0 1 19 13a2.5 2.5 0 0 1-2 2.45V17a2.5 2.5 0 0 1-2.5 2.5H14V3.5h.5Z" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#9dff3f" strokeWidth="1.3" aria-hidden="true">
      <path d="M7 18.5h10a4 4 0 0 0 .8-7.9 5.5 5.5 0 0 0-10.7-1.2A4.5 4.5 0 0 0 7 18.5Z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#9dff3f" strokeWidth="1.3" aria-hidden="true">
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15" strokeLinecap="square" />
    </svg>
  );
}

function Item({ icon, title, sub, last = false, delay = 0 }: { icon: ReactNode; title: string; sub: string; last?: boolean; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div
        className={`group flex items-center gap-5 py-8 lg:py-10 transition-colors ${
          last ? "" : "lg:border-r lg:border-[rgba(255,255,255,0.08)]"
        }`}
      >
        <div className="shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">{icon}</div>
        <div>
          <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-white group-hover:text-[#9dff3f] transition-colors">
            {title}
          </p>
          <p className="mt-1.5 text-[11px] font-mono tracking-[0.08em] text-[#6f7a66]">{sub}</p>
        </div>
      </div>
    </Reveal>
  );
}

export default function CapabilityStrip() {
  return (
    <section className="border-y border-[rgba(255,255,255,0.08)] relative bg-[#060805]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 80% at 50% 120%, rgba(157,255,63,0.07), transparent 60%), radial-gradient(ellipse 30% 60% at 90% 0%, rgba(157,255,63,0.05), transparent 60%)",
        }}
      />
      <div className="relative vx-container grid lg:grid-cols-3 gap-0 lg:gap-10">
        <Item icon={<BrainIcon />} title="AI & Data" sub="Intelligence • Automation • Analytics" delay={0} />
        <Item icon={<CloudIcon />} title="Cloud & DevOps" sub="Infrastructure • Delivery • Scale" delay={0.1} />
        <Item icon={<CodeIcon />} title="Software Engineering" sub="Products • Platforms • Modernization" last delay={0.2} />
      </div>
    </section>
  );
}
