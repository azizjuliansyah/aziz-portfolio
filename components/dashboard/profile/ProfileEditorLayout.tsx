"use client";

import { ReactNode } from "react";
import { User, MapPin, Globe, Briefcase, Code2, LayoutGrid, Award, Share2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type ProfileTab = "basic" | "experience" | "skills" | "projects" | "social-links" | "certificates";

interface ProfileEditorLayoutProps {
  profile: {
    name?: string | null;
    title?: string | null;
    location?: string | null;
    avatar?: string | File | null;
  } | null;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onBack: () => void;
  onAddEntry?: () => void;
  children: ReactNode;
}

export function ProfileEditorLayout({
  profile,
  activeTab,
  onTabChange,
  onBack,
  onAddEntry,
  children,
}: ProfileEditorLayoutProps) {
  const router = useRouter();

  const tabs = [
    { id: "basic" as ProfileTab, label: "Basic Info", icon: User },
    { id: "experience" as ProfileTab, label: "Experience", icon: Briefcase },
    { id: "skills" as ProfileTab, label: "Skills", icon: Code2 },
    { id: "projects" as ProfileTab, label: "Projects", icon: LayoutGrid },
    { id: "certificates" as ProfileTab, label: "Certificates", icon: Award },
    { id: "social-links" as ProfileTab, label: "Social Links", icon: Share2 },
  ];

  const avatar = profile?.avatar;
  const name = profile?.name || "Your Name";
  const title = profile?.title || "Professional Title";
  const location = profile?.location;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-on-surface/50 hover:text-primary transition-colors w-fit group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to profiles
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-on-surface">
              {profile?.name}
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/20">
              Editing
            </span>
          </div>
        </div>
        {(activeTab === "skills" || activeTab === "projects" || activeTab === "social-links" || activeTab === "experience" || activeTab === "certificates") && onAddEntry && (
          <Button onClick={onAddEntry} leftIcon={Plus} className="hidden md:flex shadow-lg shadow-blue-500/20">
            {activeTab === "skills" ? "Add Skill" : activeTab === "projects" ? "Add Project" : activeTab === "social-links" ? "Add Social Link" : activeTab === "certificates" ? "Add Certificate" : "Add Experience"}
          </Button>
        )}
      </div>

      {/* Mobile Floating Action Button */}
      {(activeTab === "skills" || activeTab === "projects" || activeTab === "social-links" || activeTab === "experience" || activeTab === "certificates") && onAddEntry && (
        <div className="fixed bottom-6 right-6 z-50 md:hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
          <Button 
            onClick={onAddEntry} 
            leftIcon={Plus} 
            className="shadow-2xl shadow-primary/40 rounded-full h-14 !px-6 bg-primary text-on-primary border-none"
          >
            {activeTab === "skills" ? "Add Skill" : activeTab === "projects" ? "Add Project" : activeTab === "social-links" ? "Add Link" : activeTab === "certificates" ? "Add Cert" : "Add Experience"}
          </Button>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20 md:pb-0">
        {/* Left: Profile Preview */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm h-[max-content] sticky top-8">
            <div className="flex flex-col items-center text-center space-y-4 py-2">
              <div className="relative group w-28 h-28 rounded-full overflow-hidden border-4 border-surface shadow-lg bg-surface-container-high flex items-center justify-center">
                {avatar ? (
                  <Image
                    src={typeof avatar === "string" ? avatar : URL.createObjectURL(avatar)}
                    alt="Profile Preview"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover relative z-10"
                    loading="eager"
                    priority
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400 relative z-10" />
                )}
              </div>

              <div className="space-y-1 w-full px-2">
                <h2 className="text-lg font-bold text-on-surface truncate">{name}</h2>
                <p className="text-sm font-medium text-primary truncate">{title}</p>
                {location && (
                  <p className="text-xs text-on-surface/60 truncate flex items-center justify-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {location}
                  </p>
                )}
              </div>

              <div className="w-full pt-4 mt-2 border-t border-outline/10">
                <span className="inline-flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-on-tertiary-container bg-tertiary-container px-3 py-1.5 rounded-full font-bold w-max mx-auto">
                  <Globe className="w-3.5 h-3.5" /> Public Portfolio
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Tabbed Content */}
        <div className="lg:col-span-3">
          <Card noPadding className="h-full flex flex-col overflow-hidden shadow-sm">
            {/* Tabs Header */}
            <div className="flex border-b border-outline/10 bg-surface-container-low/50 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`py-4 px-4 text-sm font-medium transition-colors border-b-2 relative whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface/50 hover:text-on-surface"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 flex-1 bg-surface-container min-h-[500px]">
              {children}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
