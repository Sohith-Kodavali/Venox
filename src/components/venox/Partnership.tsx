import { ArrowLink, Tag } from "./ui";
import Reveal from "./Reveal";
import WaveCanvas from "./WaveCanvas";

const STATS = [
  { num: "3", label: "Core Disciplines" },
  { num: "6", label: "Delivery Stages" },
  { num: "4", label: "Engagement Models" },
  { num: "2", label: "Global Locations" },
];

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
          <Reveal key={s.label} delay={i * 0.08} className="bg-[#f1f2ec]">
            <div className="px-6 py-7 group hover:bg-[#0b0f09] transition-colors duration-300">
              <p className="vx-num text-[34px] font-semibold text-[#10150c] group-hover:text-[#9dff3f] transition-colors">
                {s.num}
              </p>
              <p className="mt-1 text-[10px] font-mono tracking-[0.18em] uppercase text-[#4c5544] group-hover:text-[#9aa590] transition-colors">
                {s.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
