"use client";

import { motion } from "framer-motion";
import type { SalePricingTier } from "@/config/topics/types";
import { cn } from "@/lib/cn";

export function PricingCard({
  tier,
  selected,
  onSelect,
  index,
}: {
  tier: SalePricingTier;
  selected: boolean;
  onSelect: () => void;
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl p-4 text-left transition-all duration-200 border cursor-pointer",
        "flex items-center justify-between",
        selected
          ? "border-white/30 bg-white/5"
          : "border-[#303030] bg-[#171717] hover:border-white/15",
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-text-primary">
            {tier.label}
          </span>
          {tier.badge && (
            <span className="text-xs font-medium text-[#c9a96e] bg-[#c9a96e]/10 px-2 py-0.5 rounded-full">
              {tier.badge}
            </span>
          )}
        </div>
        {tier.originalPrice && (
          <span className="text-xs text-text-muted line-through">
            {tier.originalPrice}
          </span>
        )}
      </div>
      <div className="text-right">
        <span className="text-xl font-bold text-text-primary">{tier.price}</span>
        <span className="text-sm text-text-secondary">{tier.period}</span>
      </div>
    </motion.button>
  );
}
