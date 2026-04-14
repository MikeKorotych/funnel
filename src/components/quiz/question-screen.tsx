'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DialogueNode, DialogueAnswer } from '@/engine/types';
import { DialogueBubble } from './dialogue-bubble';
import { AnswerGrid } from './answer-grid';
import { ScaleInput } from './scale-input';
import { MultiSelectGrid } from './multi-select-grid';
import { SliderInput } from './slider-input';
import { LoaderScreen } from './loader-screen';
import { ComparisonSlide } from './comparison-slide';
import { GuideCharacter } from './guide-character';
import { ScreenTimeReflection } from './screen-time-reflection';
import { AnimatedNotifications } from '@/components/effects/animated-notifications';
import { RainEffect } from '@/components/effects/rain-effect';
import { SequentialTyping } from '@/components/effects/sequential-typing';
// FuzzyText available if needed
// import { FuzzyText } from '@/components/effects/fuzzy-text';
import { Button } from '@/components/ui/button';
import { SmoothHeightContainer } from '@/components/ui/smooth-height';
import { motion, AnimatePresence } from 'framer-motion';

type WelcomePhase =
  | 'waiting'
  | 'notifications'
  | 'enough'
  | 'takecontrol'
  | 'fading'
  | 'main';

const TAKECONTROL_EXIT_MS = 500;
const BRIDGE_FADE_MS = 200;
const WELCOME_SLIDER_DELAY_MS = 1000;

const WELCOME_TYPING_STEPS: Parameters<typeof SequentialTyping>[0]['steps'] = [
  { type: 'type', text: 'Welcome, traveler.', speed: 45 },
  { type: 'pause', ms: 450 },
  { type: 'delete', speed: 18 },
  { type: 'type', text: 'Digital freedom is here.', speed: 45 },
  { type: 'pause', ms: 550 },
  { type: 'delete', speed: 18 },
  {
    type: 'type',
    text: 'First, tell us about yourself so we can help you find a way out.',
    speed: 35,
  },
  { type: 'newline' },
  { type: 'pause', ms: 300 },
  { type: 'type', text: 'Answer honestly.', speed: 50 },
  { type: 'pause', ms: 1000 },
  { type: 'delete', speed: 14 },
];

export function QuestionScreen({
  node,
  onAnswer,
  onMultiAnswer,
  onAdvance,
  onContinue,
  screenTimeHoursPerDay = 3,
  notificationDelay = 0,
  phoneMode = false,
}: {
  node: DialogueNode;
  onAnswer: (answer: DialogueAnswer) => void;
  onMultiAnswer: (answers: DialogueAnswer[]) => void;
  onAdvance: () => void;
  onContinue: () => void;
  screenTimeHoursPerDay?: number;
  notificationDelay?: number;
  phoneMode?: boolean;
}) {
  const [welcomePhase, setWelcomePhase] = useState<WelcomePhase>(
    notificationDelay > 0 ? 'waiting' : 'notifications',
  );
  const [welcomeMainStage, setWelcomeMainStage] = useState<
    'intro' | 'question'
  >('intro');
  const [welcomeQuestionComplete, setWelcomeQuestionComplete] = useState(false);
  const [showWelcomeSlider, setShowWelcomeSlider] = useState(false);
  const handleWelcomeIntroComplete = useCallback(() => {
    setWelcomeMainStage('question');
    setWelcomeQuestionComplete(false);
    setShowWelcomeSlider(false);
  }, []);
  const handleWelcomeQuestionComplete = useCallback(
    () => setWelcomeQuestionComplete(true),
    [],
  );

  // Delay before showing notifications (for eye reveal)
  useEffect(() => {
    if (welcomePhase !== 'waiting') return;
    const timer = setTimeout(
      () => setWelcomePhase('notifications'),
      notificationDelay,
    );
    return () => clearTimeout(timer);
  }, [welcomePhase, notificationDelay]);

  useEffect(() => {
    if (welcomePhase !== 'enough') return;
    const timer = setTimeout(() => setWelcomePhase('takecontrol'), 1550);
    return () => clearTimeout(timer);
  }, [welcomePhase]);

  useEffect(() => {
    if (welcomePhase !== 'takecontrol') return;
    const timer = setTimeout(() => setWelcomePhase('fading'), 2000);
    return () => clearTimeout(timer);
  }, [welcomePhase]);

  useEffect(() => {
    if (welcomePhase !== 'fading') return;
    const timer = setTimeout(
      () => setWelcomePhase('main'),
      TAKECONTROL_EXIT_MS + BRIDGE_FADE_MS,
    );
    return () => clearTimeout(timer);
  }, [welcomePhase]);

  useEffect(() => {
    if (welcomeMainStage !== 'question' || !welcomeQuestionComplete) return;
    const timer = setTimeout(
      () => setShowWelcomeSlider(true),
      WELCOME_SLIDER_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [welcomeMainStage, welcomeQuestionComplete]);

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
    return <ComparisonSlide onContinue={onAdvance} />;
  }

  if (node.id === 'screen-time-reflection') {
    return (
      <ScreenTimeReflection
        dailyHours={screenTimeHoursPerDay}
        onComplete={onAdvance}
      />
    );
  }

  // Welcome
  if (node.id === 'welcome') {
    return (
      <div className="flex flex-col flex-1 py-4">
        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          {(welcomePhase === 'waiting' || welcomePhase === 'notifications') && (
            <RainEffect opacity={0.4} speed={6} />
          )}

          <AnimatePresence mode="wait">
            {(welcomePhase === 'waiting' || welcomePhase === 'notifications') &&
              (phoneMode ? (
                /* Phone mode — notifications on phone screen */
                <motion.div
                  key="phone-notifs"
                  exit={{ opacity: 0, y: 40, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex flex-col items-center"
                  style={{ perspective: '800px' }}
                >
                  <motion.div
                    initial={{ y: 300, rotateX: 60, opacity: 0 }}
                    animate={{ y: 0, rotateX: 0, opacity: 1 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-[480px] max-w-[80vw]"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/iPhone 14 Pro.png"
                      alt=""
                      className="w-full h-auto relative z-0"
                    />
                    <div className="absolute inset-[8%] top-[10%] bottom-[25%] z-10 flex flex-col justify-end overflow-hidden">
                      {welcomePhase === 'notifications' && (
                        <AnimatedNotifications
                          intervalMs={1200}
                          dissolveAfterMs={6000}
                          onComplete={() => setWelcomePhase('enough')}
                        />
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                /* Default mode — plain notifications */
                <motion.div
                  key="plain-notifs"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  {welcomePhase === 'notifications' && (
                    <AnimatedNotifications
                      intervalMs={1200}
                      dissolveAfterMs={6000}
                      onComplete={() => setWelcomePhase('enough')}
                    />
                  )}
                </motion.div>
              ))}

            {welcomePhase === 'enough' && (
              <motion.div
                key="enough"
                initial={{ opacity: 0, scale: 0.7, filter: 'blur(12px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.3, filter: 'blur(8px)' }}
                transition={{ duration: 0.35 }}
                className="text-center px-4"
              >
                <span className="text-2xl font-bold text-text-primary">
                  Enough.
                </span>
              </motion.div>
            )}

            {welcomePhase === 'takecontrol' && (
              <motion.div
                key="takecontrol"
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(12px)', scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="text-center px-4"
              >
                <span className="text-2xl font-bold text-text-primary">
                  It&apos;s time to take control.
                </span>
              </motion.div>
            )}

            {welcomePhase === 'fading' && (
              <motion.div
                key="bridge"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>

          {/* Main content — outside AnimatePresence to prevent remounting */}
          {welcomePhase === 'main' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-5 w-full"
            >
              <AnimatePresence mode="wait">
                {welcomeMainStage === 'intro' ? (
                  <motion.div
                    key="welcome-intro"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                    transition={{ duration: 0.45 }}
                    className="w-full"
                  >
                    <SmoothHeightContainer
                      className="w-full bg-[#171717] rounded-2xl border border-[#303030]"
                      innerClassName="p-5"
                    >
                      <SequentialTyping
                        steps={WELCOME_TYPING_STEPS}
                        onComplete={handleWelcomeIntroComplete}
                      />
                    </SmoothHeightContainer>
                  </motion.div>
                ) : (
                  <motion.div
                    key="welcome-question"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45 }}
                    className="w-full"
                  >
                    <SmoothHeightContainer
                      className="w-full"
                      innerClassName="flex flex-col gap-5"
                    >
                      <DialogueBubble
                        text={node.scene.dialogue}
                        subtext={node.scene.subtext}
                        onComplete={handleWelcomeQuestionComplete}
                      />

                      <AnimatePresence initial={false}>
                        {showWelcomeSlider &&
                          node.answers &&
                          node.sliderConfig && (
                            <motion.div
                              key="welcome-slider"
                              initial={{
                                opacity: 0,
                                y: 18,
                                filter: 'blur(8px)',
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                filter: 'blur(0px)',
                              }}
                              exit={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                              transition={{ duration: 0.45, ease: 'easeOut' }}
                              className="overflow-hidden"
                            >
                              <SliderInput
                                config={node.sliderConfig}
                                answers={node.answers}
                                onSelect={onAnswer}
                                autoSubmit
                              />
                            </motion.div>
                          )}
                      </AnimatePresence>
                    </SmoothHeightContainer>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
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
