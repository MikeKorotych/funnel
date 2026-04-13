"use client";

import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/cn";

export function FunnelHeader({
  progress,
  level,
  xp,
  onBack,
  className,
}: {
  progress: number;
  level: number;
  xp: number;
  onBack?: () => void;
  className?: string;
}) {
  return (
    <header className={cn("w-full pt-4 pb-2", className)}>
      <div className="flex items-center gap-3 mb-3">
        {onBack && (
          <button
            onClick={onBack}
            className="text-text-muted hover:text-text-primary transition-colors p-1 -ml-1"
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <ProgressBar progress={progress} level={level} xp={xp} className="flex-1" />
      </div>
    </header>
  );
}
