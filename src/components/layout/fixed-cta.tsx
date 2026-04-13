"use client";

import type { ReactNode } from "react";

/**
 * Fixed CTA container — positions button at exactly 32px from bottom of viewport.
 * All pages should use this for consistent CTA placement.
 */
export function FixedCTA({ children }: { children: ReactNode }) {
  return (
    <div className="fixed bottom-8 left-0 right-0 z-40 px-5">
      <div className="mx-auto max-w-[430px]">
        {children}
      </div>
    </div>
  );
}
