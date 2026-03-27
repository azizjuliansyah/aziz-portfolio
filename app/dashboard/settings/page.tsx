"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageInput } from "@/components/ui/ImageInput";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  User,
  Lock,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSettings } from "@/hooks/useSettings";
import { useAuthAccount } from "@/hooks/useAuthAccount";
import { useAuth } from "@/hooks/useAuth";
import { Theme } from "@/types/settings";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const { settings, isLoading: isSettingsLoading, updateSettings, isSubmitting: isSubmittingSettings } = useSettings();
  const { isSubmitting: isSubmittingAccount, updateAccount } = useAuthAccount();
  const { logout } = useAuth();
  const { setTheme: setAppTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<"account" | "appearance">("account");

  const [theme, setTheme] = useState<Theme>("system");
  const [enableGlobalTheme, setEnableGlobalTheme] = useState(false);

  // User states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | string | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (settings) {
      setTheme(settings.theme);
      setEnableGlobalTheme(settings.enable_global_theme || false);
      // Sync global theme context with fetched settings
      setAppTheme(settings.theme);
    }
  }, [settings, setAppTheme]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatar(user.image || null);
    }
  }, [user]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTheme = !enableGlobalTheme ? "system" : theme;
    await updateSettings({
      theme: finalTheme,
      enable_global_theme: enableGlobalTheme,
    });
    setAppTheme(finalTheme);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    if (password) {
      formData.append("password", password);
    }

    if (avatar instanceof File) formData.append("image", avatar);

    const result = await updateAccount(formData);

    // If successful and logout is required (due to email or password change)
    if (result && result.logoutRequired) {
      logout();
    }
  };

  if (isSettingsLoading) {
    return (
      <DashboardLayout user={user} onLogout={logout} title="Admin Settings">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton width={200} height={32} />
              <Skeleton width={400} height={24} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card className="h-full" contentClassName="flex flex-col items-center space-y-4">
                <Skeleton width={128} height={128} className="rounded-full" />
                <Skeleton width={150} height={24} />
                <Skeleton width={200} height={16} />
              </Card>
            </div>
            <div className="lg:col-span-3">
              <Card className="h-[400px]" contentClassName="space-y-4">
                <Skeleton width={200} height={24} className="mb-4" />
                <Skeleton className="w-full" height={40} />
                <Skeleton className="w-full" height={40} />
                <Skeleton className="w-full" height={40} />
              </Card>
            </div>
          </div>
        </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Column: Profile Preview */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm h-[max-content]">
              <div className="flex flex-col items-center text-center space-y-4 py-2">
                <div className="relative group w-28 h-28 rounded-full overflow-hidden border-4 border-surface shadow-lg bg-surface-container-high flex items-center justify-center">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-dim opacity-20 transition duration-1000"></div>
                  {avatar ? (
                    <img
                      src={typeof avatar === "string" ? avatar : URL.createObjectURL(avatar)}
                      alt="Profile Preview"
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400 relative z-10" />
                  )}
                </div>

                <div className="space-y-1 w-full px-2">
                  <h2 className="text-lg font-bold text-on-surface truncate">{name || "Admin User"}</h2>
                  <p className="text-sm text-on-surface/60 truncate">{email}</p>
                </div>

                <div className="w-full pt-4 mt-2 border-t border-outline/10">
                  <span className="inline-flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-on-tertiary-container bg-tertiary-container px-3 py-1.5 rounded-full font-bold w-max mx-auto">
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin Account
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Tabbed Settings Form */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col p-0 overflow-hidden shadow-sm">

              {/* Tabs Header */}
              <div className="flex border-b border-outline/10 px-6 pt-4 bg-surface-container-low/50">
                <button
                  type="button"
                  onClick={() => setActiveTab("account")}
                  className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 relative ${activeTab === "account"
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface/50 hover:text-on-surface"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Account Details
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("appearance")}
                  className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 relative ${activeTab === "appearance"
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface/50 hover:text-on-surface"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Appearance
                  </div>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6 flex-1 bg-surface-container">

                {/* Account Details Tab */}
                {activeTab === "account" && (
                  <form onSubmit={handleSaveAccount} className="h-full flex flex-col animate-in fade-in duration-300">
                    <div className="space-y-5 flex-1 w-full">

                      <div className="grid gap-6 sm:grid-cols-12">
                        <div className="sm:col-span-12 md:col-span-4">
                          <div className="max-w-48">
                            <ImageInput
                              label="Profile Avatar"
                              value={avatar}
                              onChange={(file) => setAvatar(file)}
                              aspectRatio="aspect-square"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-12 md:col-span-8 flex flex-col justify-start gap-5">
                          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="sm:col-span-12">
                          <Input
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={Lock}
                            placeholder="Leave blank to keep unchanged"
                            helperText="If you change your password or email, you will be logged out."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-outline/10 flex justify-end">
                      <Button type="submit" isLoading={isSubmittingAccount} leftIcon={CheckCircle2} className="w-full sm:w-auto shadow-lg shadow-primary/20">
                        Save Account Details
                      </Button>
                    </div>
                  </form>
                )}

                {/* Appearance Tab */}
                {activeTab === "appearance" && (
                  <form onSubmit={handleSaveSettings} className="h-full flex flex-col animate-in fade-in duration-300">
                    <div className="space-y-6 flex-1 w-full">

                      <div className="flex items-center justify-between p-5 bg-surface-container-high rounded-2xl border border-outline/10 transition">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-on-surface">Enable Global Theme</p>
                          <p className="text-xs text-on-surface/60">Lock the admin theme to match site-wide default settings.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={enableGlobalTheme} onChange={(e) => setEnableGlobalTheme(e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-outline/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className={`space-y-4 pt-4 transition duration-300 ${!enableGlobalTheme ? 'opacity-40 grayscale-[50%] pointer-events-none' : 'opacity-100'}`}>
                        <p className="text-sm font-medium text-on-surface/80">Global Color Mode</p>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { id: "light", label: "Light", icon: Sun, desc: "Clean and bright" },
                            { id: "dark", label: "Dark", icon: Moon, desc: "Easy on eyes" },
                            { id: "system", label: "System", desc: "Match device" },
                          ].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              disabled={!enableGlobalTheme}
                              onClick={() => setTheme(item.id as Theme)}
                              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-[1.5px] transition-all group ${theme === item.id
                                ? "border-primary bg-primary/10 text-primary shadow-sm"
                                : "border-outline/10 hover:border-outline/30 text-on-surface/50"
                                }`}
                            >
                              <div className={`p-2 rounded-full ${theme === item.id ? 'bg-primary/20' : 'bg-surface-container-high group-hover:bg-surface-container-highest'}`}>
                                {item.icon && <item.icon className="w-5 h-5" />}
                                {!item.icon && <Monitor className="w-5 h-5" />}
                              </div>
                              <div className="text-center">
                                <span className="block text-sm font-medium text-on-surface mb-0.5">{item.label}</span>
                                <span className="text-[10px] sm:text-xs text-on-surface/50 font-normal">{item.desc}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-outline/10 flex justify-end">
                      <Button type="submit" isLoading={isSubmittingSettings} leftIcon={CheckCircle2} className="w-full sm:w-auto shadow-lg shadow-primary/20">
                        Save Appearance
                      </Button>
                    </div>
                  </form>
                )}

              </div>
            </Card>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
