"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowRight, Logo } from "./ui";
import SoundToggle from "./SoundToggle";
import { haptic } from "./sound";

type NavItem = { label: string; sub: string; href: string };

const LINKS: NavItem[] = [
  { label: "Solutions", href: "#solutions", sub: "Reference implementations" },
  { label: "Process", href: "#process", sub: "Discovery to support" },
  { label: "Engagement", href: "#engagement", sub: "Ways we work together" },
  { label: "About", href: "#about", sub: "The partnership" },
  { label: "Contact", href: "#contact", sub: "Let's build together" },
];

const CAPABILITIES: NavItem[] = [
  { label: "AI & Data", href: "#capabilities", sub: "Intelligence & analytics" },
  { label: "Cloud & DevOps", href: "#capabilities", sub: "Infrastructure & scale" },
  { label: "Software Engineering", href: "#capabilities", sub: "Products & platforms" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-[rgba(5,7,4,0.85)] backdrop-blur-md border-b border-[rgba(255,255,255,0.07)]"
          : "bg-transparent"
      }`}
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-[#9dff3f]"
        style={{ scaleX: scrollYProgress }}
      />
      <div className="vx-container h-[72px] flex items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-8">
          <div className="relative group">
            <button
              type="button"
              aria-haspopup="true"
              className="flex items-center gap-1.5 text-[11px] font-mono tracking-[0.16em] uppercase text-[#c9d2c0] hover:text-[#9dff3f] focus-visible:text-[#9dff3f] transition-colors"
            >
              Capabilities
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <div className="absolute top-full left-0 pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-200">
              <div className="bg-[#0b0f09] border border-[rgba(255,255,255,0.08)] min-w-[220px] py-2">
                {CAPABILITIES.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className="block px-5 py-2.5 text-[12px] font-mono tracking-[0.1em] uppercase text-[#c9d2c0] hover:text-[#9dff3f] hover:bg-[rgba(157,255,63,0.06)] transition-colors"
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[11px] font-mono tracking-[0.16em] uppercase text-[#c9d2c0] hover:text-[#9dff3f] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SoundToggle />
          <a href="#contact" className="vx-btn vx-btn-lime !py-2.5 !px-5 hidden sm:inline-flex">
            Let&apos;s Talk
            <ArrowRight size={14} />
          </a>
          <button
            onClick={() => {
              setOpen((v) => !v);
              haptic(6);
            }}
            className="lg:hidden w-10 h-10 relative flex items-center justify-center border border-[rgba(255,255,255,0.14)] z-[80]"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className={`absolute w-4 h-[1.5px] bg-white transition-all duration-300 ${
                open ? "rotate-45" : "-translate-y-[3px]"
              }`}
            />
            <span
              className={`absolute w-4 h-[1.5px] bg-white transition-all duration-300 ${
                open ? "-rotate-45" : "translate-y-[3px]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* ─── FULL-SCREEN MOBILE MENU ────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed inset-0 z-[70] bg-[rgba(4,7,4,0.96)] backdrop-blur-2xl"
          >
            {/* Ambient lime glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 45% at 100% 0%, rgba(157,255,63,0.09), transparent 60%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(29,96,68,0.14), transparent 60%)",
              }}
            />
            <div className="vx-grid-bg absolute inset-0 opacity-20 pointer-events-none" />

            <div className="relative h-full flex flex-col px-6 pt-24 pb-8 overflow-y-auto">
              {/* Section label */}
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-[10px] font-mono tracking-[0.28em] uppercase text-[#6f7a66] mb-4"
              >
                Capabilities
              </motion.p>
              <div className="flex flex-col divide-y divide-[rgba(255,255,255,0.06)] mb-8">
                {CAPABILITIES.map((c, i) => (
                  <motion.a
                    key={c.label}
                    href={c.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 + i * 0.05,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => {
                      setOpen(false);
                      haptic(6);
                    }}
                    className="group flex items-center justify-between py-4 text-white active:text-[#9dff3f]"
                  >
                    <div>
                      <p className="text-[18px] font-semibold leading-tight">
                        {c.label}
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-[#6f7a66]">{c.sub}</p>
                    </div>
                    <ArrowRight size={14} className="text-[#6f7a66]" />
                  </motion.a>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[10px] font-mono tracking-[0.28em] uppercase text-[#6f7a66] mb-4"
              >
                Company
              </motion.p>
              <div className="flex flex-col divide-y divide-[rgba(255,255,255,0.06)]">
                {LINKS.map((l, i) => (
                  <motion.a
                    key={l.label}
                    href={l.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.32 + i * 0.05,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => {
                      setOpen(false);
                      haptic(6);
                    }}
                    className="group flex items-center justify-between py-4 text-white active:text-[#9dff3f]"
                  >
                    <div>
                      <p className="text-[22px] font-semibold leading-tight tracking-[-0.01em]">
                        {l.label}
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-[#6f7a66]">{l.sub}</p>
                    </div>
                    <span className="text-[10px] font-mono tracking-[0.16em] text-[#6f7a66]">
                      0{i + 1}
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* Bottom-anchored contact block */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-auto pt-10"
              >
                <div className="border-t border-[rgba(255,255,255,0.08)] pt-6">
                  <p className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#6f7a66]">
                    Get in touch
                  </p>
                  <a
                    href="mailto:support@vexonsol.com"
                    className="mt-2 block text-[16px] text-white active:text-[#9dff3f]"
                    onClick={() => haptic(6)}
                  >
                    support@vexonsol.com
                  </a>
                  <p className="mt-1 text-[13px] text-[#9aa590]">
                    Austin, Texas &nbsp;—&nbsp; United States
                  </p>
                  <a
                    href="#contact"
                    onClick={() => {
                      setOpen(false);
                      haptic(10);
                    }}
                    className="vx-btn vx-btn-lime mt-5 w-full justify-center"
                  >
                    Let&apos;s Talk
                    <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
