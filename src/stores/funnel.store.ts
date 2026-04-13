import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type FunnelStep = "quiz" | "results" | "sale" | "thank-you";

type FunnelState = {
  // UTM / Creative tracking
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  creativeId: string | null;

  // Funnel config
  currentStep: FunnelStep;
  topicId: string;
  themeId: string;
  variantId: string | null;

  // Session
  sessionId: string;
  startedAt: number;

  // Actions
  setUtmParams: (params: Record<string, string>) => void;
  setStep: (step: FunnelStep) => void;
  setConfig: (config: { topicId?: string; themeId?: string; variantId?: string }) => void;
};

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useFunnelStore = create<FunnelState>()(
  persist(
    (set) => ({
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
      creativeId: null,
      currentStep: "quiz",
      topicId: "phone-addiction",
      themeId: "rpg-gamified",
      variantId: null,
      sessionId: generateSessionId(),
      startedAt: Date.now(),

      setUtmParams: (params) =>
        set({
          utmSource: params.utm_source ?? null,
          utmMedium: params.utm_medium ?? null,
          utmCampaign: params.utm_campaign ?? null,
          utmContent: params.utm_content ?? null,
          utmTerm: params.utm_term ?? null,
          creativeId: params.creative_id ?? null,
        }),

      setStep: (step) => set({ currentStep: step }),

      setConfig: (config) =>
        set((state) => ({
          topicId: config.topicId ?? state.topicId,
          themeId: config.themeId ?? state.themeId,
          variantId: config.variantId ?? state.variantId,
        })),
    }),
    {
      name: "funnel-state",
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
