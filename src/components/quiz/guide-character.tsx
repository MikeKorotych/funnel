"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const moodColors = {
  neutral: { inner: "#e5e5e5", outer: "rgba(255, 255, 255, 0.08)", ring: "rgba(255, 255, 255, 0.12)" },
  concerned: { inner: "#d4d4d4", outer: "rgba(255, 255, 255, 0.06)", ring: "rgba(255, 255, 255, 0.10)" },
  encouraging: { inner: "#f5f5f5", outer: "rgba(255, 255, 255, 0.10)", ring: "rgba(255, 255, 255, 0.15)" },
  dramatic: { inner: "#c9a96e", outer: "rgba(201, 169, 110, 0.10)", ring: "rgba(201, 169, 110, 0.15)" },
};

export function GuideCharacter({
  mood = "neutral",
  size = "md",
  className,
}: {
  mood?: "neutral" | "concerned" | "encouraging" | "dramatic";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const colors = moodColors[mood];
  const dims = { sm: 48, md: 72, lg: 96 }[size];

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: dims, height: dims }}
    >
      {/* Outer glow ring */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, ${colors.ring} 0%, transparent 70%)` }}
      />
      {/* Middle glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: dims * 0.75,
          height: dims * 0.75,
          background: `radial-gradient(circle, ${colors.outer} 0%, transparent 70%)`,
        }}
      />
      {/* Core orb */}
      <svg width={dims * 0.5} height={dims * 0.5} viewBox="0 0 40 40">
        <defs>
          <radialGradient id={`orb-${mood}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="40%" stopColor={colors.inner} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.inner} stopOpacity="0.3" />
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="16" fill={`url(#orb-${mood})`} />
        {/* Specular highlight */}
        <circle cx="14" cy="14" r="4" fill="white" opacity="0.6" />
        <circle cx="16" cy="16" r="2" fill="white" opacity="0.3" />
      </svg>
    </motion.div>
  );
}
