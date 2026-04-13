"use client";

import { icons, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const LucideComponent = icons[name as keyof typeof icons] as LucideIcon | undefined;
  if (!LucideComponent) return null;
  return <LucideComponent size={size} className={cn("shrink-0", className)} />;
}
