"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function ProgressBar({
  progress,
  level,
  xp,
  className,
}: {
  progress: number;
  level: number;
  xp: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      {/* Level + XP indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-primary bg-white/10 px-2 py-0.5 rounded-full">
            LVL {level}
          </span>
          <span className="text-xs text-text-muted">{xp} XP</span>
        </div>
        <span className="text-xs text-text-muted">{progress}%</span>
      </div>

      {/* Bar */}
      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-white/40 to-white/20"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
}
