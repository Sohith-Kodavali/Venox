import { LimeButton, Tag } from "./ui";
import Reveal from "./Reveal";
import WaveCanvas from "./WaveCanvas";

export default function CtaSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[#040603] border-t border-[rgba(255,255,255,0.06)] vx-grain">
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

      <div className="relative vx-container py-24 lg:py-36 grid lg:grid-cols-2 gap-14 items-center">
        <div>
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
        </div>
        <Reveal delay={0.2} className="lg:justify-self-end">
          <div className="max-w-[420px]">
            <p className="text-[14px] leading-relaxed text-[#9aa590]">
              Let&apos;s discuss your ideas and explore how we can build what&apos;s next—together.
            </p>
            <div className="mt-8">
              <LimeButton href="mailto:support@vexonsol.com">Start a Conversation</LimeButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
