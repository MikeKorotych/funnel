"use client";

import { type ReactNode, useMemo } from "react";
import type { ThemeConfig } from "@/config/themes/types";
import { ThemeContext } from "@/hooks/use-theme";

function themeToCssVars(theme: ThemeConfig): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme.colors)) {
    vars[`--color-${camelToKebab(key)}`] = value;
  }
  vars["--font-heading"] = theme.fonts.heading;
  vars["--font-body"] = theme.fonts.body;
  return vars;
}

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

export function ThemeProvider({
  theme,
  children,
}: {
  theme: ThemeConfig;
  children: ReactNode;
}) {
  const cssVars = useMemo(() => themeToCssVars(theme), [theme]);

  return (
    <ThemeContext value={theme}>
      <div style={cssVars} className="min-h-dvh bg-background text-text-primary font-body">
        {children}
      </div>
    </ThemeContext>
  );
}
