import { Project } from "@/types/project";

export const projectService = {
  async fetchProjects(): Promise<Project[]> {
    const res = await fetch("/api/projects");
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
  },

  async reorderProjects(items: { id: string; order: number }[]): Promise<void> {
    const res = await fetch("/api/projects/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error("Failed to reorder projects");
  },

  async createProject(data: FormData): Promise<Project> {
    const res = await fetch("/api/projects", {
      method: "POST",
      body: data,
    });
    if (!res.ok) throw new Error("Failed to create project");
    return res.json();
  },

  async updateProject(id: string, data: FormData): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      body: data,
    });
    if (!res.ok) throw new Error("Failed to update project");
    return res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete project");
  },
};
