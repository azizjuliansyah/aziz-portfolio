import { Skill } from "@/types/skill";

export const skillService = {
  async fetchSkills(): Promise<Skill[]> {
    const res = await fetch("/api/skills");
    if (!res.ok) throw new Error("Failed to fetch skills");
    return res.json();
  },

  async reorderSkills(items: { id: string; order: number }[]): Promise<void> {
    const res = await fetch("/api/skills/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error("Failed to reorder skills");
  },

  async createSkill(data: FormData): Promise<Skill> {
    const res = await fetch("/api/skills", {
      method: "POST",
      body: data,
    });
    if (!res.ok) throw new Error("Failed to create skill");
    return res.json();
  },

  async updateSkill(id: string, data: FormData): Promise<Skill> {
    const res = await fetch(`/api/skills/${id}`, {
      method: "PUT",
      body: data,
    });
    if (!res.ok) throw new Error("Failed to update skill");
    return res.json();
  },

  async deleteSkill(id: string): Promise<void> {
    const res = await fetch(`/api/skills/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete skill");
  },
};
