"use client";

import { useCallback, useMemo } from "react";
import { useQuizStore } from "@/stores/quiz.store";
import {
  getNode,
  getStartNode,
  countQuestionNodes,
  getAnsweredQuestionCount,
} from "@/engine/dialogue-tree";
import { matchResult } from "@/engine/scoring";
import type { DialogueTree, DialogueAnswer, DialogueNode, ScoringRules } from "@/engine/types";

export function useQuizEngine(tree: DialogueTree, scoringRules: ScoringRules) {
  const store = useQuizStore();

  const currentNode: DialogueNode | null = useMemo(() => {
    if (!store.currentNodeId) return null;
    return getNode(tree, store.currentNodeId);
  }, [tree, store.currentNodeId]);

  const progress = useMemo(() => {
    if (store.totalQuestions === 0) return 0;
    const answered = getAnsweredQuestionCount(tree, store.history);
    return Math.round((answered / store.totalQuestions) * 100);
  }, [tree, store.history, store.totalQuestions]);

  const result = useMemo(() => {
    return matchResult(store.scores, scoringRules);
  }, [store.scores, scoringRules]);

  const level = useMemo(() => {
    // Simple level: every 50 XP = 1 level
    return Math.floor(store.xp / 50) + 1;
  }, [store.xp]);

  const initialize = useCallback(() => {
    const startNode = getStartNode(tree);
    const total = countQuestionNodes(tree);
    store.initialize(startNode.id, total);
  }, [tree, store]);

  const selectAnswer = useCallback(
    (answer: DialogueAnswer) => {
      if (!currentNode) return;
      store.selectAnswer(currentNode.id, answer, currentNode.xpReward ?? 0);
    },
    [currentNode, store],
  );

  const selectMultiAnswers = useCallback(
    (answers: DialogueAnswer[]) => {
      if (!currentNode) return;
      store.selectMultiAnswers(currentNode.id, answers, currentNode.xpReward ?? 0);
    },
    [currentNode, store],
  );

  const advanceToNode = useCallback(
    (nodeId: string) => {
      store.advanceToNode(nodeId);
    },
    [store],
  );

  const goBack = useCallback(() => {
    return store.goBack();
  }, [store]);

  return {
    currentNode,
    progress,
    result,
    level,
    xp: store.xp,
    scores: store.scores,
    answers: store.answers,
    history: store.history,
    initialize,
    selectAnswer,
    selectMultiAnswers,
    advanceToNode,
    goBack,
    isInitialized: store.currentNodeId !== null,
  };
}
