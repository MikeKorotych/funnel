import type { DialogueAnswer, ResultTemplate, ScoringRules } from "./types";

export function accumulateScores(
  currentScores: Record<string, number>,
  answer: DialogueAnswer,
): Record<string, number> {
  if (!answer.score) return currentScores;
  const next = { ...currentScores };
  for (const [dim, value] of Object.entries(answer.score)) {
    next[dim] = (next[dim] ?? 0) + value;
  }
  return next;
}

export function matchResult(
  scores: Record<string, number>,
  rules: ScoringRules,
): ResultTemplate | null {
  // Try templates in order (first match wins — put most specific first)
  for (const template of rules.resultTemplates) {
    const allMatch = template.condition.every((cond) => {
      const val = scores[cond.dimension] ?? 0;
      switch (cond.operator) {
        case ">=": return val >= cond.value;
        case "<=": return val <= cond.value;
        case ">": return val > cond.value;
        case "<": return val < cond.value;
        case "==": return val === cond.value;
      }
    });
    if (allMatch) return template;
  }
  return null;
}

export function normalizeScore(
  value: number,
  min: number,
  max: number,
): number {
  if (max === min) return 0;
  return Math.round(((value - min) / (max - min)) * 100);
}
