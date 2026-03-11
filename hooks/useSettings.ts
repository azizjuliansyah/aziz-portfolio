import { useState, useEffect } from "react";
import { Settings, UpdateSettingsInput } from "@/types/settings";
import { settingsService } from "@/services/settingsService";
import { useToast } from "@/hooks/useToast";

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await settingsService.fetchSettings();
      setSettings(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch settings");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (data: UpdateSettingsInput) => {
    setIsSubmitting(true);
    try {
      const updated = await settingsService.updateSettings(data);
      setSettings(updated);
      toast.success("Settings updated successfully");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    settings,
    isLoading,
    isSubmitting,
    updateSettings,
    refreshSettings: fetchSettings,
  };
};
