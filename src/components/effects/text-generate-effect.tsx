"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function TextGenerateEffect({
  text,
  speed = 0.08,
  delay = 0,
  className,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}) {
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <span className={cn("inline", className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.4,
            delay: delay + i * speed,
            ease: "easeOut",
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
