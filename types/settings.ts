export type Theme = "light" | "dark" | "system";

export interface Settings {
  id: string;
  theme: Theme;
  enable_global_theme: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_site_name?: string | null;
  seo_type?: string | null;
  seo_image?: string | null;
}

export type UpdateSettingsInput = Partial<Settings>;
