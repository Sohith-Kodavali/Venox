"use client";

import type { ReactNode } from "react";
import { sfx } from "./sound";

export function ArrowRight({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 12h15M13 5.5 19.5 12 13 18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowDown({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 4v15M5.5 13 12 19.5 18.5 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
    </svg>
  );
}

export function Tag({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <span className={`vx-tag${dark ? " vx-tag--dark" : ""}`}>{children}</span>;
}

export function LimeButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="vx-btn vx-btn-lime"
      onClick={() => sfx.click()}
      onMouseEnter={() => sfx.hover()}
    >
      {children}
      <ArrowRight size={15} />
    </a>
  );
}

export function GhostButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="vx-btn vx-btn-ghost"
      onClick={() => sfx.click()}
      onMouseEnter={() => sfx.hover()}
    >
      {children}
      <ArrowRight size={15} />
    </a>
  );
}

export function ArrowLink({
  href,
  children,
  dark = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`vx-arrow-link ${dark ? "text-[#10150c]" : "text-[#9dff3f]"} ${className}`}
      onClick={() => sfx.click()}
    >
      {children}
      <ArrowRight size={14} />
    </a>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M4 6l12 20L28 6h-5.5L16 18.4 9.5 6H4z" fill="#9dff3f" />
        <path d="M9 4l7 11.6L23 4h-4l-3 5.2L13 4H9z" fill="#9dff3f" opacity="0.55" />
      </svg>
      <span className="leading-none">
        <span className="block text-[17px] font-bold tracking-[0.28em] text-white">VEXON</span>
        {!compact && (
          <span className="block text-[8px] tracking-[0.42em] text-[#9aa590] mt-1">SOLUTIONS INC</span>
        )}
      </span>
    </a>
  );
}
