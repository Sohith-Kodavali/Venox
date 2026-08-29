"use client";

import { useState } from "react";
import { ArrowRight, LimeButton, Tag } from "./ui";
import Reveal from "./Reveal";
import WaveCanvas from "./WaveCanvas";

// TODO: replace with a real endpoint (Formspree / Basin / Netlify Forms / API route)
const FORM_ENDPOINT = "";

export default function CtaSection() {
  const [state, setState] = useState<
    { kind: "idle" } | { kind: "submitting" } | { kind: "sent" } | { kind: "error"; message: string }
  >({ kind: "idle" });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // No endpoint configured yet → fall back to opening the user's mail client
    if (!FORM_ENDPOINT) {
      const name = String(data.get("name") ?? "");
      const email = String(data.get("email") ?? "");
      const message = String(data.get("message") ?? "");
      const subject = encodeURIComponent(`New enquiry from ${name || "the Vexon site"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );
      window.location.href = `mailto:support@vexonsol.com?subject=${subject}&body=${body}`;
      setState({ kind: "sent" });
      return;
    }

    setState({ kind: "submitting" });
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setState({ kind: "sent" });
      form.reset();
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#040603] border-t border-[rgba(255,255,255,0.06)] vx-grain"
    >
      <div className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none">
        <WaveCanvas color="#9dff3f" layers={4} speed={0.9} amplitude={0.6} className="w-full h-full" opacity={0.5} />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 120%, rgba(157,255,63,0.14), transparent 65%), radial-gradient(ellipse 40% 40% at 85% 0%, rgba(157,255,63,0.05), transparent 60%)",
        }}
      />

      <div className="relative vx-container py-24 lg:py-32 grid lg:grid-cols-[1fr_1.05fr] gap-14 items-start">
        <div className="lg:pt-6">
          <Reveal>
            <Tag>Let&apos;s Build Together</Tag>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="vx-h2 mt-6 text-white">
              Have a <span className="text-[#9dff3f]">problem</span>
              <br />
              worth solving?
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-[14px] leading-relaxed text-[#9aa590] max-w-[440px]">
              Tell us about the outcome you&apos;re after. A senior engineer
              will reply within one business day with a shortlist of
              approaches and next steps.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-6 text-[12px] font-mono tracking-[0.14em] uppercase text-[#9aa590]">
              <a
                href="mailto:support@vexonsol.com"
                className="flex items-center gap-2 hover:text-[#9dff3f] transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-[#9dff3f] rounded-full" />
                support@vexonsol.com
              </a>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#9dff3f]/50 rounded-full" />
                Austin, TX
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <form
            onSubmit={onSubmit}
            className="vx-card p-6 sm:p-8 backdrop-blur-sm bg-[rgba(6,10,6,0.72)] border border-[rgba(157,255,63,0.14)]"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" name="name" type="text" required autoComplete="name" />
              <Field label="Work email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="mt-4">
              <Field label="Company" name="company" type="text" autoComplete="organization" />
            </div>
            <div className="mt-4">
              <Field
                label="What are you trying to build?"
                name="message"
                as="textarea"
                required
                rows={4}
              />
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-[10px] font-mono tracking-[0.14em] uppercase text-[#6f7a66] max-w-[210px] leading-relaxed">
                We&apos;ll never share your details.
              </p>
              <button
                type="submit"
                disabled={state.kind === "submitting"}
                className="vx-btn vx-btn-lime !py-3 !px-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {state.kind === "submitting" ? "Sending…" : state.kind === "sent" ? "Sent" : "Send"}
                <ArrowRight size={14} />
              </button>
            </div>

            {state.kind === "sent" && (
              <p className="mt-4 text-[11px] font-mono tracking-[0.14em] uppercase text-[#9dff3f]">
                ✓ Thanks — we&apos;ll be in touch shortly.
              </p>
            )}
            {state.kind === "error" && (
              <p className="mt-4 text-[11px] font-mono tracking-[0.14em] uppercase text-[#ff8b8b]">
                Couldn&apos;t send: {state.message}. Please email us directly.
              </p>
            )}
          </form>

          <div className="mt-4 flex items-center justify-center gap-3 text-[10px] font-mono tracking-[0.2em] uppercase text-[#6f7a66]">
            <span className="w-8 h-px bg-[rgba(255,255,255,0.15)]" />
            OR
            <span className="w-8 h-px bg-[rgba(255,255,255,0.15)]" />
          </div>
          <div className="mt-4 flex justify-center">
            <LimeButton href="mailto:support@vexonsol.com">
              Email Us Directly
            </LimeButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// Minimal styled input — inline so this file stays self-contained
function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  as,
  rows,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  as?: "textarea";
  rows?: number;
}) {
  const shared =
    "peer w-full bg-transparent border border-[rgba(255,255,255,0.12)] focus:border-[#9dff3f] outline-none text-[13.5px] text-white placeholder-transparent transition-colors px-3 pt-5 pb-2";
  return (
    <label className="relative block">
      {as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          rows={rows}
          placeholder={label}
          className={`${shared} resize-none min-h-[110px]`}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          autoComplete={autoComplete}
          placeholder={label}
          className={shared}
        />
      )}
      <span className="pointer-events-none absolute left-3 top-2 text-[9.5px] font-mono tracking-[0.14em] uppercase text-[#6f7a66] peer-focus:text-[#9dff3f] transition-colors">
        {label}
        {required && <span className="text-[#9dff3f]"> *</span>}
      </span>
    </label>
  );
}
