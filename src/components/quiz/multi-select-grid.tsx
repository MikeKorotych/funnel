"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import type { DialogueAnswer, MultiSelectConfig } from "@/engine/types";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/* ── Donut-wheel geometry ── */
const OUTER_R = 146;
const INNER_R = 36;
const GAP_DEG = 3;
const VIEW = 320;
const HALF = VIEW / 2;
const LABEL_R = (OUTER_R + INNER_R) / 2;
const LABEL_W = 80;
const LABEL_H = 56;

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

/** Label centre relative to donut centre (0,0) — used inside the SVG <g>. */
function labelPos(index: number, total: number) {
  const span = 360 / total;
  const mid = ((index * span - 90 + span / 2) * Math.PI) / 180;
  return { x: Math.cos(mid) * LABEL_R, y: Math.sin(mid) * LABEL_R };
}

/* ── Colour helpers ── */
function segmentFill(selected: boolean, hovered: boolean) {
  if (selected) return "rgba(255,255,255,0.08)";
  if (hovered) return "rgba(255,255,255,0.04)";
  return "#141414";
}

function segmentStroke(selected: boolean, hovered: boolean) {
  if (selected) return "rgba(255,255,255,0.28)";
  if (hovered) return "rgba(255,255,255,0.14)";
  return "#262626";
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-4 w-full flex-1"
    >
      <p className="text-xs text-text-muted text-center">
        Select up to {config.maxSelect}
      </p>

      {/* ── Donut wheel — everything lives inside a single SVG ── */}
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="mx-auto w-full"
        style={{ maxWidth: VIEW, maxHeight: VIEW }}
      >
        <defs>
          <filter
            id="seg-glow"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
            <feFlood floodColor="rgba(255,255,255,0.12)" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${HALF},${HALF})`}>
          {/* Ambient centre glow */}
          <circle
            r={90}
            fill="url(#centre-glow)"
            className="pointer-events-none"
          />
          <defs>
            <radialGradient id="centre-glow">
              <stop offset="0%" stopColor="rgba(255,255,255,0.035)" />
              <stop offset="70%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Outer ring — draws in */}
          <motion.circle
            r={OUTER_R + 1}
            fill="none"
            stroke="#262626"
            strokeWidth={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {/* Inner ring — draws in */}
          <motion.circle
            r={INNER_R - 1}
            fill="none"
            stroke="#262626"
            strokeWidth={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.0, ease: "easeInOut", delay: 0.15 }}
          />

          {/* Donut segments */}
          {answers.map((answer, i) => {
            const isSelected = selectedIds.has(answer.id);
            const isHovered = hoveredId === answer.id;

            return (
              <motion.path
                key={answer.id}
                d={segments[i].path}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.35 + i * 0.09,
                  duration: 0.55,
                  ease: "easeOut",
                }}
                className="cursor-pointer outline-none"
                filter={isSelected ? "url(#seg-glow)" : undefined}
                style={{
                  fill: segmentFill(isSelected, isHovered),
                  stroke: segmentStroke(isSelected, isHovered),
                  strokeWidth: isSelected ? 1.5 : 1,
                  transition:
                    "fill 0.25s ease, stroke 0.25s ease, stroke-width 0.2s ease, filter 0.3s ease",
                }}
                onMouseEnter={() => setHoveredId(answer.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => toggle(answer.id)}
              />
            );
          })}

          {/* Centre counter */}
          <motion.text
            key={selectedIds.size}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            textAnchor="middle"
            dominantBaseline="central"
            className="pointer-events-none select-none"
            style={{
              fill: `rgba(255,255,255,${0.18 + selectedIds.size * 0.16})`,
              fontSize: 13,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {selectedIds.size}/{config.maxSelect}
          </motion.text>

          {/* Labels — foreignObject inside same <g>, guaranteed alignment */}
          {answers.map((answer, i) => {
            const { x, y } = segments[i].label;
            const isSelected = selectedIds.has(answer.id);
            const isHovered = hoveredId === answer.id;

            return (
              <motion.foreignObject
                key={`label-${answer.id}`}
                x={x - LABEL_W / 2}
                y={y - LABEL_H / 2}
                width={LABEL_W}
                height={LABEL_H}
                className="pointer-events-none overflow-visible"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.55 + i * 0.09,
                  duration: 0.45,
                }}
              >
                <div className="flex flex-col items-center justify-center gap-1 h-full w-full">
                  {answer.icon && (
                    <Icon
                      name={answer.icon}
                      size={22}
                      className={cn(
                        "transition-all duration-200",
                        isSelected
                          ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]"
                          : isHovered
                            ? "text-white/60"
                            : "text-white/30",
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "text-[10px] font-medium text-center leading-tight transition-colors duration-200",
                      isSelected
                        ? "text-white"
                        : isHovered
                          ? "text-white/55"
                          : "text-white/30",
                    )}
                  >
                    {answer.text}
                  </span>
                </div>
              </motion.foreignObject>
            );
          })}
        </g>
      </svg>

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
