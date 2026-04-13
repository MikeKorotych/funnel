"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function Spotlight({
  color = "#ffffff",
  duration = 7,
  className,
}: {
  color?: string;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={cn("fixed inset-0 z-0 pointer-events-none overflow-hidden", className)}>
      {/* Primary spotlight beam — sweeps left to right */}
      <motion.div
        className="absolute top-[-40%] w-[560px] h-[1400px] opacity-30"
        style={{
          background: `radial-gradient(68% 69% at 50% 50%, ${color}40 0%, ${color}10 50%, transparent 100%)`,
          filter: "blur(40px)",
        }}
        animate={{ x: [-200, 200, -200] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary beam — counter direction */}
      <motion.div
        className="absolute top-[-20%] right-0 w-[300px] h-[800px] opacity-20"
        style={{
          background: `radial-gradient(50% 50% at 50% 50%, ${color}30 0%, transparent 100%)`,
          filter: "blur(60px)",
        }}
        animate={{ x: [100, -150, 100], y: [0, 50, 0] }}
        transition={{ duration: duration * 1.3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Tertiary ambient glow */}
      <motion.div
        className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] opacity-10"
        style={{
          background: `radial-gradient(50% 50% at 50% 50%, ${color}20 0%, transparent 100%)`,
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: duration * 0.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
