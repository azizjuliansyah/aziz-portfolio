import { WorkExperience } from "@/types/experience";

export const experienceService = {
  async fetchExperiences(profileId?: string): Promise<WorkExperience[]> {
    const url = profileId ? `/api/experience?profileId=${profileId}` : "/api/experience";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch experiences");
    return res.json();
  },

  async reorderExperiences(items: { id: string; order: number }[]): Promise<void> {
    const res = await fetch("/api/experience/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error("Failed to reorder experiences");
  },

  async createExperience(data: Partial<WorkExperience>): Promise<WorkExperience> {
    const res = await fetch("/api/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create experience");
    return res.json();
  },

  async updateExperience(id: string, data: Partial<WorkExperience>): Promise<WorkExperience> {
    const res = await fetch(`/api/experience/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update experience");
    return res.json();
  },

  async deleteExperience(id: string): Promise<void> {
    const res = await fetch(`/api/experience/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete experience");
  },
};
