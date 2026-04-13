import type { ThemeConfig } from "./types";

export const darkPremiumTheme: ThemeConfig = {
  id: "dark-premium",
  name: "Dark Premium",
  colors: {
    background: "#09090b",
    backgroundSecondary: "#18181b",
    surface: "#27272a",
    surfaceElevated: "#3f3f46",
    primary: "#a78bfa",
    primaryGlow: "rgba(167, 139, 250, 0.2)",
    secondary: "#06b6d4",
    accent: "#f472b6",
    textPrimary: "#fafafa",
    textSecondary: "#a1a1aa",
    textMuted: "#52525b",
    success: "#34d399",
    warning: "#fbbf24",
    error: "#f87171",
    xpBar: "#a78bfa",
    progressBar: "#06b6d4",
  },
  fonts: {
    heading: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
  },
  effects: {
    glowEnabled: false,
    particlesEnabled: false,
    screenTransition: "slide",
  },
};
