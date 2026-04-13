"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { LoaderStep } from "@/engine/types";

export function LoaderScreen({
  steps,
  onComplete,
}: {
  steps: LoaderStep[];
  onComplete: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStep >= steps.length) {
      onComplete();
      return;
    }

    const step = steps[currentStep];
    const startProgress = (currentStep / steps.length) * 100;
    const endProgress = ((currentStep + 1) / steps.length) * 100;

    // Animate progress within current step
    const interval = 50;
    const ticks = step.durationMs / interval;
    const increment = (endProgress - startProgress) / ticks;
    let tick = 0;

    const timer = setInterval(() => {
      tick++;
      setProgress(Math.min(startProgress + increment * tick, endProgress));
      if (tick >= ticks) {
        clearInterval(timer);
        setCurrentStep((prev) => prev + 1);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentStep, steps, onComplete]);

  const currentLabel = steps[Math.min(currentStep, steps.length - 1)]?.label ?? "";

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      {/* Spinning loader */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-full border-2 border-surface-elevated border-t-primary"
      />

      {/* Status text */}
      <motion.p
        key={currentStep}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-base text-text-secondary text-center"
      >
        {currentLabel}
      </motion.p>

      {/* Progress bar */}
      <div className="w-full max-w-[280px]">
        <div className="h-1.5 w-full rounded-full bg-surface-elevated overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="text-xs text-text-muted text-center mt-2">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
