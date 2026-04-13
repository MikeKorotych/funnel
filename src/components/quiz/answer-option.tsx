"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export function AnswerOption({
  text,
  emoji,
  icon,
  index,
  selected,
  onSelect,
}: {
  text: string;
  emoji?: string;
  icon?: string;
  index: number;
  selected?: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200, damping: 20 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200",
        "min-h-[60px] select-none cursor-pointer",
        "border border-[#303030] hover:border-white/20",
        "bg-[#171717] hover:bg-[#1f1f1f]",
        "active:bg-white/5",
        selected && "border-white/30 bg-white/5",
      )}
    >
      {icon ? (
        <Icon name={icon} size={22} className="text-text-secondary shrink-0" />
      ) : emoji ? (
        <span className="text-2xl shrink-0">{emoji}</span>
      ) : null}
      <span className="text-base text-text-primary font-medium">{text}</span>
    </motion.button>
  );
}
