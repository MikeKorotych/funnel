"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function HeroHighlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ backgroundSize: "0% 40%" }}
      animate={{ backgroundSize: "100% 40%" }}
      transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative inline-block",
        "bg-no-repeat bg-bottom",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 100%)",
      }}
    >
      {children}
    </motion.span>
  );
}
