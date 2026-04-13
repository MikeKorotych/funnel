import type { ThemeConfig } from "./types";
import { colors } from "@/config/design-tokens";

export const rpgGamifiedTheme: ThemeConfig = {
  id: "rpg-gamified",
  name: "Premium Minimal",
  colors: {
    background: colors.bg.deep,
    backgroundSecondary: colors.bg.surface,
    surface: colors.bg.card,
    surfaceElevated: colors.bg.elevated,
    primary: colors.cta.bg,
    primaryGlow: colors.glow.white,
    secondary: colors.accent.warm,
    accent: colors.accent.warm,
    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
    textMuted: colors.text.muted,
    success: colors.status.success,
    warning: colors.status.warning,
    error: colors.status.error,
    xpBar: colors.text.secondary,
    progressBar: colors.text.primary,
  },
  fonts: {
    heading: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
  },
  effects: {
    glowEnabled: true,
    particlesEnabled: true,
    screenTransition: "fade",
  },
};
