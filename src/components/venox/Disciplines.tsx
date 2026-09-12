import { ArrowLink, Tag } from "./ui";
import Reveal from "./Reveal";
import WaveCanvas from "./WaveCanvas";

type Card = {
  num: string;
  title: string;
  desc: string;
  features: string[];
  wave: { speed: number; amplitude: number };
};

const CARDS: Card[] = [
  {
    num: "01",
    title: "AI & Data",
    desc: "AI applications, data engineering, analytics and intelligent automation that drive real business outcomes.",
    features: ["LLM & agent systems", "Data engineering", "MLOps at production"],
    wave: { speed: 1.1, amplitude: 0.5 },
  },
  {
    num: "02",
    title: "Cloud & DevOps",
    desc: "Cloud architecture, automation and DevOps practices that make systems reliable, secure and scalable.",
    features: ["AWS · Azure · GCP", "CI/CD & infra-as-code", "Observability & cost"],
    wave: { speed: 0.8, amplitude: 0.7 },
  },
  {
    num: "03",
    title: "Software Engineering",
    desc: "Web platforms, SaaS products, APIs and business applications built around your users and workflows.",
    features: ["Product engineering", "API & integrations", "Legacy modernization"],
    wave: { speed: 1.3, amplitude: 0.4 },
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
            <Reveal key={c.num} delay={i * 0.12}>
              <article className="vx-card group relative flex flex-col h-full min-h-[440px] overflow-hidden">
                {/* WAVE HEADER — the movement. Taller (h-32) so the animation
                    has room to breathe, with a lime→transparent scrim below
                    so it merges into the card body instead of clipping hard. */}
                <div className="relative h-32 overflow-hidden">
                  <div className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                    <WaveCanvas
                      color="#9dff3f"
                      layers={3}
                      speed={c.wave.speed}
                      amplitude={c.wave.amplitude}
                      className="w-full h-full"
                    />
                  </div>
                  {/* Merge scrim */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 0%, rgba(10,14,8,0.75) 65%, rgba(10,14,8,1) 100%)",
                    }}
                  />
                  {/* Number sits ON the wave, top-left */}
                  <span className="absolute top-5 left-6 vx-num text-[13px] tracking-[0.2em] text-[#9dff3f]/85 group-hover:text-[#9dff3f] transition-colors">
                    {c.num} / DISCIPLINE
                  </span>
                  {/* Ghost giant number, right side, adds visual weight */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-3 right-4 text-[70px] leading-none font-bold select-none"
                    style={{
                      WebkitTextStroke: "1px rgba(157,255,63,0.14)",
                      color: "transparent",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {c.num}
                  </span>
                </div>

                {/* BODY */}
                <div className="relative px-7 pt-4 pb-7 flex flex-col flex-1">
                  <h3 className="text-[22px] font-semibold text-white leading-[1.2] tracking-[-0.015em] group-hover:text-[#e6ffb8] transition-colors">
                    {c.title}
                  </h3>

                  <p className="mt-3 text-[13px] leading-relaxed text-[#9aa590]">
                    {c.desc}
                  </p>

                  <ul className="mt-5 space-y-2">
                    {c.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 text-[12px] font-mono tracking-[0.02em] text-[#c9d2c0]"
                      >
                        <span
                          aria-hidden="true"
                          className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#9dff3f]/70 group-hover:bg-[#9dff3f] transition-colors"
                          style={{ boxShadow: "0 0 6px rgba(157,255,63,0.4)" }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Divider + CTA */}
                  <div className="mt-auto pt-6 border-t border-[rgba(255,255,255,0.06)]">
                    <ArrowLink href="#contact">Explore Capability</ArrowLink>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
