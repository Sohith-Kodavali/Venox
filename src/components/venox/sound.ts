"use client";

// Procedural sound engine using Web Audio API — no audio assets, no
// licensing, always available. Muted by default so the site opens
// silent; user opts in via the navbar toggle.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = true;

const STORAGE_KEY = "vexon:sound-muted";
export const MUTE_EVENT = "vexon:sound-mute";

if (typeof window !== "undefined") {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  // default = muted (respects browser autoplay + first impression on site)
  muted = stored === null ? true : stored === "1";
}

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx && ctx.state !== "closed") return ctx;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = 0.18; // conservative overall level
    master.connect(ctx.destination);
    return ctx;
  } catch {
    return null;
  }
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(v: boolean) {
  muted = v;
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
  window.dispatchEvent(new CustomEvent(MUTE_EVENT, { detail: v }));
  // Kick the audio context awake on user gesture (mute toggle counts)
  if (!v) {
    const c = ensure();
    if (c && c.state === "suspended") c.resume();
  }
}

export function toggleMute() {
  setMuted(!muted);
}

type BeepOpts = {
  type?: OscillatorType;
  attack?: number;
  gain?: number;
  sweepTo?: number;
};

function beep(freq: number, duration: number, opts: BeepOpts = {}) {
  if (muted) return;
  const c = ensure();
  if (!c || !master) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(freq, now);
  if (opts.sweepTo)
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(opts.sweepTo, 0.0001),
      now + duration
    );
  const gain = opts.gain ?? 0.4;
  const attack = opts.attack ?? 0.004;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(g).connect(master);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function noise(duration: number, filterFreq: number, gain = 0.28) {
  if (muted) return;
  const c = ensure();
  if (!c || !master) return;
  const now = c.currentTime;
  const bufferSize = Math.floor(c.sampleRate * duration);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(filterFreq, now);
  filter.frequency.exponentialRampToValueAtTime(
    Math.max(filterFreq * 0.25, 200),
    now + duration
  );
  filter.Q.value = 2;
  const g = c.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  src.connect(filter).connect(g).connect(master);
  src.start(now);
  src.stop(now + duration + 0.02);
}

export const sfx = {
  /** Soft tick for letter cascade */
  tick() {
    beep(1100 + Math.random() * 300, 0.06, {
      type: "triangle",
      gain: 0.18,
    });
  },
  /** Cursor hover on primary interactive elements */
  hover() {
    beep(2600, 0.025, { type: "sine", gain: 0.06 });
  },
  /** Button click */
  click() {
    beep(700, 0.05, { type: "square", gain: 0.14 });
    beep(1400, 0.04, { type: "triangle", gain: 0.08, attack: 0.003 });
  },
  /** Progress complete — a rising three-note chord */
  chime() {
    beep(523.25, 0.4, { type: "triangle", gain: 0.22 }); // C5
    window.setTimeout(
      () => beep(659.25, 0.4, { type: "triangle", gain: 0.22 }),
      75
    ); // E5
    window.setTimeout(
      () => beep(783.99, 0.55, { type: "triangle", gain: 0.25 }),
      160
    ); // G5
  },
  /** V-zoom / portal moment — pitched noise sweep + low sine descent */
  whoosh() {
    noise(0.55, 3200, 0.16);
    beep(220, 0.6, {
      type: "sine",
      gain: 0.18,
      sweepTo: 55,
      attack: 0.02,
    });
  },
  /** Form / action success confirmation */
  success() {
    beep(660, 0.09, { type: "triangle", gain: 0.16 });
    window.setTimeout(
      () => beep(990, 0.14, { type: "triangle", gain: 0.18 }),
      80
    );
  },
};
