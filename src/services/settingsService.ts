import { API_ENDPOINTS } from "@/constants/api";
import type { Settings } from "@/types";

export const settingsService = {
  async fetchSettings(): Promise<Settings> {
    const res = await fetch(API_ENDPOINTS.SETTINGS);
    if (!res.ok) throw new Error("Failed to fetch settings");
    const data = await res.json();
    return data[0] || { theme: "system", enable_global_theme: false };
  },

  async updateSettings(data: FormData | Partial<Settings>): Promise<Settings> {
    const isFormData = data instanceof FormData;
    const res = await fetch(API_ENDPOINTS.SETTINGS, {
      method: "PUT",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update settings");
    return res.json();
  },
};
