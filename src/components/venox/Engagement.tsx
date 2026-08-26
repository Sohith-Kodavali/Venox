import { Tag } from "./ui";
import Reveal from "./Reveal";
import type { ReactNode } from "react";

function IconPoly() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#9dff3f" strokeWidth="1.1" aria-hidden="true">
      <path d="M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5ZM12 2.5v19M4 7l16 10M20 7 4 17" />
    </svg>
  );
}
function IconTeam() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#9dff3f" strokeWidth="1.1" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="17" cy="9.5" r="2.2" />
      <path d="M15.5 14.7c2.8-.4 5 1.5 5 4.3" />
    </svg>
  );
}
function IconNodes() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#9dff3f" strokeWidth="1.1" aria-hidden="true">
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="18" cy="8" r="2.4" />
      <circle cx="10" cy="18" r="2.4" />
      <path d="M8.2 7 15.7 7.8M7 8.2 9.2 15.8M16.8 9.8l-5.4 6.2" />
    </svg>
  );
}
function IconGear() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#9dff3f" strokeWidth="1.1" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1" />
    </svg>
  );
}

const MODELS: { title: string; desc: string; icon: ReactNode }[] = [
  {
    title: "Project-Based Development",
    desc: "For defined products, applications, integrations or modernization initiatives.",
    icon: <IconPoly />,
  },
  {
    title: "Dedicated Engineering Team",
    desc: "Extended engineering capacity aligned to your technologies and workflow.",
    icon: <IconTeam />,
  },
  {
    title: "Technology / Subcontracting Partnership",
    desc: "We integrate with agencies and consultancies as a reliable delivery partner.",
    icon: <IconNodes />,
  },
  {
    title: "Managed Services",
    desc: "Ongoing support, maintenance and optimization for critical systems.",
    icon: <IconGear />,
  },
];

export default function Engagement() {
  return (
    <section id="engagement" className="vx-section-dark vx-grain border-t border-[rgba(255,255,255,0.05)]">
      <div className="relative vx-container py-24 lg:py-32 grid lg:grid-cols-[340px_1fr] gap-14 items-start">
        <div className="lg:sticky lg:top-28">
          <Reveal>
            <Tag>04 — Engagement Models</Tag>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="vx-h2 mt-6 text-white">
              Ways we can
              <br />
              work together.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <a href="#contact" className="vx-btn vx-btn-outline-dark mt-10 bg-transparent">
              Discuss Your Needs
              <svg width="18" height="12" viewBox="0 0 26 14" fill="none" aria-hidden="true">
                <path d="M0 7h23M18 1.5 24 7l-6 5.5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {MODELS.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.1}>
              <div className="vx-card p-8 flex flex-col min-h-[240px] group">
                <div className="mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  {m.icon}
                </div>
                <h3 className="text-[15px] font-semibold text-white leading-snug">{m.title}</h3>
                <p className="mt-3 text-[12.5px] leading-relaxed text-[#9aa590]">{m.desc}</p>
                <span className="mt-auto pt-5 vx-num text-[10px] text-[#3c4534] group-hover:text-[#9dff3f] transition-colors">
                  0{i + 1}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
