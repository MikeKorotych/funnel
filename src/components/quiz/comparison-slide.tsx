"use client";

import { motion } from "framer-motion";
import { Smartphone, Sun, Moon, Heart, Brain, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const addicted = [
  { icon: Moon, text: "73% report poor sleep", color: "#ef4444" },
  { icon: TrendingDown, text: "40% increase in anxiety", color: "#ef4444" },
  { icon: Smartphone, text: "96 phone checks per day", color: "#ef4444" },
  { icon: Brain, text: "8-second average attention span", color: "#ef4444" },
];

const free = [
  { icon: Sun, text: "1h+ extra quality sleep", color: "#10b981" },
  { icon: Heart, text: "Significant drop in depression", color: "#10b981" },
  { icon: TrendingUp, text: "32% boost in productivity", color: "#10b981" },
  { icon: Brain, text: "Better focus and memory", color: "#10b981" },
];

export function ComparisonSlide({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col gap-6 w-full py-4">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm text-text-secondary"
      >
        Based on research from NIH, UPenn, and Stanford
      </motion.p>

      {/* Addicted column */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-error/20 bg-error/5 p-4"
      >
        <h3 className="text-sm font-semibold text-error mb-3 flex items-center gap-2">
          <Smartphone size={16} />
          With phone addiction
        </h3>
        <div className="flex flex-col gap-2.5">
          {addicted.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
              className="flex items-center gap-2.5"
            >
              <item.icon size={14} style={{ color: item.color }} className="shrink-0" />
              <span className="text-sm text-text-secondary">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Free column */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="rounded-xl border border-success/20 bg-success/5 p-4"
      >
        <h3 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
          <Sun size={16} />
          After digital detox
        </h3>
        <div className="flex flex-col gap-2.5">
          {free.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + i * 0.15 }}
              className="flex items-center gap-2.5"
            >
              <item.icon size={14} style={{ color: item.color }} className="shrink-0" />
              <span className="text-sm text-text-secondary">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <Button onClick={onContinue} className="w-full">
          I Want to Change
        </Button>
      </motion.div>
    </div>
  );
}
