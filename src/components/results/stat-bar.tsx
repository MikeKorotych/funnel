"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export function StatBar({
  label,
  icon,
  value,
  maxValue,
  delay = 0,
  inverted = false,
  className,
}: {
  label: string;
  icon: string;
  value: number;
  maxValue: number;
  delay?: number;
  /** When true, high values are positive (green). Default: high = negative (red). */
  inverted?: boolean;
  className?: string;
}) {
  const percentage = Math.round((value / maxValue) * 100);

  // For "inverted" stats (motivation, awareness): high = good = green
  // For normal stats (addiction severity): high = bad = red
  const level = inverted
    ? percentage >= 60 ? "success" : percentage >= 30 ? "warning" : "error"
    : percentage >= 70 ? "error" : percentage >= 40 ? "warning" : "success";

  const barColors = {
    error: "from-error to-error/70",
    warning: "from-warning to-accent",
    success: "from-success to-success/70",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="flex items-center gap-2 text-sm text-text-secondary">
          <Icon name={icon} size={16} className="text-text-muted" />
          {label}
        </span>
        <span className="text-sm font-medium text-text-primary">
          {percentage}%
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-surface-elevated overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", barColors[level])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
