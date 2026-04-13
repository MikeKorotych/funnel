"use client";

import { cn } from "@/lib/cn";

export function GradientText({
  children,
  from = "#00d4ff",
  via,
  to = "#8b5cf6",
  animate = true,
  className,
}: {
  children: React.ReactNode;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
  className?: string;
}) {
  const gradient = via
    ? `linear-gradient(90deg, ${from}, ${via}, ${to}, ${from})`
    : `linear-gradient(90deg, ${from}, ${to}, ${from})`;

  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent",
        animate && "bg-[length:200%_100%] animate-gradient-text",
        className,
      )}
      style={{ backgroundImage: gradient }}
    >
      {children}
    </span>
  );
}
