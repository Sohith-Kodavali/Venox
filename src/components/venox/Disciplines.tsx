import type { ReactNode } from "react";
import { ArrowLink, Tag } from "./ui";
import Reveal from "./Reveal";

// Icons — chunky monoline lime, sit inside a bordered plate at top of each
// card so the eye lands on the icon before the number/title.
function IconAI() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v3M12 18v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M3 12h3M18 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconCloud() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17.5h10a4 4 0 0 0 .8-7.9 5.5 5.5 0 0 0-10.7-1.2A4.5 4.5 0 0 0 7 17.5Z" />
      <path d="M12 13v4.5M9.5 15.5 12 18l2.5-2.5" />
    </svg>
  );
}
function IconCode() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.8 4l-3.6 16" />
    </svg>
  );
}

type Card = {
  num: string;
  title: string;
  desc: string;
  features: string[];
  icon: ReactNode;
};

const CARDS: Card[] = [
  {
    num: "01",
    title: "AI & Data",
    desc: "AI applications, data pipelines and intelligent automation that move real business metrics.",
    features: [
      "LLM & agent architectures",
      "Data engineering & analytics",
      "MLOps & production deployment",
    ],
    icon: <IconAI />,
  },
  {
    num: "02",
    title: "Cloud & DevOps",
    desc: "Cloud architecture and delivery automation that keep systems reliable, secure and easy to change.",
    features: [
      "AWS · Azure · GCP architecture",
      "CI/CD & infrastructure-as-code",
      "Observability & cost controls",
    ],
    icon: <IconCloud />,
  },
  {
    num: "03",
    title: "Software Engineering",
    desc: "Web platforms, SaaS products and business applications built around your users and workflows.",
    features: [
      "Product & platform engineering",
      "API & integration layers",
      "Legacy modernization",
    ],
    icon: <IconCode />,
  },
];

export default function Disciplines() {
  return (
    <section id="capabilities" className="vx-section-dark vx-grain">
      <div className="relative vx-container py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-14">
          <div>
            <Reveal>
              <Tag>02 — Capabilities</Tag>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="vx-h2 mt-6 text-white">
                Three disciplines.
                <br />
                One engineering partner.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="lg:justify-self-end">
            <p className="text-[14px] leading-relaxed text-[#9aa590] max-w-[420px]">
              End-to-end capability across AI, cloud and software engineering
              — delivered with focus and built for scale.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {CARDS.map((c, i) => (
            <Reveal key={c.num} delay={i * 0.1}>
              <article className="vx-card group relative h-full flex flex-col p-8 pt-9">
                {/* Ghost number sitting behind the title */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-4 right-6 text-[72px] leading-none font-bold select-none"
                  style={{
                    WebkitTextStroke: "1px rgba(157,255,63,0.08)",
                    color: "transparent",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {c.num}
                </span>

                {/* Icon plate */}
                <div className="relative">
                  <div className="w-12 h-12 flex items-center justify-center border border-[rgba(157,255,63,0.28)] bg-[rgba(157,255,63,0.05)] text-[#9dff3f] group-hover:border-[#9dff3f] group-hover:bg-[rgba(157,255,63,0.12)] group-hover:text-[#c8ff86] transition-colors">
                    {c.icon}
                  </div>
                </div>

                <div className="relative mt-7">
                  <p className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#6f7a66]">
                    Discipline {c.num}
                  </p>
                  <h3 className="mt-3 text-[22px] font-semibold text-white leading-[1.2] tracking-[-0.015em] group-hover:text-[#e6ffb8] transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-4 text-[13px] leading-relaxed text-[#9aa590]">
                    {c.desc}
                  </p>
                </div>

                <ul className="relative mt-6 space-y-2.5">
                  {c.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-[12.5px] leading-snug text-[#c9d2c0]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[7px] shrink-0 w-1.5 h-1.5 rounded-full bg-[#9dff3f]/70 group-hover:bg-[#9dff3f] transition-colors"
                        style={{ boxShadow: "0 0 6px rgba(157,255,63,0.4)" }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Hairline divider before the CTA */}
                <div className="relative mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)] mt-auto">
                  <ArrowLink href="#contact">Explore</ArrowLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
