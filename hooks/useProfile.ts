import { useState, useEffect } from "react";
import { Profile } from "@/types/profile";
import { profileService } from "@/services/profileService";
import { useToast } from "@/hooks/useToast";

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await profileService.fetchProfile();
      setProfile(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const updated = await profileService.updateProfile(formData);
      setProfile(updated);
      toast.success("Profile updated successfully");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    profile,
    isLoading,
    isSubmitting,
    updateProfile,
    refreshProfile: fetchProfile,
  };
};
