import type { ThemeConfig } from "./types";
import { rpgGamifiedTheme } from "./rpg-gamified";
import { darkPremiumTheme } from "./dark-premium";

const themes: Record<string, ThemeConfig> = {
  "rpg-gamified": rpgGamifiedTheme,
  "dark-premium": darkPremiumTheme,
};

export const DEFAULT_THEME_ID = "rpg-gamified";

export function getTheme(id: string): ThemeConfig {
  return themes[id] ?? themes[DEFAULT_THEME_ID];
}

export function getThemeIds(): string[] {
  return Object.keys(themes);
}

export type { ThemeConfig };
