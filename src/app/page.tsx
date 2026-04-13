"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFunnelStore } from "@/stores/funnel.store";
import { DEFAULT_TOPIC_ID } from "@/config/topics";
import { DEFAULT_THEME_ID } from "@/config/themes";

export default function EntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUtmParams, setConfig } = useFunnelStore();

  useEffect(() => {
    // Extract UTM params
    const params: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    setUtmParams(params);

    // Set topic and theme from URL or defaults
    setConfig({
      topicId: searchParams.get("topic") ?? DEFAULT_TOPIC_ID,
      themeId: searchParams.get("theme") ?? DEFAULT_THEME_ID,
      variantId: searchParams.get("variant") ?? undefined,
    });

    // Redirect to quiz
    router.replace("/quiz");
  }, [searchParams, setUtmParams, setConfig, router]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#0a0a1a]">
      <div className="w-8 h-8 rounded-full border-2 border-[#1e2a4a] border-t-[#00d4ff] animate-spin" />
    </div>
  );
}
