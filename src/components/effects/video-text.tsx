"use client";

import { cn } from "@/lib/cn";

/**
 * Text with a video or gradient background visible through the letters.
 * Since we can't bundle video files easily, this uses an animated gradient
 * that simulates a nature/sky feel (blues, greens, golds).
 */
export function VideoText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent font-bold",
        "bg-[length:300%_300%] animate-video-text",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(135deg, #10b981 0%, #06b6d4 15%, #3b82f6 30%, #8b5cf6 45%, #f59e0b 60%, #10b981 75%, #06b6d4 90%, #10b981 100%)",
      }}
    >
      {children}
    </span>
  );
}
