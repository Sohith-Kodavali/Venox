"use client";

import { useEffect, useState } from "react";
import { MUTE_EVENT, isMuted, toggleMute } from "./sound";

export default function SoundToggle() {
  const [muted, setMuted] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMuted(isMuted());
    setMounted(true);
    const h = (e: Event) => setMuted(Boolean((e as CustomEvent).detail));
    window.addEventListener(MUTE_EVENT, h);
    return () => window.removeEventListener(MUTE_EVENT, h);
  }, []);

  // Avoid SSR/CSR mismatch for the icon
  if (!mounted) {
    return <span aria-hidden="true" className="w-9 h-9 inline-block" />;
  }

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? "Enable sound" : "Mute sound"}
      aria-pressed={!muted}
      className="w-9 h-9 flex items-center justify-center text-[#9aa590] hover:text-[#9dff3f] border border-[rgba(255,255,255,0.12)] hover:border-[#9dff3f] transition-colors"
      title={muted ? "Sound off · Click to enable" : "Sound on · Click to mute"}
    >
      {muted ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H2v6h4l5 4V5Z" strokeLinejoin="round" />
          <path d="m22 9-6 6M16 9l6 6" strokeLinecap="round" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H2v6h4l5 4V5Z" strokeLinejoin="round" />
          <path
            d="M15.5 8.5c1.6 1.4 1.6 5.6 0 7M18.5 6c3.2 2.4 3.2 9.6 0 12"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
