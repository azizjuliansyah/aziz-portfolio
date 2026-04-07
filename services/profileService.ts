import { Profile } from "@/types/profile";
import { ValidationError } from "@/types/error";

const handleProfileError = async (res: Response, defaultMessage: string) => {
  if (!res.ok) {
    try {
      const errorData = await res.json();
      if (errorData?.details) {
        throw new ValidationError(errorData.error || defaultMessage, errorData.details);
      }
      throw new Error(errorData?.error || defaultMessage);
    } catch (e) {
      if (e instanceof ValidationError) throw e;
      throw new Error(defaultMessage);
    }
  }
};

export const profileService = {
  async fetchProfiles(): Promise<Profile[]> {
    const res = await fetch("/api/portfolio-profile");
    if (!res.ok) await handleProfileError(res, "Failed to fetch profiles");
    return res.json();
  },

  async fetchProfile(id: string): Promise<Profile> {
    const res = await fetch(`/api/portfolio-profile/${id}`);
    if (!res.ok) await handleProfileError(res, "Failed to fetch profile");
    return res.json();
  },

  async createProfile(name: string): Promise<Profile> {
    const res = await fetch("/api/portfolio-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) await handleProfileError(res, "Failed to create profile");
    return res.json();
  },

  async updateProfile(id: string, data: FormData): Promise<Profile> {
    const res = await fetch(`/api/portfolio-profile/${id}`, {
      method: "PUT",
      body: data,
    });
    if (!res.ok) await handleProfileError(res, "Failed to update profile");
    return res.json();
  },

  async deleteProfile(id: string): Promise<void> {
    const res = await fetch(`/api/portfolio-profile/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete profile");
  },

  async toggleActiveProfile(id: string, isActive: boolean): Promise<Profile> {
    const res = await fetch(`/api/portfolio-profile/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: isActive }),
    });
    if (!res.ok) throw new Error("Failed to toggle active status");
    return res.json();
  },
};
