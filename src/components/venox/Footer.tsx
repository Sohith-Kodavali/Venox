import { ArrowRight, Logo } from "./ui";
import Reveal from "./Reveal";

const COLS: { head: string; links: { label: string; href: string }[] }[] = [
  {
    head: "Capabilities",
    links: [
      { label: "AI & Data", href: "#capabilities" },
      { label: "Cloud & DevOps", href: "#capabilities" },
      { label: "Software Engineering", href: "#capabilities" },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Process", href: "#process" },
      { label: "Engagement", href: "#engagement" },
      { label: "Solutions", href: "#solutions" },
    ],
  },
  {
    head: "More",
    links: [
      { label: "Technologies", href: "#tech" },
      { label: "Contact", href: "#contact" },
    ],
  },
];

function SocialIcon({ type }: { type: "in" | "x" | "mail" }) {
  if (type === "in")
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4 0 4.75 2.6 4.75 6V21h-4v-5.5c0-1.3-.03-3-1.85-3-1.85 0-2.13 1.44-2.13 2.9V21h-4V9Z" />
      </svg>
    );
  if (type === "x")
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L1.2 2h6.4l4.4 5.9L18.9 2Zm-1.1 18h1.7L6.7 3.9H4.9L17.8 20Z" />
      </svg>
    );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#030502] border-t border-[rgba(255,255,255,0.06)] relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(157,255,63,0.5), transparent)" }}
      />

      {/* Primary — brand + nav + contact */}
      <div className="relative vx-container pt-20 pb-16 grid gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
        {/* Brand block */}
        <Reveal>
          <div>
            <Logo />
            <p className="mt-6 text-[14px] leading-relaxed text-[#c9d2c0] max-w-[320px]">
              Technology &amp; Digital Engineering Partner.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#9aa590] max-w-[320px]">
              Software, AI, data and cloud — delivered as one team.
            </p>

            <div className="mt-8 flex gap-2.5">
              {(["in", "x", "mail"] as const).map((t) => (
                <a
                  key={t}
                  href={t === "mail" ? "mailto:support@vexonsol.com" : "#top"}
                  className="w-9 h-9 border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[#9aa590] hover:text-[#9dff3f] hover:border-[#9dff3f] hover:-translate-y-0.5 transition-all"
                  aria-label={t === "in" ? "LinkedIn" : t === "x" ? "X (Twitter)" : "Email"}
                >
                  <SocialIcon type={t} />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Nav + contact */}
        <div className="grid gap-10 sm:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.15fr)]">
          {COLS.map((c, ci) => (
            <Reveal key={c.head} delay={ci * 0.06}>
              <div>
                <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#6f7a66] mb-4">
                  {c.head}
                </p>
                <div className="flex flex-col gap-0.5">
                  {c.links.map((l) => (
                    <a key={l.label} href={l.href} className="vx-footer-link">
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.24}>
            <div>
              <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#6f7a66] mb-4">
                Get in Touch
              </p>
              <a
                href="mailto:support@vexonsol.com"
                className="text-[13.5px] text-[#c9d2c0] hover:text-[#9dff3f] transition-colors"
              >
                support@vexonsol.com
              </a>
              <p className="mt-3 text-[12.5px] leading-relaxed text-[#9aa590] max-w-[240px]">
                13809 Research Blvd STE 500
                <br />
                Austin, TX 78750
              </p>
              <a
                href="mailto:support@vexonsol.com"
                className="vx-btn vx-btn-lime !py-2.5 !px-4 !text-[10px] mt-5"
              >
                Let&apos;s Talk
                <ArrowRight size={12} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Watermark — quieter, smaller, no crop transform */}
      <div className="relative vx-container overflow-hidden pb-6">
        <p
          aria-hidden="true"
          className="text-center font-bold leading-none select-none"
          style={{
            fontSize: "clamp(4rem, 12vw, 10rem)",
            letterSpacing: "-0.04em",
            color: "transparent",
            WebkitTextStroke: "1px rgba(157,255,63,0.06)",
          }}
        >
          VEXON
        </p>
      </div>

      {/* Bottom bar — three zones, generous gap, back-to-top gets its own spot */}
      <div className="relative border-t border-[rgba(255,255,255,0.05)]">
        <div className="vx-container py-5 flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-[10px] font-mono tracking-[0.14em] text-[#4d573f]">
          <div className="flex items-center gap-4 flex-wrap">
            <span>© 2026 Vexon Solutions Inc.</span>
            <span className="hidden sm:inline text-[#242c1f] tracking-[0.16em]">
              Made by Aeternum Works
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#top" className="hover:text-[#9aa590] transition-colors">
              Privacy
            </a>
            <a href="#top" className="hover:text-[#9aa590] transition-colors">
              Terms
            </a>
          </div>
          <a
            href="#top"
            aria-label="Back to top"
            className="w-9 h-9 border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[#9aa590] hover:text-[#9dff3f] hover:border-[#9dff3f] transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 20V5M5.5 11 12 4.5 18.5 11"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
