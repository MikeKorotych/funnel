"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ScaleConfig, DialogueAnswer } from "@/engine/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function ScaleInput({
  config,
  answers,
  onSelect,
}: {
  config: ScaleConfig;
  answers: DialogueAnswer[];
  onSelect: (answer: DialogueAnswer) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const count = config.max - config.min + 1;
  const values = Array.from({ length: count }, (_, i) => config.min + i);

  const handleConfirm = () => {
    if (selected === null) return;
    const idx = selected - config.min;
    const answer = answers[idx];
    if (answer) onSelect(answer);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 w-full flex-1"
    >
      <div className="flex items-center justify-between gap-2">
        {values.map((value) => {
          const isSelected = selected === value;
          return (
            <motion.button
              key={value}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelected(value)}
              className={cn(
                "flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer",
                "w-12 h-12 text-base font-semibold",
                isSelected
                  ? "bg-white text-[#0a0a0a] scale-110"
                  : "bg-[#171717] text-text-secondary hover:bg-[#1f1f1f] hover:text-text-primary border border-[#303030]",
              )}
            >
              {value}
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-between px-1">
        <span className="text-xs text-text-muted">{config.minLabel}</span>
        <span className="text-xs text-text-muted">{config.maxLabel}</span>
      </div>

      <motion.div animate={{ opacity: selected !== null ? 1 : 0.3 }} transition={{ duration: 0.2 }} className="mt-auto pt-4 pb-8">
        <Button onClick={handleConfirm} disabled={selected === null} className="w-full">
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
}
