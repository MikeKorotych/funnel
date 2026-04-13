"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/cn";

export function NumberTicker({
  value,
  prefix = "",
  suffix = "",
  decimalPlaces = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimalPlaces?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 60,
    damping: 20,
    mass: 1,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const formatted = Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)));
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });
    return unsubscribe;
  }, [springValue, decimalPlaces, prefix, suffix]);

  return (
    <span
      ref={ref}
      className={cn("tabular-nums", className)}
    >
      {prefix}0{suffix}
    </span>
  );
}
