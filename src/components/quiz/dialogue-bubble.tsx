"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SmoothHeightContainer } from "@/components/ui/smooth-height";
import { cn } from "@/lib/cn";

export function DialogueBubble({
  text,
  subtext,
  speed = 50,
  className,
  onComplete,
}: {
  text: string;
  subtext?: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const completeRef = useRef(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    completeRef.current = false;

    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        if (!completeRef.current) {
          completeRef.current = true;
          onComplete?.();
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div className={cn("w-full", className)}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <SmoothHeightContainer className="bg-[#171717] rounded-2xl border border-[#303030]" innerClassName="p-5">
          <p className="text-lg font-medium text-text-primary leading-relaxed">
            {displayedText}
            {!isComplete && (
              <span className="cursor-blink text-text-secondary ml-0.5">|</span>
            )}
          </p>

          {subtext && isComplete && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-2 text-sm text-text-secondary"
            >
              {subtext}
            </motion.p>
          )}
        </SmoothHeightContainer>
      </motion.div>
    </div>
  );
}
