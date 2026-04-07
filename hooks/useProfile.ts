import { useState, useEffect } from "react";
import { Profile } from "@/types/profile";
import { profileService } from "@/services/profileService";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage, ValidationError } from "@/types/error";
import { CrudResult } from "@/hooks/useCRUD";

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
      const data = await profileService.fetchProfile(profileId);
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
      const updated = await profileService.updateProfile(id, formData);
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

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const data = await profileService.fetchProfiles();
      setProfiles(data);
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to fetch profiles");
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async (name: string) => {
    setIsSubmitting(true);
    try {
      const newProfile = await profileService.createProfile(name);
      toast.success("Profile created successfully");
      setProfiles(prev => [newProfile, ...prev]);
      return { success: true, data: newProfile };
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
      toast.error(getErrorMessage(error) || "Failed to create profile");
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProfile = async (id: string) => {
    setIsDeleting(true);
    try {
      await profileService.deleteProfile(id);
      toast.success("Profile deleted successfully");
      setProfiles(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to delete profile");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleActive = async (id: string) => {
    setIsSubmitting(true);
    try {
      await profileService.toggleActiveProfile(id, true);
      toast.success("Profile set as active");
      setProfiles(prev => prev.map(p => ({
        ...p,
        is_active: p.id === id
      })));
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to set active profile");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    profiles,
    isLoading,
    isSubmitting,
    isDeleting,
    createProfile,
    deleteProfile,
    toggleActive,
    refreshProfiles: fetchProfiles,
  };
};
