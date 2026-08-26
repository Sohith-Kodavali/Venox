import { ArrowLink, Tag } from "./ui";
import Reveal from "./Reveal";
import WaveCanvas from "./WaveCanvas";

const CARDS = [
  {
    num: "01",
    title: "AI & Data",
    tags: "Intelligence • Automation • Analytics",
    desc: "AI applications, data engineering, analytics and intelligent automation that drive real business outcomes.",
    wave: { speed: 1.1, amplitude: 0.5 },
  },
  {
    num: "02",
    title: "Cloud & DevOps",
    tags: "Infrastructure • Delivery • Scale",
    desc: "Cloud architecture, automation and DevOps practices that make systems reliable, secure and scalable.",
    wave: { speed: 0.8, amplitude: 0.7 },
  },
  {
    num: "03",
    title: "Software Engineering",
    tags: "Products • Platforms • Modernization",
    desc: "Web platforms, SaaS products, APIs and business applications built around your users and workflows.",
    wave: { speed: 1.3, amplitude: 0.4 },
  },
];

export default function Disciplines() {
  return (
    <section id="capabilities" className="vx-section-dark vx-grain">
      <div className="vx-sweep" />
      <div className="absolute inset-x-0 bottom-0 h-40 opacity-40 pointer-events-none">
        <WaveCanvas color="#9dff3f" mode="dots" layers={3} amplitude={0.55} speed={0.6} className="w-full h-full" />
      </div>
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
              End-to-end capability across AI, cloud and software engineering—delivered with focus and built for scale.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {CARDS.map((c, i) => (
            <Reveal key={c.num} delay={i * 0.12}>
              <div className="vx-card flex flex-col h-full min-h-[400px] group">
                <div className="relative p-8 pb-0 flex-1">
                  <div className="absolute inset-x-0 top-0 h-24 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                    <WaveCanvas
                      color="#9dff3f"
                      layers={2}
                      speed={c.wave.speed}
                      amplitude={c.wave.amplitude}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="relative">
                    <span className="vx-num text-[26px] text-[#9dff3f]">{c.num}</span>
                    <h3 className="vx-h3 mt-4 text-white">{c.title}</h3>
                    <p className="mt-2 text-[10px] font-mono tracking-[0.14em] uppercase text-[#6f7a66]">{c.tags}</p>
                    <p className="mt-5 text-[13px] leading-relaxed text-[#9aa590] max-w-[30ch]">{c.desc}</p>
                  </div>
                </div>
                <div className="relative p-8 pt-4">
                  <ArrowLink href="#contact">Explore</ArrowLink>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
