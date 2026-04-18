"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageInput } from "@/components/ui/ImageInput";
import {
  User, Lock, Sun, Moon, Monitor, CheckCircle2, Search,
} from "lucide-react";
import { ProfilePreviewCard } from "../common/ProfilePreviewCard";
import { TabNavigation } from "../common/TabNavigation";
import { Theme } from "@/types/settings";

interface SettingsFormProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  } | null;
  settings: {
    theme: Theme;
    enable_global_theme?: boolean;
    seo_title?: string | null;
    seo_description?: string | null;
    seo_site_name?: string | null;
    seo_type?: string | null;
    seo_image?: string | null;
  } | null;
  isSubmittingAccount: boolean;
  isSubmittingSettings: boolean;
  onSaveAccount: (e: React.FormEvent, data: { name: string; email: string; password: string; avatar: File | string | null }) => Promise<void>;
  onSaveSettings: (e: React.FormEvent, data: { theme: Theme; enableGlobalTheme: boolean; seoTitle: string; seoDescription: string; seoSiteName: string; seoType: string; seoImage: File | string | null }) => Promise<void>;
  accountErrors?: Record<string, string>;
}

export function SettingsForm({
  user,
  settings,
  isSubmittingAccount,
  isSubmittingSettings,
  onSaveAccount,
  onSaveSettings,
  accountErrors = {},
}: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState<"account" | "appearance" | "seo">("account");

  const [theme, setTheme] = useState<Theme>(settings?.theme || "system");
  const [enableGlobalTheme, setEnableGlobalTheme] = useState(settings?.enable_global_theme || false);

  // SEO states
  const [seoTitle, setSeoTitle] = useState(settings?.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(settings?.seo_description || "");
  const [seoSiteName, setSeoSiteName] = useState(settings?.seo_site_name || "");
  const [seoType, setSeoType] = useState(settings?.seo_type || "website");
  const [seoImage, setSeoImage] = useState<File | string | null>(settings?.seo_image || null);

  // User states
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | string | null>(user?.image || null);

  const tabs = [
    { id: "account", label: "Account Details", icon: User },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "seo", label: "SEO & Meta", icon: Search },
  ];

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveAccount(e, { name, email, password, avatar });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSettings(e, { theme, enableGlobalTheme, seoTitle, seoDescription, seoSiteName, seoType, seoImage });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Column: Profile Preview */}
      <div className="lg:col-span-1">
        <ProfilePreviewCard
          name={name}
          email={email}
          avatar={avatar}
        />
      </div>

      {/* Right Column: Tabbed Settings Form */}
      <div className="lg:col-span-3">
        <Card noPadding className="h-full flex flex-col overflow-hidden shadow-sm">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as "account" | "appearance" | "seo")}
          />

          {/* Tab Content */}
          <div className="p-6 flex-1 bg-surface-container-low">
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
                          error={accountErrors.image}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-12 md:col-span-8 flex flex-col justify-start gap-5">
                      <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required error={accountErrors.name} />
                      <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required error={accountErrors.email} />
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
                  <div className="flex items-center justify-between gap-2 p-5 bg-surface-container-high rounded-2xl border border-outline/10 transition">
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
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
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
                          className={`flex flex-col items-center gap-2 p-2 rounded-xl border-[1.5px] transition-all group cursor-pointer ${theme === item.id
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
                            <span className="hidden md:block text-[10px] sm:text-xs text-on-surface/50 font-normal">{item.desc}</span>
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

            {/* SEO & Meta Tab */}
            {activeTab === "seo" && (
              <form onSubmit={handleSaveSettings} className="h-full flex flex-col animate-in fade-in duration-300">
                <div className="space-y-6 flex-1 w-full">
                  <div className="bg-surface-container-high rounded-2xl border border-outline/10 p-5 mb-6">
                    <h3 className="text-sm font-semibold text-on-surface mb-1">Open Graph Settings</h3>
                    <p className="text-xs text-on-surface/60">Configure how your site appears when shared on social media or search engines.</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-12 w-full">
                    <div className="sm:col-span-12 md:col-span-12 flex flex-col justify-start gap-5">
                      <Input label="SEO Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="e.g. John Doe - Full Stack Developer" />
                      <Input label="SEO Site Name" value={seoSiteName} onChange={(e) => setSeoSiteName(e.target.value)} placeholder="e.g. John Doe's Portfolio" />
                      <Input label="SEO Type" value={seoType} onChange={(e) => setSeoType(e.target.value)} placeholder="e.g. website, profile, article" />
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-on-surface/80 flex items-center gap-1.5">
                          SEO Description
                        </label>
                        <textarea 
                           className="w-full min-h-[100px] p-3 text-sm bg-surface text-on-surface rounded-xl border border-outline/30 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-y" 
                           placeholder="Describe your site briefly..."
                           value={seoDescription} 
                           onChange={(e) => setSeoDescription(e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-12 md:col-span-5">
                      <div className="max-w-xs">
                        <ImageInput
                          label="Open Graph Image"
                          value={seoImage}
                          onChange={(file) => setSeoImage(file)}
                          aspectRatio="aspect-video"
                        />
                      </div>
                      <p className="text-[10px] text-on-surface/50 mt-2">Recommended size: 1200 x 630 pixels. This image will be shown on social media shares.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-outline/10 flex justify-end">
                  <Button type="submit" isLoading={isSubmittingSettings} leftIcon={CheckCircle2} className="w-full sm:w-auto shadow-lg shadow-primary/20">
                    Save SEO Settings
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
