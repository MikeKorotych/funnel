"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Text that starts blurry and gradually sharpens while growing slightly in size.
 * Creates an "emerging from fog" effect.
 */
export function FuzzyText({
  text,
  duration = 2000,
  className,
  onComplete,
}: {
  text: string;
  duration?: number;
  className?: string;
  onComplete?: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const start = performance.now();
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      if (p < 1) {
        raf = requestAnimationFrame(animate);
      } else if (!doneRef.current) {
        doneRef.current = true;
        onComplete?.();
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [duration, onComplete]);

  // Blur: 12px → 0px. Scale: 0.95 → 1.0. Opacity: 0.3 → 1
  const blur = 12 * (1 - progress);
  const scale = 0.95 + 0.05 * progress;
  const opacity = 0.3 + 0.7 * progress;

  return (
    <span
      className={cn("inline-block transition-none", className)}
      style={{
        filter: `blur(${blur}px)`,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {text}
    </span>
  );
}
