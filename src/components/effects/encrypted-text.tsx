"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/cn";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

export function EncryptedText({
  text,
  speed = 40,
  revealDelay = 0,
  className,
  onComplete,
}: {
  text: string;
  speed?: number;
  revealDelay?: number;
  className?: string;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const revealedRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const completeCalledRef = useRef(false);

  const scrambleChar = useCallback(() => {
    return CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }, []);

  useEffect(() => {
    revealedRef.current = 0;
    setIsComplete(false);
    completeCalledRef.current = false;

    const startTime = performance.now() + revealDelay;

    const animate = (now: number) => {
      if (now < startTime) {
        // Before reveal starts — show all scrambled
        let scrambled = "";
        for (let i = 0; i < text.length; i++) {
          scrambled += text[i] === " " ? " " : scrambleChar();
        }
        setDisplayed(scrambled);
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      if (now - lastTimeRef.current < speed) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = now;

      if (revealedRef.current >= text.length) {
        setDisplayed(text);
        setIsComplete(true);
        if (!completeCalledRef.current) {
          completeCalledRef.current = true;
          onComplete?.();
        }
        return;
      }

      revealedRef.current += 1;
      const revealed = revealedRef.current;

      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (i < revealed) {
          result += text[i];
        } else if (text[i] === " ") {
          result += " ";
        } else {
          result += scrambleChar();
        }
      }
      setDisplayed(result);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [text, speed, revealDelay, scrambleChar, onComplete]);

  return (
    <span
      className={cn(
        "font-mono",
        isComplete ? "text-text-primary" : "text-[var(--color-matrix,#00ff41)]",
        className,
      )}
    >
      {displayed}
    </span>
  );
}
