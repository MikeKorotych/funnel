/** Premium monochrome design tokens */

export const colors = {
  bg: {
    deep: "#0a0a0a",
    surface: "#171717",
    card: "#1a1a1a",
    elevated: "#262626",
    border: "#303030",
  },
  text: {
    primary: "#ededed",
    secondary: "#a3a3a3",
    muted: "#6b6b6b",
  },
  cta: {
    bg: "#ffffff",
    text: "#0a0a0a",
    hover: "#e5e5e5",
  },
  accent: {
    warm: "#c9a96e",
    warmGlow: "rgba(201, 169, 110, 0.15)",
  },
  status: {
    success: "#4ade80",
    error: "#f87171",
    warning: "#fbbf24",
  },
  glow: {
    white: "rgba(255, 255, 255, 0.08)",
    whiteStrong: "rgba(255, 255, 255, 0.15)",
  },
} as const;
