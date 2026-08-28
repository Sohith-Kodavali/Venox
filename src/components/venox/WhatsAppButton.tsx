"use client";

import { motion } from "framer-motion";
import { useLoaded } from "./useLoaded";

const NUMBER = "15551234567"; // placeholder — replace with real number
const MESSAGE = "Hi Vexon — I'd like to talk about a project.";

export default function WhatsAppButton() {
  const loaded = useLoaded();
  const href = `https://wa.me/${NUMBER}?text=${encodeURIComponent(MESSAGE)}`;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Vexon on WhatsApp"
      initial={{ opacity: 0, scale: 0.4, y: 24 }}
      animate={loaded ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.4, y: 24 }}
      transition={{ delay: 1.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      className="group fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[60] w-14 h-14 sm:w-15 sm:h-15 rounded-full flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
        boxShadow:
          "0 10px 30px rgba(18, 140, 126, 0.4), 0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full vx-wa-ping"
        style={{ background: "rgba(37, 211, 102, 0.55)" }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: "0 0 0 4px rgba(37, 211, 102, 0.25)" }}
      />
      <svg
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="white"
        className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"
        aria-hidden="true"
      >
        <path d="M16.003 2.75c-7.32 0-13.253 5.933-13.253 13.253 0 2.335.61 4.62 1.77 6.633L2.75 29.25l6.775-1.778a13.201 13.201 0 006.478 1.65h.005c7.32 0 13.253-5.933 13.253-13.253S23.323 2.75 16.003 2.75zm0 24.086h-.004a10.98 10.98 0 01-5.599-1.535l-.402-.238-4.164 1.093 1.113-4.06-.262-.417a10.964 10.964 0 01-1.678-5.845c0-6.06 4.933-10.994 10.997-10.994 2.935 0 5.694 1.144 7.769 3.221a10.917 10.917 0 013.222 7.775c-.003 6.06-4.936 10.994-10.992 10.994zm6.03-8.234c-.331-.166-1.955-.965-2.258-1.075-.303-.11-.523-.166-.744.166-.22.331-.854 1.075-1.047 1.296-.193.22-.386.248-.717.083-.331-.166-1.396-.515-2.66-1.641-.983-.876-1.647-1.96-1.84-2.29-.193-.331-.02-.51.145-.675.15-.148.331-.386.496-.579.166-.193.22-.331.331-.552.11-.22.055-.414-.027-.579-.083-.166-.744-1.793-1.02-2.457-.269-.646-.542-.558-.744-.568l-.634-.011c-.22 0-.579.083-.882.414-.303.331-1.158 1.131-1.158 2.759 0 1.628 1.186 3.201 1.351 3.421.165.22 2.336 3.567 5.658 5.001.791.342 1.408.545 1.889.698.794.253 1.516.217 2.087.132.637-.095 1.955-.799 2.231-1.572.276-.772.276-1.434.193-1.572-.083-.138-.303-.22-.634-.386z" />
      </svg>
    </motion.a>
  );
}
