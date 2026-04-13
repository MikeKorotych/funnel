"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { DialogueAnswer, MultiSelectConfig } from "@/engine/types";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { Check } from "lucide-react";

export function MultiSelectGrid({
  answers,
  config,
  onConfirm,
}: {
  answers: DialogueAnswer[];
  config: MultiSelectConfig;
  onConfirm: (selected: DialogueAnswer[]) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else if (next.size < config.maxSelect) {
          next.add(id);
        }
        return next;
      });
    },
    [config.maxSelect],
  );

  const canContinue = selectedIds.size >= config.minSelect;

  const handleConfirm = () => {
    const selected = answers.filter((a) => selectedIds.has(a.id));
    onConfirm(selected);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 w-full flex-1"
    >
      <p className="text-xs text-text-muted text-center">
        Select up to {config.maxSelect}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {answers.map((answer, index) => {
          const isSelected = selectedIds.has(answer.id);
          return (
            <motion.button
              key={answer.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggle(answer.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl min-h-[88px]",
                "border transition-all duration-200 cursor-pointer",
                isSelected
                  ? "border-white/30 bg-white/5"
                  : "border-[#303030] bg-[#171717] hover:border-white/15",
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center"
                >
                  <Check size={12} className="text-[#0a0a0a]" />
                </motion.div>
              )}

              {answer.icon && (
                <Icon
                  name={answer.icon}
                  size={24}
                  className={isSelected ? "text-white" : "text-text-secondary"}
                />
              )}
              <span
                className={cn(
                  "text-sm font-medium text-center leading-tight",
                  isSelected ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {answer.text}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.div animate={{ opacity: canContinue ? 1 : 0.3 }} transition={{ duration: 0.2 }} className="mt-auto pt-4 pb-8">
        <Button onClick={handleConfirm} disabled={!canContinue} className="w-full">
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
}
