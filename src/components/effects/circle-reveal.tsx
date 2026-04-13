"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Full-screen circle reveal animation.
 * A bright circle expands from the center, then fades to reveal content beneath.
 * Creates a dramatic "wow" effect on first page load.
 */
export function CircleReveal({
  color = "#ffffff",
  duration = 1.8,
  onComplete,
}: {
  color?: string;
  duration?: number;
  onComplete?: () => void;
}) {
  const [phase, setPhase] = useState<"flash" | "expand" | "done">("flash");

  useEffect(() => {
    // Phase 1: brief bright flash
    const t1 = setTimeout(() => setPhase("expand"), 200);
    // Phase 2: circle expands and fades
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, duration * 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Dark overlay */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === "expand" ? 0 : 1 }}
            transition={{ duration: duration * 0.6, ease: "easeOut" }}
          />

          {/* Expanding circle */}
          <motion.div
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, ${color} 0%, ${color}80 30%, transparent 70%)`,
            }}
            initial={{ width: 4, height: 4, opacity: 1 }}
            animate={{
              width: phase === "expand" ? "300vmax" : 4,
              height: phase === "expand" ? "300vmax" : 4,
              opacity: phase === "expand" ? 0 : 1,
            }}
            transition={{
              duration: phase === "expand" ? duration * 0.7 : 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* Center flash dot */}
          {phase === "flash" && (
            <motion.div
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 40px 20px ${color}` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: 1 }}
              transition={{ duration: 0.15 }}
            />
          )}

          {/* Scanlines overlay for retro feel */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
