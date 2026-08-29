"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowRight, Logo } from "./ui";
import SoundToggle from "./SoundToggle";

const LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Process", href: "#process" },
  { label: "Engagement", href: "#engagement" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const CAPABILITIES = [
  { label: "AI & Data", href: "#capabilities" },
  { label: "Cloud & DevOps", href: "#capabilities" },
  { label: "Software Engineering", href: "#capabilities" },
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[rgba(5,7,4,0.85)] backdrop-blur-md border-b border-[rgba(255,255,255,0.07)]" : "bg-transparent"
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
            onClick={() => setOpen(!open)}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] border border-[rgba(255,255,255,0.12)]"
            aria-label="Toggle menu"
          >
            <span className={`block w-4 h-[1.5px] bg-white transition-transform ${open ? "rotate-45 translate-y-[3px]" : ""}`} />
            <span className={`block w-4 h-[1.5px] bg-white transition-transform ${open ? "-rotate-45 -translate-y-[3px]" : ""}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-[rgba(5,7,4,0.97)] border-b border-[rgba(255,255,255,0.08)]"
          >
            <div className="vx-container py-6 flex flex-col gap-1">
              <p className="pt-1 pb-2 text-[10px] font-mono tracking-[0.2em] uppercase text-[#6f7a66]">Capabilities</p>
              {CAPABILITIES.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-[12px] font-mono tracking-[0.16em] uppercase text-[#c9d2c0] hover:text-[#9dff3f]"
                >
                  {c.label}
                </a>
              ))}
              <div className="my-2 h-px bg-[rgba(255,255,255,0.08)]" />
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-[12px] font-mono tracking-[0.16em] uppercase text-[#c9d2c0] hover:text-[#9dff3f]"
                >
                  {l.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="vx-btn vx-btn-lime mt-4 justify-center">
                Let&apos;s Talk
                <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
