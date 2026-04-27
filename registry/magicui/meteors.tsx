"use client";

import { motion } from "framer-motion";

export function Meteors({ number = 20 }: { number?: number }) {
  const meteors = Array.from({ length: number }, (_, index) => {
    const left = (index * 37) % 100;
    const top = (index * 19) % 100;
    const delay = (index % 10) * 0.35;
    const duration = 3.8 + (index % 5) * 0.45;
    return { left, top, delay, duration, key: index };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {meteors.map((meteor) => (
        <motion.span
          key={meteor.key}
          initial={{ opacity: 0, x: 140, y: -140 }}
          animate={{ opacity: [0, 1, 0], x: -220, y: 220 }}
          transition={{
            duration: meteor.duration,
            delay: meteor.delay,
            repeat: Infinity,
            repeatDelay: 1.4,
            ease: "linear"
          }}
          className="absolute h-24 w-px bg-gradient-to-b from-transparent via-white/70 to-transparent"
          style={{ left: `${meteor.left}%`, top: `${meteor.top}%`, rotate: "35deg" }}
        >
          <span className="absolute left-[-3px] top-0 h-2 w-2 bg-white/85 shadow-[0_0_16px_rgba(255,255,255,0.9)]" />
        </motion.span>
      ))}
    </div>
  );
}
