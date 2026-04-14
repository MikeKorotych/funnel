'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFunnelStore } from '@/stores/funnel.store';
import { useQuizEngine } from '@/hooks/use-quiz-engine';
import { getTopic } from '@/config/topics';
import { getTheme } from '@/config/themes';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { MobileContainer } from '@/components/layout/mobile-container';
import { FunnelHeader } from '@/components/layout/funnel-header';
import { QuestionScreen } from '@/components/quiz/question-screen';
import { SceneTransition } from '@/components/quiz/scene-transition';
import { XpGainToast } from '@/components/quiz/xp-gain-toast';
import { LevelUpOverlay } from '@/components/quiz/level-up-overlay';
import { EyeOpenReveal } from '@/components/effects/eye-open-reveal';
import { CircleReveal } from '@/components/effects/circle-reveal';
import { WavyBackground } from '@/components/effects/wavy-background';
import { TopographyBackground } from '@/components/effects/topography-background';
import { RippleBackground } from '@/components/effects/ripple-background';
import { GradientAnimationBackground } from '@/components/effects/gradient-animation-background';
import type { DialogueAnswer } from '@/engine/types';

type BgType = 'wavy' | 'topography' | 'ripple' | 'gradient' | 'none';
type RevealType = 'circle' | 'eye' | 'none';

const BG_LABELS: Record<BgType, string> = {
  wavy: 'Waves',
  topography: 'Topo',
  ripple: 'Ripple',
  gradient: 'Gradient',
  none: 'None',
};

export default function QuizPage() {
  const router = useRouter();
  const { topicId, themeId, setStep } = useFunnelStore();

  const topic = getTopic(topicId);
  const theme = getTheme(themeId);

  const {
    currentNode,
    progress,
    level,
    xp,
    history,
    initialize,
    selectAnswer,
    selectMultiAnswers,
    advanceToNode,
    goBack,
    isInitialized,
  } = useQuizEngine(
    topic?.dialogueTree ?? {
      id: '',
      topicId: '',
      version: '',
      startNodeId: '',
      nodes: {},
    },
    topic?.scoringRules ?? { dimensions: [], resultTemplates: [] },
  );

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(1);
  const [lastXpGain, setLastXpGain] = useState(0);
  const [showReveal, setShowReveal] = useState(true);
  const [revealType, setRevealType] = useState<RevealType>('circle');
  const [bgType, setBgType] = useState<BgType>('topography');
  const [showDevPanel, setShowDevPanel] = useState(false);

  useEffect(() => {
    if (!isInitialized && topic) initialize();
  }, [isInitialized, topic, initialize]);

  // Detect level-up via derived state (React 19 pattern)
  if (level > prevLevel) {
    setPrevLevel(level);
    setShowLevelUp(true);
  }

  const handleAnswer = useCallback(
    (answer: DialogueAnswer) => {
      if (!currentNode) return;
      setLastXpGain(currentNode.xpReward ?? 0);
      selectAnswer(answer);
    },
    [currentNode, selectAnswer],
  );

  const handleMultiAnswer = useCallback(
    (answers: DialogueAnswer[]) => {
      if (!currentNode) return;
      setLastXpGain(currentNode.xpReward ?? 0);
      selectMultiAnswers(answers);
    },
    [currentNode, selectMultiAnswers],
  );

  const handleAdvance = useCallback(() => {
    if (!currentNode?.nextNodeId) return;
    if (currentNode.xpReward) setLastXpGain(currentNode.xpReward);
    advanceToNode(currentNode.nextNodeId);
  }, [currentNode, advanceToNode]);

  const handleContinue = useCallback(() => {
    setStep('results');
    router.push('/results');
  }, [setStep, router]);

  const handleBack = useCallback(() => {
    if (history.length > 0) goBack();
  }, [history, goBack]);

  if (!topic || !currentNode) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 rounded-full border-2 border-[#262626] border-t-white animate-spin" />
      </div>
    );
  }

  // Quiz content (same for all backgrounds)
  const quizContent = (
    <MobileContainer className="flex flex-col min-h-dvh">
      <FunnelHeader
        progress={progress}
        level={level}
        xp={xp}
        onBack={history.length > 0 ? handleBack : undefined}
      />

      <main className="flex-1 flex flex-col">
        <SceneTransition nodeId={currentNode.id}>
          <QuestionScreen
            node={currentNode}
            onAnswer={handleAnswer}
            onMultiAnswer={handleMultiAnswer}
            onAdvance={handleAdvance}
            onContinue={handleContinue}
            notificationDelay={revealType === 'eye' ? 2000 : 0}
          />
        </SceneTransition>
      </main>

      <XpGainToast xp={lastXpGain} />

      {showLevelUp && (
        <LevelUpOverlay level={level} onDismiss={() => setShowLevelUp(false)} />
      )}
    </MobileContainer>
  );

  // Background wrapper based on selected type
  const renderWithBackground = () => {
    switch (bgType) {
      case 'wavy':
        return (
          <WavyBackground
            blur={8}
            speed="fast"
            waveOpacity={0.7}
            waveWidth={50}
          >
            {quizContent}
          </WavyBackground>
        );
      case 'topography':
        return <TopographyBackground>{quizContent}</TopographyBackground>;
      case 'ripple':
        return <RippleBackground>{quizContent}</RippleBackground>;
      case 'gradient':
        return (
          <GradientAnimationBackground>
            {quizContent}
          </GradientAnimationBackground>
        );
      case 'none':
        return <div className="min-h-dvh bg-[#0a0a0a]">{quizContent}</div>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {showReveal && revealType === 'circle' && (
        <CircleReveal duration={1.5} onComplete={() => setShowReveal(false)} />
      )}
      {showReveal && revealType === 'eye' && (
        <EyeOpenReveal onComplete={() => setShowReveal(false)} />
      )}

      {renderWithBackground()}

      {/* Dev mode: background switcher (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <button
            onClick={() => setShowDevPanel((p) => !p)}
            className="fixed top-3 right-3 z-[999] w-8 h-8 rounded-full bg-white/10 text-white/50 text-xs flex items-center justify-center hover:bg-white/20"
          >
            DEV
          </button>

          {showDevPanel && (
            <div className="fixed top-12 right-3 z-[999] bg-[#171717] border border-[#303030] rounded-lg p-2 flex flex-col gap-1 min-w-[120px]">
              <p className="text-[10px] text-white/30 px-2 pt-1">Background</p>
              {(Object.keys(BG_LABELS) as BgType[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setBgType(key)}
                  className={`text-xs px-3 py-1.5 rounded text-left ${
                    bgType === key
                      ? 'bg-white text-black'
                      : 'text-white/60 hover:bg-white/10'
                  }`}
                >
                  {BG_LABELS[key]}
                </button>
              ))}

              <div className="h-px bg-[#303030] my-1" />
              <p className="text-[10px] text-white/30 px-2">Reveal</p>
              {(['circle', 'eye', 'none'] as RevealType[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setRevealType(key);
                    setShowReveal(true);
                  }}
                  className={`text-xs px-3 py-1.5 rounded text-left capitalize ${
                    revealType === key
                      ? 'bg-white text-black'
                      : 'text-white/60 hover:bg-white/10'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </ThemeProvider>
  );
}
