import { Profile } from "@/types/profile";

export const profileService = {
  async fetchProfile(): Promise<Profile> {
    const res = await fetch("/api/portfolio-profile");
    if (!res.ok) throw new Error("Failed to fetch profile");
    const data = await res.json();
    return data || {}; // API returns single object or null
  },

  async updateProfile(data: FormData): Promise<Profile> {
    const res = await fetch("/api/portfolio-profile", {
      method: "PUT",
      body: data,
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
  },
};
