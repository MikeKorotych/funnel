"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { SliderConfig, DialogueAnswer } from "@/engine/types";
import { Button } from "@/components/ui/button";

export function SliderInput({
  config,
  answers,
  onSelect,
  autoSubmit = false,
}: {
  config: SliderConfig;
  answers: DialogueAnswer[];
  onSelect: (answer: DialogueAnswer) => void;
  autoSubmit?: boolean;
}) {
  const [value, setValue] = useState(config.defaultValue);
  const interactionStartedRef = useRef(false);
  const submittedRef = useRef(false);

  const percentage = ((value - config.min) / (config.max - config.min)) * 100;

  const submitValue = (nextValue: number) => {
    if (submittedRef.current) return;

    const bucketSize = (config.max - config.min) / answers.length;
    const idx = Math.min(
      Math.floor((nextValue - config.min) / bucketSize),
      answers.length - 1,
    );
    const answer = answers[idx];
    if (!answer) return;

    submittedRef.current = true;
    onSelect({ ...answer, value: nextValue });
  };

  const handleConfirm = () => {
    submitValue(value);
  };

  const handleRelease = () => {
    if (!autoSubmit || !interactionStartedRef.current) return;
    interactionStartedRef.current = false;
    submitValue(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 w-full flex-1"
    >
      <div className="text-center">
        <span className="text-5xl font-bold text-text-primary tabular-nums">{value}</span>
        <span className="text-lg text-text-secondary ml-1">{config.unit}</span>
      </div>

      <div className="relative px-1">
        <div className="relative h-2 rounded-full bg-white/10">
          <motion.div
            className="absolute h-full rounded-full bg-gradient-to-r from-white/50 to-white/20"
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          onPointerDown={() => {
            interactionStartedRef.current = true;
          }}
          onPointerUp={handleRelease}
          onMouseUp={handleRelease}
          onTouchEnd={handleRelease}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
          style={{ margin: 0 }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#0a0a0a] pointer-events-none"
          animate={{ left: `calc(${percentage}% - 12px)` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ top: '4px' }}
        />
      </div>

      <div className="flex justify-between">
        <span className="text-xs text-text-muted">{config.min}{config.unit}</span>
        <span className="text-xs text-text-muted">{config.max}{config.unit}</span>
      </div>

      {!autoSubmit && (
        <div className="mt-auto pt-4 pb-8">
          <Button onClick={handleConfirm} className="w-full">
            Continue
          </Button>
        </div>
      )}
    </motion.div>
  );
}
