import { useState, useEffect } from "react";
import { Settings, UpdateSettingsInput, getErrorMessage } from "@/types";
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
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to fetch settings");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (data: FormData | UpdateSettingsInput) => {
    setIsSubmitting(true);
    try {
      const updated = await settingsService.updateSettings(data);
      setSettings(updated);
      toast.success("Settings updated successfully");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to update settings");
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
