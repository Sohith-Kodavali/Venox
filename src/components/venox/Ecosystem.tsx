import { Tag } from "./ui";
import Reveal from "./Reveal";

const TECH = [
  { name: "aws", glyph: "a" },
  { name: "Azure", glyph: "▲" },
  { name: "Google Cloud", glyph: "◉" },
  { name: "React", glyph: "⚛" },
  { name: "NEXT.js", glyph: "N" },
  { name: "Python", glyph: "𝒫" },
  { name: "FastAPI", glyph: "⚡" },
  { name: "PostgreSQL", glyph: "🐘" },
  { name: "Snowflake", glyph: "❄" },
  { name: "kubernetes", glyph: "⎈" },
  { name: "docker", glyph: "🐳" },
];

export default function Ecosystem() {
  const row = [...TECH, ...TECH];
  return (
    <section className="bg-[#060805] border-t border-[rgba(255,255,255,0.06)] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 90% at 50% 0%, rgba(157,255,63,0.05), transparent 60%)" }}
      />
      <div className="relative vx-container pt-14 pb-4">
        <Reveal>
          <Tag>Technology Ecosystem</Tag>
        </Reveal>
      </div>
      <div className="relative vx-marquee py-8">
        <div className="vx-marquee-track">
          {row.map((t, i) => (
            <span
              key={`${t.name}-${i}`}
              className="flex items-center gap-2.5 mx-7 text-[16px] font-semibold text-[#8b9580] hover:text-[#9dff3f] transition-colors whitespace-nowrap"
            >
              <span className="text-[13px] opacity-80">{t.glyph}</span>
              {t.name}
              <span className="ml-10 w-1 h-1 rounded-full bg-[rgba(157,255,63,0.35)]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
