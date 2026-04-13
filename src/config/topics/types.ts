import type { DialogueTree, ScoringRules } from "@/engine/types";

export type SaleTestimonial = {
  name: string;
  text: string;
  rating: number;
};

export type SalePricingTier = {
  id: string;
  label: string;
  price: string;
  period: string;
  originalPrice?: string;
  badge?: string;
  highlighted?: boolean;
};

export type SaleConfig = {
  headline: string;
  subheadline: string;
  features: { icon: string; text: string }[];
  testimonials: SaleTestimonial[];
  pricing: SalePricingTier[];
  guarantee: string;
  urgencyText?: string;
};

export type RedirectConfig = {
  app: "wisey" | "braintrainer";
  iosUrl: string;
  androidUrl: string;
  universalLink: string;
  fallbackUrl: string;
};

export type TopicConfig = {
  id: string;
  slug: string;
  name: string;
  dialogueTree: DialogueTree;
  scoringRules: ScoringRules;
  saleConfig: SaleConfig;
  redirectConfig: RedirectConfig;
};
