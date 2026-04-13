"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useFunnelStore } from "@/stores/funnel.store";
import { useUserStore } from "@/stores/user.store";
import { getTopic } from "@/config/topics";
import { getTheme } from "@/config/themes";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { MobileContainer } from "@/components/layout/mobile-container";
import { Button } from "@/components/ui/button";

function detectPlatform(): "ios" | "android" | "unknown" {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "unknown";
}

export default function ThankYouPage() {
  const { topicId, themeId } = useFunnelStore();
  const { profile } = useUserStore();

  const topic = getTopic(topicId);
  const theme = getTheme(themeId);

  const platform = useMemo(() => detectPlatform(), []);

  if (!topic) return null;

  const { redirectConfig } = topic;

  // Build deep link with user profile data
  const deepLinkParams = new URLSearchParams();
  if (profile) {
    deepLinkParams.set("topic", profile.topicId);
    if (profile.diagnosis) {
      deepLinkParams.set("severity", profile.diagnosis.severity);
      deepLinkParams.set("plan", profile.diagnosis.planName);
    }
    if (profile.creativeId) {
      deepLinkParams.set("creative", profile.creativeId);
    }
  }

  const appStoreUrl =
    platform === "ios"
      ? redirectConfig.iosUrl
      : platform === "android"
        ? redirectConfig.androidUrl
        : redirectConfig.fallbackUrl;

  const universalLink = `${redirectConfig.universalLink}?${deepLinkParams.toString()}`;

  return (
    <ThemeProvider theme={theme}>
      <MobileContainer className="flex flex-col items-center justify-center min-h-dvh gap-8 py-12 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <span className="text-7xl block mb-4">🎉</span>
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome, Warrior!
          </h1>
          <p className="text-text-secondary mt-2 max-w-[300px]">
            Your personal plan is ready. Download the app to start your journey
            to digital freedom.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full flex flex-col gap-3"
        >
          <Button
                       className="w-full text-base"
            onClick={() => window.open(universalLink, "_blank")}
          >
            Open in App
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => window.open(appStoreUrl, "_blank")}
          >
            {platform === "ios"
              ? "Download from App Store"
              : platform === "android"
                ? "Download from Google Play"
                : "Download the App"}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-surface/60 rounded-2xl p-5 border border-primary/20 w-full"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            What happens next:
          </h3>
          <ol className="text-sm text-text-secondary space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              Download and open the app
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              Your personalized plan will be waiting for you
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              Start Day 1 of your digital detox journey
            </li>
          </ol>
        </motion.div>
      </MobileContainer>
    </ThemeProvider>
  );
}
