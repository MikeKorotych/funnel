"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function MorphingText({
  texts,
  intervalMs = 3000,
  className,
}: {
  texts: string[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [texts.length, intervalMs]);

  return (
    <span className={cn("inline-block relative", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={texts[index]}
          initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="inline-block"
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
