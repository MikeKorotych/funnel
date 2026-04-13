"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function ShineBorder({
  children,
  color = "#00ff41",
  duration = 3,
  borderWidth = 1,
  borderRadius = 16,
  className,
}: {
  children: ReactNode;
  color?: string;
  duration?: number;
  borderWidth?: number;
  borderRadius?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden p-[1px]", className)}
      style={{ borderRadius }}
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 animate-shine-border"
        style={{
          background: `conic-gradient(from 0deg, transparent 60%, ${color} 80%, transparent 100%)`,
          animationDuration: `${duration}s`,
          borderRadius,
        }}
      />
      {/* Inner content */}
      <div
        className="relative bg-[var(--color-surface,#0f0f23)]"
        style={{
          borderRadius: borderRadius - borderWidth,
        }}
      >
        {children}
      </div>
    </div>
  );
}
