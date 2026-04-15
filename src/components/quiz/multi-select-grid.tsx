"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import type { DialogueAnswer, MultiSelectConfig } from "@/engine/types";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/* ── Donut-wheel geometry ── */
const OUTER_R = 146;
const INNER_R = 52;
const GAP_DEG = 3;
const VIEW = 320;
const HALF = VIEW / 2;

/** Build an SVG arc-segment path for one donut slice. */
function segmentPath(index: number, total: number): string {
  const span = 360 / total;
  const s = (index * span - 90 + GAP_DEG / 2) * (Math.PI / 180);
  const e = ((index + 1) * span - 90 - GAP_DEG / 2) * (Math.PI / 180);

  const x1o = Math.cos(s) * OUTER_R;
  const y1o = Math.sin(s) * OUTER_R;
  const x2o = Math.cos(e) * OUTER_R;
  const y2o = Math.sin(e) * OUTER_R;
  const x1i = Math.cos(s) * INNER_R;
  const y1i = Math.sin(s) * INNER_R;
  const x2i = Math.cos(e) * INNER_R;
  const y2i = Math.sin(e) * INNER_R;

  return `M ${x1o} ${y1o} A ${OUTER_R} ${OUTER_R} 0 0 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${INNER_R} ${INNER_R} 0 0 0 ${x1i} ${y1i} Z`;
}

/** Centre of a segment (for placing label). */
function labelPos(index: number, total: number) {
  const span = 360 / total;
  const mid = ((index * span - 90 + span / 2) * Math.PI) / 180;
  const r = (OUTER_R + INNER_R) / 2;
  return { x: HALF + Math.cos(mid) * r, y: HALF + Math.sin(mid) * r };
}

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

  const segments = useMemo(
    () =>
      answers.map((_, i) => ({
        path: segmentPath(i, answers.length),
        label: labelPos(i, answers.length),
      })),
    [answers],
  );

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
      className="flex flex-col items-center gap-4 w-full flex-1"
    >
      <p className="text-xs text-text-muted text-center">
        Select up to {config.maxSelect}
      </p>

      {/* ── Donut wheel ── */}
      <div className="relative mx-auto" style={{ width: VIEW, height: VIEW }}>
        {/* SVG segments */}
        <svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="absolute inset-0 w-full h-full"
        >
          <g transform={`translate(${HALF},${HALF})`}>
            {answers.map((answer, i) => {
              const isSelected = selectedIds.has(answer.id);
              return (
                <motion.path
                  key={answer.id}
                  d={segments[i].path}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.08 + i * 0.07,
                    type: "spring",
                    stiffness: 200,
                    damping: 22,
                  }}
                  className="cursor-pointer outline-none"
                  fill={isSelected ? "rgba(255,255,255,0.07)" : "#151515"}
                  stroke={isSelected ? "rgba(255,255,255,0.25)" : "#2a2a2a"}
                  strokeWidth={1}
                  onClick={() => toggle(answer.id)}
                  style={{ transformOrigin: "0 0" }}
                />
              );
            })}

            {/* Inner circle border */}
            <circle
              r={INNER_R - 1}
              fill="transparent"
              stroke="#2a2a2a"
              strokeWidth={1}
            />

            {/* Outer circle border */}
            <circle
              r={OUTER_R + 1}
              fill="none"
              stroke="#2a2a2a"
              strokeWidth={1}
            />
          </g>
        </svg>

        {/* Center counter */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <span className="text-sm text-white/25 tabular-nums">
            {selectedIds.size}/{config.maxSelect}
          </span>
        </div>

        {/* Labels (icon + text) over each segment */}
        {answers.map((answer, i) => {
          const { x, y } = segments[i].label;
          const isSelected = selectedIds.has(answer.id);

          return (
            <div
              key={`label-${answer.id}`}
              className="absolute flex flex-col items-center justify-center gap-1 pointer-events-none"
              style={{
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
                width: 72,
              }}
            >
              {answer.icon && (
                <Icon
                  name={answer.icon}
                  size={22}
                  className={cn(
                    "transition-colors duration-200",
                    isSelected ? "text-white" : "text-white/40",
                  )}
                />
              )}
              <span
                className={cn(
                  "text-[10px] font-medium text-center leading-tight",
                  isSelected ? "text-white" : "text-white/40",
                )}
              >
                {answer.text}
              </span>
            </div>
          );
        })}
      </div>

      <motion.div
        animate={{ opacity: canContinue ? 1 : 0.3 }}
        transition={{ duration: 0.2 }}
        className="mt-auto pt-4 pb-8 w-full"
      >
        <Button
          onClick={handleConfirm}
          disabled={!canContinue}
          className="w-full"
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
}
