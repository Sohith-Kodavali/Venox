import { ArrowLink, ArrowRight, Tag } from "./ui";
import Reveal from "./Reveal";

type Solution = {
  num: string;
  title: string;
  tags: string[];
  desc: string;
  outcomes: string[];
};

const SOLUTIONS: Solution[] = [
  {
    num: "01",
    title: "AI-Enabled Business Platform",
    tags: ["AI", "B2B", "Automation", "Analytics"],
    desc: "Architecture combining business workflows, conversational AI, semantic search, analytics and automation, delivered as a single production platform.",
    outcomes: [
      "Reduced manual workload for operations teams",
      "Real-time analytics + AI copilots for decision-making",
      "Deployable on your cloud with SSO and audit trails",
    ],
  },
  {
    num: "02",
    title: "Modern Data & Analytics Platform",
    tags: ["Data Engineering", "BI", "Dashboards"],
    desc: "End-to-end data pipelines, a centralized warehouse and interactive business intelligence — from raw source to executive dashboard.",
    outcomes: [
      "Single source of truth across finance, ops and revenue",
      "Automated pipelines with data-quality checks",
      "Self-serve BI for non-technical stakeholders",
    ],
  },
  {
    num: "03",
    title: "Cloud-Native Application Delivery",
    tags: ["Cloud", "DevOps", "Automation"],
    desc: "Scalable, secure and automated delivery of cloud-native applications across environments — from Kubernetes to CI/CD to observability.",
    outcomes: [
      "Repeatable environments via infrastructure-as-code",
      "Deploy-on-merge pipelines with automated rollback",
      "Observability, alerting and cost controls out of the box",
    ],
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
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
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
              A few of the shapes our work takes when clients hand us a
              real business problem. Each is a reference architecture we
              can tailor to your stack and constraints.
            </p>
          </Reveal>
        </div>

        {/* Stacked case-study list — deliberately different visual pattern
            from the 3-column card grid used in Disciplines */}
        <div className="border-t border-[rgba(255,255,255,0.08)]">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.08}>
              <article
                className="group relative grid gap-6 lg:grid-cols-[80px_1.15fr_1fr_44px] lg:gap-10 items-start py-10 lg:py-12 border-b border-[rgba(255,255,255,0.08)] transition-colors hover:bg-[rgba(157,255,63,0.02)]"
              >
                {/* Accent bar reveals on hover */}
                <span className="pointer-events-none absolute left-0 top-0 h-full w-[2px] scale-y-0 origin-top transition-transform duration-500 group-hover:scale-y-100 bg-gradient-to-b from-transparent via-[#9dff3f] to-transparent" />

                <div className="lg:pt-1">
                  <span className="vx-num text-[38px] leading-none text-[#9dff3f]/80 group-hover:text-[#9dff3f] transition-colors">
                    {s.num}
                  </span>
                </div>

                <div>
                  <h3 className="text-[20px] lg:text-[22px] font-semibold text-white leading-snug tracking-[-0.01em]">
                    {s.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 text-[9.5px] font-mono tracking-[0.14em] uppercase text-[#9dff3f] border border-[rgba(157,255,63,0.28)] rounded-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-[13.5px] leading-relaxed text-[#9aa590] max-w-[52ch]">
                    {s.desc}
                  </p>
                </div>

                <ul className="space-y-2.5 lg:pt-1">
                  {s.outcomes.map((o) => (
                    <li
                      key={o}
                      className="flex items-start gap-2.5 text-[12.5px] leading-snug text-[#c9d2c0]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[7px] shrink-0 w-1.5 h-1.5 bg-[#9dff3f] rounded-full"
                      />
                      {o}
                    </li>
                  ))}
                </ul>

                <div className="hidden lg:flex justify-end lg:pt-1">
                  <span className="w-10 h-10 border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-[#9dff3f] transition-all duration-300 group-hover:bg-[#9dff3f] group-hover:text-[#0a0f05] group-hover:rotate-45">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-end">
            <ArrowLink href="#contact">View All Solutions</ArrowLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
