"use client";

import type { DialogueAnswer } from "@/engine/types";
import { AnswerOption } from "./answer-option";

export function AnswerGrid({
  answers,
  onSelect,
}: {
  answers: DialogueAnswer[];
  onSelect: (answer: DialogueAnswer) => void;
}) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {answers.map((answer, index) => (
        <AnswerOption
          key={answer.id}
          text={answer.text}
          emoji={answer.emoji}
          icon={answer.icon}
          index={index}
          onSelect={() => onSelect(answer)}
        />
      ))}
    </div>
  );
}
