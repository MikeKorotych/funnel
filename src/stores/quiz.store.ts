import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DialogueAnswer, NodeId } from "@/engine/types";
import { accumulateScores } from "@/engine/scoring";

type AnswerRecord = {
  answerId: string;
  tags: string[];
  score: Record<string, number>;
  value?: number;
};

type QuizState = {
  currentNodeId: string | null;
  history: NodeId[];
  answers: Record<NodeId, AnswerRecord>;
  scores: Record<string, number>;
  xp: number;
  totalQuestions: number;

  // Actions
  initialize: (startNodeId: string, totalQuestions: number) => void;
  selectAnswer: (nodeId: NodeId, answer: DialogueAnswer, xpReward: number) => void;
  selectMultiAnswers: (nodeId: NodeId, answers: DialogueAnswer[], xpReward: number) => void;
  advanceToNode: (nodeId: NodeId) => void;
  goBack: () => NodeId | null;
  reset: () => void;
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentNodeId: null,
      history: [],
      answers: {},
      scores: {},
      xp: 0,
      totalQuestions: 0,

      initialize: (startNodeId, totalQuestions) =>
        set({
          currentNodeId: startNodeId,
          history: [],
          answers: {},
          scores: {},
          xp: 0,
          totalQuestions,
        }),

      selectAnswer: (nodeId, answer, xpReward) => {
        const state = get();
        const newScores = accumulateScores(state.scores, answer);
        set({
          answers: {
            ...state.answers,
            [nodeId]: {
              answerId: answer.id,
              tags: answer.tags ?? [],
              score: answer.score ?? {},
              value: answer.value,
            },
          },
          scores: newScores,
          xp: state.xp + xpReward,
          history: [...state.history, nodeId],
          currentNodeId: answer.nextNodeId,
        });
      },

      selectMultiAnswers: (nodeId, answers, xpReward) => {
        const state = get();
        // Accumulate scores from all selected answers
        const newScores = { ...state.scores };
        const allTags: string[] = [];
        const combinedScore: Record<string, number> = {};
        for (const answer of answers) {
          if (answer.score) {
            for (const [dim, value] of Object.entries(answer.score)) {
              newScores[dim] = (newScores[dim] ?? 0) + value;
              combinedScore[dim] = (combinedScore[dim] ?? 0) + value;
            }
          }
          if (answer.tags) allTags.push(...answer.tags);
        }
        // Use the first answer's nextNodeId for navigation
        const nextNodeId = answers[0]?.nextNodeId ?? state.currentNodeId;
        set({
          answers: {
            ...state.answers,
            [nodeId]: {
              answerId: answers.map((a) => a.id).join(","),
              tags: allTags,
              score: combinedScore,
            },
          },
          scores: newScores,
          xp: state.xp + xpReward,
          history: [...state.history, nodeId],
          currentNodeId: nextNodeId,
        });
      },

      advanceToNode: (nodeId) => {
        const state = get();
        set({
          history: [...state.history, state.currentNodeId!],
          currentNodeId: nodeId,
        });
      },

      goBack: () => {
        const state = get();
        if (state.history.length === 0) return null;
        const newHistory = [...state.history];
        const prevNodeId = newHistory.pop()!;
        // Remove the answer for the node we're going back from
        const newAnswers = { ...state.answers };
        const removedAnswer = newAnswers[prevNodeId];
        delete newAnswers[prevNodeId];
        // Recalculate scores by removing the undone answer's contribution
        const newScores = { ...state.scores };
        if (removedAnswer?.score) {
          for (const [dim, value] of Object.entries(removedAnswer.score)) {
            newScores[dim] = (newScores[dim] ?? 0) - value;
          }
        }
        // Recalculate XP (approximate — just subtract the standard reward)
        set({
          currentNodeId: prevNodeId,
          history: newHistory,
          answers: newAnswers,
          scores: newScores,
        });
        return prevNodeId;
      },

      reset: () =>
        set({
          currentNodeId: null,
          history: [],
          answers: {},
          scores: {},
          xp: 0,
          totalQuestions: 0,
        }),
    }),
    {
      name: "quiz-state",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? sessionStorage : ({
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }),
      ),
    },
  ),
);
