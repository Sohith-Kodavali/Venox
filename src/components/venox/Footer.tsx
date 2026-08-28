import { ArrowRight, Logo } from "./ui";
import Reveal from "./Reveal";

const COLS = [
  {
    head: "Capabilities",
    links: ["AI & Data", "Cloud & DevOps", "Software Engineering"],
  },
  {
    head: "Company",
    links: ["About Us", "Our Process", "Engagement Models", "Solution Experience"],
  },
  {
    head: "Resources",
    links: ["Approach", "Technologies", "FAQs"],
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
      <div className="relative vx-container pt-16 pb-8 grid gap-12 lg:grid-cols-[1.3fr_2fr]">
        <Reveal>
          <div>
            <Logo />
            <p className="mt-6 text-[13px] text-[#9aa590]">Technology &amp; Digital Engineering Partner</p>
            <p className="mt-2 text-[10px] font-mono tracking-[0.18em] uppercase text-[#6f7a66]">
              United States &nbsp;&bull;&nbsp; India Delivery Team
            </p>
            <div className="mt-6 flex gap-3">
              {(["in", "x", "mail"] as const).map((t) => (
                <a
                  key={t}
                  href="#top"
                  className="w-8 h-8 border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[#9aa590] hover:text-[#9dff3f] hover:border-[#9dff3f] hover:-translate-y-0.5 transition-all"
                  aria-label={t}
                >
                  <SocialIcon type={t} />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {COLS.map((c, ci) => (
            <Reveal key={c.head} delay={ci * 0.08}>
              <div>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white mb-4">{c.head}</p>
                {c.links.map((l) => (
                  <a key={l} href="#top" className="vx-footer-link">
                    {l}
                  </a>
                ))}
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.24}>
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white mb-4">Get in Touch</p>
              <a href="mailto:support@vexonsol.com" className="vx-footer-link">
                support@vexonsol.com
              </a>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[#9aa590] max-w-[220px]">
                13809 Research Blvd STE 500
                <br />
                Austin, TX 78750
              </p>
              <a href="mailto:support@vexonsol.com" className="vx-btn vx-btn-lime !py-2.5 !px-4 !text-[10px] mt-4">
                Let&apos;s Talk
                <ArrowRight size={12} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative vx-container overflow-hidden">
        <p className="vx-watermark text-center translate-y-[28%]">VEXON</p>
      </div>

      <div className="relative border-t border-[rgba(255,255,255,0.05)] bg-[#030502]">
        <div className="vx-container py-5 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono tracking-[0.08em] text-[#4d573f]">
          <span>© 2026 Vexon Solutions Inc. All rights reserved.</span>
          <span className="flex items-center gap-6">
            <a href="#top" className="hover:text-[#9aa590]">Privacy Policy</a>
            <a href="#top" className="hover:text-[#9aa590]">Terms of Service</a>
            <a
              href="#top"
              className="w-8 h-8 -my-2 border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[#9aa590] hover:text-[#9dff3f] hover:border-[#9dff3f] transition-colors"
              aria-label="Back to top"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 20V5M5.5 11 12 4.5 18.5 11" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
