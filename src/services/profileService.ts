import { API_ENDPOINTS } from "@/constants/api";
import type { Profile } from "@/types";
import { BaseService } from "./baseService";

/**
 * Service for portfolio profile management
 * Extends BaseService to inherit standard CRUD operations
 */
class ProfileService extends BaseService<Profile> {
  protected endpoint = API_ENDPOINTS.PROFILE.BASE;
  protected entityName = "profile";
  protected contentType = "multipart/form-data" as const;

  /**
   * Compatibility aliases for existing code
   * Allows transitioning to BaseService names gradually
   */
  fetchProfiles = () => this.fetchAll();
  fetchProfile = (id: string) => this.getById(id);
  createProfile = (name: string) => this.create({ name });
  updateProfile = (id: string, data: FormData | Record<string, any>) => this.update(id, data);
  deleteProfile = (id: string) => this.delete(id);

  /**
   * Toggle profile active status
   */
  async toggleActiveProfile(id: string, isActive: boolean): Promise<Profile> {
    return this.patch(id, { is_active: isActive });
  }
}

export const profileService = new ProfileService();
