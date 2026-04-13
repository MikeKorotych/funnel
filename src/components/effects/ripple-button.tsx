"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function RippleButton({
  children,
  onClick,
  className,
  rippleColor = "rgba(255,255,255,0.2)",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  rippleColor?: string;
}) {
  const rings = [0, 1, 2, 3, 4];

  return (
    <div className="relative">
      {/* Ripple rings behind the button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {rings.map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{ borderColor: rippleColor }}
            initial={{ width: 40, height: 40, opacity: 0.6 }}
            animate={{
              width: [40, 200 + i * 60],
              height: [40, 200 + i * 60],
              opacity: [0.4 - i * 0.06, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Actual button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={cn(
          "relative z-10 rounded-xl px-8 py-4 text-base font-semibold",
          "bg-white text-[#0a0a0a] cursor-pointer",
          "min-h-[48px] select-none",
          "transition-all duration-200",
          className,
        )}
      >
        {children}
      </motion.button>
    </div>
  );
}
