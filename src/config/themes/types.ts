export type ThemeConfig = {
  id: string;
  name: string;
  colors: {
    background: string;
    backgroundSecondary: string;
    surface: string;
    surfaceElevated: string;
    primary: string;
    primaryGlow: string;
    secondary: string;
    accent: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    success: string;
    warning: string;
    error: string;
    xpBar: string;
    progressBar: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  effects: {
    glowEnabled: boolean;
    particlesEnabled: boolean;
    screenTransition: "fade" | "slide" | "rpg-wipe";
  };
};
