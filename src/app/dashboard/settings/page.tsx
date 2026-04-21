"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Settings as SettingsIcon } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useAuthAccount } from "@/hooks/useAuthAccount";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/ThemeProvider";
import { SettingsForm } from "@/components/dashboard/settings/SettingsForm";
import { DashboardLoadingSkeleton } from "@/components/dashboard/common/DashboardLoadingSkeleton";
import { Theme } from "@/types";

export default function SettingsPage() {
  const { settings, isLoading: isSettingsLoading, updateSettings, isSubmitting: isSubmittingSettings } = useSettings();
  const { isSubmitting: isSubmittingAccount, updateAccount } = useAuthAccount();
  const [accountErrors, setAccountErrors] = useState<Record<string, string>>({});
  const { logout } = useAuth();
  const { setTheme: setAppTheme } = useTheme();

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (settings) {
      setAppTheme(settings.theme);
    }
  }, [settings, setAppTheme]);

  const handleSaveAccount = async (e: React.FormEvent, data: { name: string; email: string; password: string; avatar: File | string | null }) => {
    e.preventDefault();
    setAccountErrors({});

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);

    if (data.password) {
      formData.append("password", data.password);
    }

    if (data.avatar instanceof File) formData.append("image", data.avatar);

    const result = await updateAccount(formData);

    if (result.success) {
      // If successful and logout is required (due to email or password change)
      if (result.logoutRequired) {
        logout();
      }
    } else if (result.errors) {
      setAccountErrors(result.errors);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent, data: { theme: Theme; enableGlobalTheme: boolean; seoTitle: string; seoDescription: string; seoSiteName: string; seoType: string; seoImage: File | string | null }) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("theme", data.theme);
    formData.append("enable_global_theme", String(data.enableGlobalTheme));
    formData.append("seo_title", data.seoTitle || "");
    formData.append("seo_description", data.seoDescription || "");
    formData.append("seo_site_name", data.seoSiteName || "");
    formData.append("seo_type", data.seoType || "");
    
    if (data.seoImage instanceof File) {
      formData.append("seo_image", data.seoImage);
    } else if (typeof data.seoImage === 'string') {
      formData.append("seo_image", data.seoImage);
    }

    await updateSettings(formData);
    setAppTheme(data.theme);
  };

  if (isSettingsLoading) {
    return (
      <DashboardLayout user={user} onLogout={logout} title="Admin Settings">
        <DashboardLoadingSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} onLogout={logout} title="Admin Settings">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-primary" />
              Settings
            </h1>
            <p className="text-on-surface/60 text-sm">Manage your admin profile and dashboard appearance</p>
          </div>
        </div>

        <SettingsForm
          user={user}
          settings={settings}
          isSubmittingAccount={isSubmittingAccount}
          isSubmittingSettings={isSubmittingSettings}
          onSaveAccount={handleSaveAccount}
          onSaveSettings={handleSaveSettings}
          accountErrors={accountErrors}
        />
      </div>
    </DashboardLayout>
  );
}
