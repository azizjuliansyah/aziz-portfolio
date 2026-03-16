import { SocialLink } from "@/types/socialLink";

export const socialLinkService = {
  async fetchSocialLinks(profileId?: string): Promise<SocialLink[]> {
    const url = profileId ? `/api/social-links?profileId=${profileId}` : "/api/social-links";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch social links");
    return res.json();
  },

  async reorderSocialLinks(items: { id: string; order: number }[]): Promise<void> {
    const res = await fetch("/api/social-links/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error("Failed to reorder social links");
  },

  async createSocialLink(data: FormData): Promise<SocialLink> {
    const res = await fetch("/api/social-links", {
      method: "POST",
      body: data,
    });
    if (!res.ok) throw new Error("Failed to create social link");
    return res.json();
  },

  async updateSocialLink(id: string, data: FormData): Promise<SocialLink> {
    const res = await fetch(`/api/social-links/${id}`, {
      method: "PUT",
      body: data,
    });
    if (!res.ok) throw new Error("Failed to update social link");
    return res.json();
  },

  async deleteSocialLink(id: string): Promise<void> {
    const res = await fetch(`/api/social-links/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete social link");
  },
};
