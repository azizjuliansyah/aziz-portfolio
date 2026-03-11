export type Theme = "light" | "dark" | "system";

export interface Settings {
  id: string;
  theme: Theme;
  enable_global_theme: boolean;
}

export type UpdateSettingsInput = Partial<Settings>;
