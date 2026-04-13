"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, ShieldCheck } from "lucide-react";
import { useFunnelStore } from "@/stores/funnel.store";
import { getTopic } from "@/config/topics";
import { getTheme } from "@/config/themes";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { MobileContainer } from "@/components/layout/mobile-container";
import { PricingCard } from "@/components/sale/pricing-card";
import { CountdownTimer } from "@/components/sale/countdown-timer";
import { InfiniteScrollCards } from "@/components/effects/infinite-scroll-cards";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function SalePage() {
  const router = useRouter();
  const { topicId, themeId, setStep } = useFunnelStore();
  const [selectedTier, setSelectedTier] = useState("annual");

  const topic = getTopic(topicId);
  const theme = getTheme(themeId);

  if (!topic) return null;

  const { saleConfig } = topic;

  const handlePurchase = () => {
    setStep("thank-you");
    router.push("/thank-you");
  };

  return (
    <ThemeProvider theme={theme}>
      <MobileContainer className="flex flex-col pt-12 pb-4 gap-6">
        {saleConfig.urgencyText && (
          <CountdownTimer minutes={15} text={saleConfig.urgencyText} />
        )}

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-text-primary">
            {saleConfig.headline}
          </h1>
          <p className="text-sm text-text-secondary mt-2">
            {saleConfig.subheadline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3.5"
        >
          {saleConfig.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Icon name={feature.icon} size={16} className="text-text-secondary" />
              </div>
              <span className="text-text-secondary">{feature.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="-mx-5">
          <InfiniteScrollCards
            speed="slow"
            pauseOnHover
            items={saleConfig.testimonials.map((testimonial, i) => ({
              id: `t-${i}`,
              content: (
                <div className="bg-[#171717] rounded-xl p-4 border border-[#303030] h-full">
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {Array.from({ length: testimonial.rating }, (_, j) => (
                      <Star key={j} size={12} className="text-[#c9a96e] fill-[#c9a96e]" />
                    ))}
                  </div>
                  <p className="text-sm text-text-secondary italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <p className="text-xs text-text-muted mt-1.5">
                    — {testimonial.name}
                  </p>
                </div>
              ),
            }))}
          />
        </div>

        {/* Pricing */}
        <div className="flex flex-col gap-3">
          {saleConfig.pricing.map((tier, i) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              selected={selectedTier === tier.id}
              onSelect={() => setSelectedTier(tier.id)}
              index={i}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
          <ShieldCheck size={14} className="text-[#4ade80]" />
          <span>{saleConfig.guarantee}</span>
        </div>

        <div className="pb-8">
          <Button onClick={handlePurchase} className="w-full text-base">
            Start My Journey
          </Button>
        </div>
      </MobileContainer>
    </ThemeProvider>
  );
}
