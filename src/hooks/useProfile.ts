import { useState, useEffect } from "react";
import { Profile } from "@/types";
import { profileService } from "@/services/profileService";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage, ValidationError } from "@/types";
import { useCRUD, CrudResult } from "@/hooks/useCRUD";

/**
 * Hook for single profile management
 */
export const useProfile = (id?: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const fetchProfile = async (profileId: string) => {
    setIsLoading(true);
    try {
      const data = await profileService.getById(profileId);
      setProfile(data);
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (formData: FormData): Promise<CrudResult> => {
    if (!id) return { success: false };
    setIsSubmitting(true);
    try {
      const updated = await profileService.update(id, formData);
      setProfile(updated);
      toast.success("Profile updated successfully");
      return { success: true };
    } catch (error) {
      if (error instanceof ValidationError && error.details) {
        const formErrors: Record<string, string> = {};
        error.details.forEach(err => {
          if (err.path.length > 0) {
            formErrors[err.path[0]] = err.message;
          }
        });
        return { success: false, errors: formErrors };
      }
      toast.error(getErrorMessage(error) || "Failed to update profile");
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    profile,
    isLoading,
    isSubmitting,
    updateProfile,
    refreshProfile: () => id && fetchProfile(id),
  };
};

/**
 * Hook for profile collection management
 */
export const useProfiles = () => {
  const crud = useCRUD(profileService, {
    entityName: "Profile",
  });
  const toast = useToast();

  const toggleActive = async (id: string) => {
    const result = await crud.patchItem(id, { is_active: true });
    if (result.success) {
      const activatedProfile = crud.items.find(p => p.id === id);
      const profileName = activatedProfile?.name || "Profile";
      toast.success(`Profile "${profileName}" set as active`);
      
      // Refresh items to reflect changes across all profiles (other profiles become inactive)
      crud.refreshItems();
    }
    return result.success;
  };

  return {
    ...crud,
    profiles: crud.items,
    createProfile: async (name: string) => crud.createItem({ name }),
    deleteProfile: crud.deleteItem,
    toggleActive,
    refreshProfiles: crud.refreshItems,
  };
};
