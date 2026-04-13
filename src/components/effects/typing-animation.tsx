"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export function TypingAnimation({
  text,
  speed = 50,
  delay = 0,
  className,
  cursorColor = "#ededed",
  onComplete,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursorColor?: string;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const doneRef = useRef(false);

  useEffect(() => {
    setDisplayed("");
    doneRef.current = false;

    const startTimeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          if (!doneRef.current) {
            doneRef.current = true;
            onComplete?.();
          }
          // Blink cursor a few times then hide
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay, onComplete]);

  return (
    <span className={cn(className)}>
      {displayed}
      {showCursor && (
        <span
          className="cursor-blink ml-0.5 inline-block w-[2px] h-[1.1em] align-middle"
          style={{ backgroundColor: cursorColor }}
        />
      )}
    </span>
  );
}
