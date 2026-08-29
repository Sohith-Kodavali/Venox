import { ArrowLink, ArrowRight, Tag } from "./ui";
import Reveal from "./Reveal";

type Solution = {
  num: string;
  title: string;
  desc: string;
};

const SOLUTIONS: Solution[] = [
  {
    num: "01",
    title: "AI-Enabled Business Platform",
    desc: "Workflows, conversational AI, semantic search and analytics — as one production platform.",
  },
  {
    num: "02",
    title: "Modern Data & Analytics Platform",
    desc: "End-to-end pipelines, a central warehouse and interactive BI, from raw source to executive dashboard.",
  },
  {
    num: "03",
    title: "Cloud-Native Application Delivery",
    desc: "Scalable, secure, automated delivery — Kubernetes, CI/CD and observability, out of the box.",
  },
];

export default function Solutions() {
  return (
    <section
      id="solutions"
      className="vx-section-dark-alt vx-grain border-t border-[rgba(255,255,255,0.08)]"
    >
      <div className="relative vx-container py-24 lg:py-32">
        <Reveal>
          <div className="vx-section-mark">
            <span className="vx-section-mark-dot" />
            <span>05 &nbsp;/&nbsp; Reference Implementations</span>
          </div>
        </Reveal>

        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <div>
            <Reveal>
              <Tag>05 — Solution Experience</Tag>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="vx-h2 mt-6 text-white">
                Representative
                <br />
                solution experience.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="max-w-[380px]">
            <p className="text-[14px] leading-relaxed text-[#9aa590]">
              A few shapes our work takes when clients hand us a real
              business problem. Each is a reference architecture we tailor
              to your stack.
            </p>
          </Reveal>
        </div>

        {/* Editorial list — big number, big title, one-line prose.
            Deliberately quiet: whitespace does the design work. */}
        <div className="border-t border-[rgba(255,255,255,0.08)]">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.08}>
              <a
                href="#contact"
                className="group relative grid grid-cols-[64px_1fr_auto] lg:grid-cols-[100px_1fr_40px] gap-6 lg:gap-14 items-center py-10 lg:py-14 border-b border-[rgba(255,255,255,0.08)] transition-colors"
              >
                <span
                  className="vx-num text-[26px] lg:text-[32px] leading-none text-[#9dff3f] group-hover:text-[#c8ff86] transition-colors"
                  style={{ textShadow: "0 0 14px rgba(157,255,63,0.35)" }}
                >
                  {s.num}
                </span>

                <div className="min-w-0">
                  <h3 className="text-[22px] lg:text-[30px] font-semibold text-white leading-[1.15] tracking-[-0.02em] group-hover:text-[#c8ff86] transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] lg:text-[14.5px] leading-relaxed text-[#9aa590] max-w-[58ch]">
                    {s.desc}
                  </p>
                </div>

                <span className="shrink-0 flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 text-[#6f7a66] group-hover:text-[#9dff3f] transition-all duration-300 group-hover:translate-x-1">
                  <ArrowRight size={14} />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-end">
            <ArrowLink href="#contact">Discuss Your Solution</ArrowLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
