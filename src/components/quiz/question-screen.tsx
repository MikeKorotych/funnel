'use client';

import { useState, useEffect } from 'react';
import type { DialogueNode, DialogueAnswer } from '@/engine/types';
import { DialogueBubble } from './dialogue-bubble';
import { AnswerGrid } from './answer-grid';
import { ScaleInput } from './scale-input';
import { MultiSelectGrid } from './multi-select-grid';
import { SliderInput } from './slider-input';
import { LoaderScreen } from './loader-screen';
import { ComparisonSlide } from './comparison-slide';
import { GuideCharacter } from './guide-character';
import { AnimatedNotifications } from '@/components/effects/animated-notifications';
import { RainEffect } from '@/components/effects/rain-effect';
import { TypingAnimation } from '@/components/effects/typing-animation';
import { FuzzyText } from '@/components/effects/fuzzy-text';
import { Button } from '@/components/ui/button';
import { SmoothHeightContainer } from '@/components/ui/smooth-height';
import { motion, AnimatePresence } from 'framer-motion';

type WelcomePhase = 'notifications' | 'enough' | 'fading' | 'main';

export function QuestionScreen({
  node,
  onAnswer,
  onMultiAnswer,
  onAdvance,
  onContinue,
}: {
  node: DialogueNode;
  onAnswer: (answer: DialogueAnswer) => void;
  onMultiAnswer: (answers: DialogueAnswer[]) => void;
  onAdvance: () => void;
  onContinue: () => void;
}) {
  const [welcomePhase, setWelcomePhase] =
    useState<WelcomePhase>('notifications');

  // Loader
  if (node.type === 'loader' && node.loaderSteps) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <GuideCharacter mood="dramatic" size="md" />
        <LoaderScreen steps={node.loaderSteps} onComplete={onAdvance} />
      </div>
    );
  }

  // Comparison
  if (node.id === 'comparison') {
    return (
      <div className="flex flex-col justify-between flex-1 py-4">
        <ComparisonSlide onContinue={onAdvance} />
      </div>
    );
  }

  // Welcome
  if (node.type === 'break' && node.id === 'welcome') {
    return (
      <div className="flex flex-col justify-between flex-1 py-4">
        <div className="flex-1 flex flex-col items-center justify-center">
          {welcomePhase === 'notifications' && (
            <RainEffect opacity={0.4} speed={6} />
          )}

          <AnimatePresence mode="wait">
            {welcomePhase === 'notifications' && (
              <motion.div key="notifs" exit={{ opacity: 0 }} className="w-full">
                <AnimatedNotifications
                  intervalMs={1200}
                  dissolveAfterMs={6000}
                  onComplete={() => setWelcomePhase('enough')}
                />
              </motion.div>
            )}

            {welcomePhase === 'enough' && (
              <motion.div
                key="enough"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: 'blur(12px)', scale: 1.1 }}
                transition={{ duration: 0.8 }}
                className="text-center px-4"
              >
                <FuzzyText
                  text="Enough. It's time to take control."
                  duration={2500}
                  className="text-2xl font-bold text-text-primary"
                  onComplete={() =>
                    setTimeout(() => setWelcomePhase('fading'), 1200)
                  }
                />
              </motion.div>
            )}

            {welcomePhase === 'fading' && (
              <motion.div
                key="bridge"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                onAnimationComplete={() => setWelcomePhase('main')}
              />
            )}

            {welcomePhase === 'main' && (
              <motion.div
                key="main"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center gap-5 w-full"
              >
                <GuideCharacter mood="neutral" size="lg" />
                <SmoothHeightContainer className="w-full bg-[#171717] rounded-2xl border border-[#303030]" innerClassName="p-5">
                  <TypingAnimation
                    text={node.scene.dialogue}
                    speed={50}
                    className="text-lg font-medium text-text-primary leading-relaxed"
                  />
                  {node.scene.subtext && (
                    <p className="mt-3 text-sm text-text-secondary">
                      {node.scene.subtext}
                    </p>
                  )}
                </SmoothHeightContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Button always at bottom */}
        {welcomePhase === 'main' && (
          <div className="pt-4 pb-8">
            <Button onClick={onAdvance} className="w-full">
              Begin Quest
            </Button>
          </div>
        )}
      </div>
    );
  }

  const answerType = node.answerType ?? 'single';

  // Standard question/break/result layout
  return (
    <div className="flex flex-col flex-1 py-4">
      {/* Content */}
      <div className="flex flex-col gap-5 flex-1">
        {(node.type === 'break' || node.type === 'result') && (
          <div className="flex justify-center">
            <GuideCharacter mood={node.scene.mood ?? 'neutral'} size="lg" />
          </div>
        )}

        <DialogueBubble
          text={node.scene.dialogue}
          subtext={node.scene.subtext}
        />

        {node.type === 'question' && node.answers && (
          <>
            {answerType === 'single' && (
              <AnswerGrid answers={node.answers} onSelect={onAnswer} />
            )}
            {answerType === 'scale' && node.scaleConfig && (
              <ScaleInput
                config={node.scaleConfig}
                answers={node.answers}
                onSelect={onAnswer}
              />
            )}
            {answerType === 'multi' && node.multiSelectConfig && (
              <MultiSelectGrid
                answers={node.answers}
                config={node.multiSelectConfig}
                onConfirm={onMultiAnswer}
              />
            )}
            {answerType === 'slider' && node.sliderConfig && (
              <SliderInput
                config={node.sliderConfig}
                answers={node.answers}
                onSelect={onAnswer}
              />
            )}
          </>
        )}
      </div>

      {/* Button at bottom — for break/result types */}
      {node.type === 'break' && (
        <div className="mt-auto pt-4 pb-8">
          <Button onClick={onAdvance} className="w-full">
            Continue
          </Button>
        </div>
      )}
      {node.type === 'result' && (
        <div className="mt-auto pt-4 pb-8">
          <Button onClick={onContinue} className="w-full">
            Reveal My Results
          </Button>
        </div>
      )}
    </div>
  );
}
