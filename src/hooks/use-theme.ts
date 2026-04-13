"use client";

import { createContext, useContext } from "react";
import type { ThemeConfig } from "@/config/themes/types";

export const ThemeContext = createContext<ThemeConfig | null>(null);

export function useTheme(): ThemeConfig {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return theme;
}
