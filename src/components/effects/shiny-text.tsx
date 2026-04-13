"use client";

import { cn } from "@/lib/cn";

export function ShinyText({
  children,
  className,
  shimmerWidth = 100,
}: {
  children: React.ReactNode;
  className?: string;
  shimmerWidth?: number;
}) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent animate-shiny-text",
        "bg-[length:250%_100%]",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(90deg, currentColor 0%, currentColor 40%, #fff ${50 - shimmerWidth / 4}%, #fff ${50 + shimmerWidth / 4}%, currentColor 60%, currentColor 100%)`,
        WebkitTextFillColor: "transparent",
        color: "var(--color-text-primary, #f1f5f9)",
      }}
    >
      {children}
    </span>
  );
}
