"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function MobileContainer({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[430px] min-h-dvh px-5 safe-area-top safe-area-bottom",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
