"use client";

import { useRouter } from "next/navigation";
import { useFunnelStore } from "@/stores/funnel.store";
import { useQuizStore } from "@/stores/quiz.store";
import { useUserStore } from "@/stores/user.store";
import { getTopic } from "@/config/topics";
import { getTheme } from "@/config/themes";
import { matchResult } from "@/engine/scoring";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { MobileContainer } from "@/components/layout/mobile-container";
import { DiagnosisCard } from "@/components/results/diagnosis-card";
import { GuideCharacter } from "@/components/quiz/guide-character";
import { LightRays } from "@/components/effects/light-rays";
import { NumberTicker } from "@/components/effects/number-ticker";
import { Button } from "@/components/ui/button";
import { WandSparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ResultsPage() {
  const router = useRouter();
  const { topicId, themeId, sessionId, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, creativeId, setStep } =
    useFunnelStore();
  const { scores, answers } = useQuizStore();
  const { setProfile } = useUserStore();

  const topic = getTopic(topicId);
  const theme = getTheme(themeId);

  if (!topic) return null;

  const result = matchResult(scores, topic.scoringRules);

  const handleContinue = () => {
    const answersSimple: Record<string, string> = {};
    for (const [nodeId, record] of Object.entries(answers)) {
      answersSimple[nodeId] = record.answerId;
    }

    setProfile({
      sessionId,
      topicId,
      creativeId,
      utmParams: {
        ...(utmSource && { utm_source: utmSource }),
        ...(utmMedium && { utm_medium: utmMedium }),
        ...(utmCampaign && { utm_campaign: utmCampaign }),
        ...(utmContent && { utm_content: utmContent }),
        ...(utmTerm && { utm_term: utmTerm }),
      },
      answers: answersSimple,
      scores,
      diagnosis: result
        ? { severity: result.severity, planName: result.planName, title: result.title }
        : null,
      completedAt: Date.now(),
    });

    setStep("sale");
    router.push("/sale");
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Subtle light rays — "mind clearing" */}
      <LightRays color="#ffffff" count={5} />

      <MobileContainer className="flex flex-col pt-12 pb-4 gap-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <GuideCharacter mood="encouraging" size="lg" />
          <h1 className="text-2xl font-bold text-text-primary mt-2">
            Your Digital Profile
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Based on your answers, here&apos;s what we found
          </p>
        </motion.div>

        {result && (
          <DiagnosisCard
            result={result}
            scores={scores}
            dimensions={topic.scoringRules.dimensions}
          />
        )}

        {/* Shocking stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[#171717] rounded-2xl p-6 border border-[#303030] text-center"
        >
          <p className="text-sm text-text-secondary mb-2">
            At your current rate, you spend approximately
          </p>
          <div className="flex items-baseline justify-center gap-1">
            <NumberTicker
              value={Math.round(((scores.addiction_severity ?? 5) / 24) * 365 * 8)}
              className="text-4xl font-bold text-[#c9a96e]"
            />
            <span className="text-lg text-text-secondary">hours/year</span>
          </div>
          <p className="text-xs text-text-muted mt-2">
            on your phone. That&apos;s like losing months of your life to a screen.
          </p>
        </motion.div>

        {/* Plan preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#171717] rounded-2xl p-5 border border-[#303030]"
        >
          <div className="flex items-center gap-2 mb-3">
            <WandSparkles size={18} className="text-text-secondary" />
            <h3 className="text-base font-semibold text-text-primary">
              Your Recommended Plan
            </h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            We&apos;ve prepared a personalized day-by-day program tailored to your
            specific patterns and goals.
          </p>
        </motion.div>

        <div className="pb-8">
          <Button onClick={handleContinue} className="w-full text-base">
            Get My Personal Plan
          </Button>
        </div>
      </MobileContainer>
    </ThemeProvider>
  );
}
