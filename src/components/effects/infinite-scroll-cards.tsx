"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ScrollItem = {
  id: string;
  content: ReactNode;
};

export function InfiniteScrollCards({
  items,
  speed = "normal",
  direction = "left",
  pauseOnHover = true,
  className,
}: {
  items: ScrollItem[];
  speed?: "fast" | "normal" | "slow";
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const durations = { fast: "20s", normal: "35s", slow: "50s" };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.style.setProperty("--scroll-duration", durations[speed]);
    container.style.setProperty(
      "--scroll-direction",
      direction === "left" ? "normal" : "reverse",
    );
  }, [speed, direction, durations]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 gap-4 animate-infinite-scroll",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        {/* Original items */}
        {items.map((item) => (
          <div key={item.id} className="shrink-0 w-[280px]">
            {item.content}
          </div>
        ))}
        {/* Duplicated for seamless loop */}
        {items.map((item) => (
          <div key={`dup-${item.id}`} className="shrink-0 w-[280px]" aria-hidden>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
