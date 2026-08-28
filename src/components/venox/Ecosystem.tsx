import type { ReactNode } from "react";
import { Tag } from "./ui";
import Reveal from "./Reveal";

function IconAWS() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 15.5c4 2.4 12 2.4 16 0" strokeLinecap="round" />
      <path d="M17 14.5 20 15.5 19.5 18.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 6 9 12l1.6-4.4L12.2 12 14.5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconAzure() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.2 3.5H15L9.5 18.8 3 20.5l6.2-17Z" opacity="0.85" />
      <path d="M15.6 4 21 17H9.6l4.2-4.9-4.9-1.7L15.6 4Z" opacity="0.55" />
    </svg>
  );
}
function IconGoogleCloud() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M7 18.5h10a4 4 0 0 0 .8-7.9 5.5 5.5 0 0 0-10.7-1.2A4.5 4.5 0 0 0 7 18.5Z" />
    </svg>
  );
}
function IconReact() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="9.5" ry="4" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconNext() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8.5 8v8M8.5 8 16 17.5M16 8v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconPython() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M12 3.5c-3 0-4 1-4 3v2.2h4.2v.8H5.7C4 9.5 3 10.8 3 13.4s1 3.9 2.7 3.9h1.6v-2.6c0-1.9 1.4-3.2 3.4-3.2h3.8c1.6 0 2.8-1.2 2.8-2.8V6.5c0-2-1.4-3-4-3h-1.3Z" />
      <path d="M12 20.5c3 0 4-1 4-3v-2.2h-4.2v-.8h6.5c1.7 0 2.7-1.3 2.7-3.9s-1-3.9-2.7-3.9h-1.6v2.6c0 1.9-1.4 3.2-3.4 3.2H9.5c-1.6 0-2.8 1.2-2.8 2.8v2.9c0 2 1.4 3 4 3H12Z" />
      <circle cx="9.3" cy="6" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="14.7" cy="18" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconFastAPI() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4Z" />
      <path d="M13 6.5 8 13h4l-1 4.5 5-7h-4l1-4Z" strokeLinejoin="round" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconPostgres() {
  return (
    <svg width="16" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <ellipse cx="12" cy="5.5" rx="8" ry="3" />
      <path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  );
}
function IconSnowflake() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M12 2.5v19M4.4 6.75l15.2 10.5M19.6 6.75 4.4 17.25" strokeLinecap="round" />
      <path d="M12 2.5 9.8 5M12 2.5l2.2 2.5M12 21.5 9.8 19M12 21.5l2.2-2.5" strokeLinecap="round" />
    </svg>
  );
}
function IconKubernetes() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M12 2.5 20.5 8v8L12 21.5 3.5 16V8L12 2.5Z" />
      <path d="M12 8.2v7.6M8.7 10l6.6 4M15.3 10l-6.6 4" strokeLinecap="round" />
    </svg>
  );
}
function IconDocker() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="3" y="11" width="3.6" height="3.6" />
      <rect x="7.4" y="11" width="3.6" height="3.6" />
      <rect x="11.8" y="11" width="3.6" height="3.6" />
      <rect x="7.4" y="6.6" width="3.6" height="3.6" />
      <path d="M3 15.2c1 3.2 4.3 4.8 9 4.8 6 0 9.4-3 10.2-6.4.9.15 1.8-.3 1.8-1.6 0-1.1-.9-1.8-2-1.6-.5-.9-1.4-1.4-2.5-1.4" />
    </svg>
  );
}

const TECH: { name: string; icon: ReactNode }[] = [
  { name: "AWS", icon: <IconAWS /> },
  { name: "Azure", icon: <IconAzure /> },
  { name: "Google Cloud", icon: <IconGoogleCloud /> },
  { name: "React", icon: <IconReact /> },
  { name: "Next.js", icon: <IconNext /> },
  { name: "Python", icon: <IconPython /> },
  { name: "FastAPI", icon: <IconFastAPI /> },
  { name: "PostgreSQL", icon: <IconPostgres /> },
  { name: "Snowflake", icon: <IconSnowflake /> },
  { name: "Kubernetes", icon: <IconKubernetes /> },
  { name: "Docker", icon: <IconDocker /> },
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
              <span className="opacity-80">{t.icon}</span>
              {t.name}
              <span className="ml-10 w-1 h-1 rounded-full bg-[rgba(157,255,63,0.35)]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
