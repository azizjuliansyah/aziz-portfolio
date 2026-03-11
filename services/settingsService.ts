import { Settings } from "@/types/settings";

export const settingsService = {
  async fetchSettings(): Promise<Settings> {
    const res = await fetch("/api/settings");
    if (!res.ok) throw new Error("Failed to fetch settings");
    const data = await res.json();
    return data[0] || { theme: "system", enable_global_theme: false };
  },

  async updateSettings(data: Partial<Settings>): Promise<Settings> {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update settings");
    return res.json();
  },
};
