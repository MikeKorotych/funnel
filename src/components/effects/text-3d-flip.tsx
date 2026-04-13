"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";

export function Text3DFlip({
  texts,
  intervalMs = 3000,
  className,
}: {
  texts: string[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFlipping(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % texts.length);
        setFlipping(false);
      }, 300);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [texts.length, intervalMs]);

  return (
    <span
      className={cn(
        "inline-block transition-transform duration-300 ease-in-out",
        "[perspective:1000px]",
        className,
      )}
    >
      <span
        className="inline-block transition-transform duration-300"
        style={{
          transform: flipping ? "rotateX(90deg)" : "rotateX(0deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {texts[index]}
      </span>
    </span>
  );
}
