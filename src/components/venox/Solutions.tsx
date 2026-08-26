import { ArrowLink, ArrowRight, Tag } from "./ui";
import Reveal from "./Reveal";
import WaveCanvas from "./WaveCanvas";

const SOLUTIONS = [
  {
    num: "01",
    title: "AI-Enabled Business Platform",
    tags: "AI • B2B • Automation • Analytics",
    desc: "Architecture combining business workflows, conversational AI, semantic search, analytics and automation.",
    wave: { speed: 1.2, amplitude: 0.55 },
  },
  {
    num: "02",
    title: "Modern Data & Analytics Platform",
    tags: "Data Engineering • BI • Dashboards",
    desc: "End-to-end data pipelines, centralized analytics and interactive business intelligence.",
    wave: { speed: 0.9, amplitude: 0.75 },
  },
  {
    num: "03",
    title: "Cloud-Native Application Delivery",
    tags: "Cloud • DevOps • Automation",
    desc: "Scalable, secure and automated delivery of cloud-native applications across environments.",
    wave: { speed: 1.4, amplitude: 0.45 },
  },
];

export default function Solutions() {
  return (
    <section id="solutions" className="vx-section-dark vx-grain border-t border-[rgba(255,255,255,0.05)]">
      <div className="relative vx-container py-24 lg:py-32">
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
          <Reveal delay={0.2}>
            <ArrowLink href="#contact">View All Solutions</ArrowLink>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.12}>
              <div className="vx-card flex flex-col h-full group">
                <div className="relative h-[160px] border-b border-[rgba(255,255,255,0.06)] overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,9,5,0.2),rgba(6,9,5,0.75))]" />
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                    <WaveCanvas
                      color="#9dff3f"
                      layers={3}
                      speed={s.wave.speed}
                      amplitude={s.wave.amplitude}
                      className="w-full h-full"
                    />
                  </div>
                  <span className="vx-num absolute bottom-3 left-5 text-[22px] text-white/90">{s.num}</span>
                  <span className="absolute top-3 right-4 text-[8px] font-mono tracking-[0.2em] uppercase text-[#9dff3f]/60">
                    REF.IMPL
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-[15px] font-semibold text-white leading-snug">{s.title}</h3>
                  <p className="mt-2 text-[9.5px] font-mono tracking-[0.14em] uppercase text-[#6f7a66]">{s.tags}</p>
                  <p className="mt-4 text-[12.5px] leading-relaxed text-[#9aa590]">{s.desc}</p>
                  <div className="mt-auto pt-6 flex justify-end">
                    <span className="w-9 h-9 border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-[#9dff3f] transition-all duration-300 group-hover:bg-[#9dff3f] group-hover:text-[#0a0f05] group-hover:rotate-45">
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-8 text-[10.5px] font-mono tracking-[0.06em] text-[#4d573f]">
            These are representative solution / reference implementations and can be replaced with approved client case studies.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
