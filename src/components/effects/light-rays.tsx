"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function LightRays({
  color = "#00d4ff",
  count = 6,
  className,
}: {
  color?: string;
  count?: number;
  className?: string;
}) {
  const rays = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={cn("fixed inset-0 z-0 pointer-events-none overflow-hidden", className)}>
      {rays.map((i) => {
        const angle = (360 / count) * i;
        const delay = i * 0.4;
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 origin-bottom-left"
            style={{
              width: "2px",
              height: "120vh",
              background: `linear-gradient(to top, ${color}00, ${color}15 30%, ${color}05 70%, transparent)`,
              transform: `rotate(${angle}deg)`,
              transformOrigin: "bottom center",
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scaleY: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 4,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
