"use client";

import { motion } from "framer-motion";
import type { ResultTemplate, ScoringDimension } from "@/engine/types";
import { StatBar } from "./stat-bar";
import { Badge } from "@/components/ui/badge";
import { normalizeScore } from "@/engine/scoring";

const severityConfig = {
  mild: { badge: "Early Stage", variant: "success" as const },
  moderate: { badge: "Moderate", variant: "warning" as const },
  severe: { badge: "Severe", variant: "accent" as const },
};

export function DiagnosisCard({
  result,
  scores,
  dimensions,
}: {
  result: ResultTemplate;
  scores: Record<string, number>;
  dimensions: ScoringDimension[];
}) {
  const config = severityConfig[result.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full bg-surface/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold text-text-primary">{result.title}</h2>
        <Badge variant={config.variant}>{config.badge}</Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed mb-6">
        {result.description}
      </p>

      {/* Stat bars */}
      <div className="flex flex-col gap-4">
        {result.stats.map((stat, index) => {
          const dim = dimensions.find((d) => d.id === stat.dimension);
          if (!dim) return null;
          const raw = scores[stat.dimension] ?? 0;
          return (
            <StatBar
              key={stat.dimension}
              label={stat.label}
              icon={stat.icon}
              value={normalizeScore(raw, dim.min, dim.max)}
              maxValue={100}
              inverted={stat.inverted}
              delay={0.3 + index * 0.15}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
