"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { LayoutDashboard, Rocket, Code, Share2, User as UserIcon, Settings as SettingsIcon, Plus, Award, Briefcase } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { Card } from "@/components/ui/Card";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { logout } = useAuth();
  const { stats, isLoading: isStatsLoading } = useDashboard();

  const quickActions = [
    { label: "Edit Profile", icon: UserIcon, color: "text-on-primary-container", bg: "bg-primary-container", path: stats.activeProfileId ? `/dashboard/profile/${stats.activeProfileId}?tab=basic` : "/dashboard/profile" },
    { label: "Experience", icon: Briefcase, color: "text-on-secondary-container", bg: "bg-secondary-container", path: stats.activeProfileId ? `/dashboard/profile/${stats.activeProfileId}?tab=experience` : "/dashboard/profile" },
    { label: "Manage Skills", icon: Code, color: "text-on-tertiary-container", bg: "bg-tertiary-container", path: stats.activeProfileId ? `/dashboard/profile/${stats.activeProfileId}?tab=skills` : "/dashboard/profile" },
    { label: "Certificates", icon: Award, color: "text-on-primary-container", bg: "bg-primary-container", path: stats.activeProfileId ? `/dashboard/profile/${stats.activeProfileId}?tab=certificates` : "/dashboard/profile" },
    { label: "Add Project", icon: Plus, color: "text-on-secondary-container", bg: "bg-secondary-container", path: stats.activeProfileId ? `/dashboard/profile/${stats.activeProfileId}?tab=projects` : "/dashboard/profile" },
    { label: "Social Links", icon: Share2, color: "text-on-tertiary-container", bg: "bg-tertiary-container", path: stats.activeProfileId ? `/dashboard/profile/${stats.activeProfileId}?tab=social-links` : "/dashboard/profile" },
  ];

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
              <Rocket className="w-8 h-8 text-primary" />
              Hello, {user?.name || "Admin"}!
            </h1>
            <p className="text-on-surface/70 mt-2">
              Currently managing: <span className="text-blue-600 font-semibold">{isStatsLoading ? "..." : stats.activeProfileName}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-on-surface/70 bg-surface-container-high px-4 py-2 rounded-full border border-outline/10">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            System Online
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Projects" 
            value={isStatsLoading ? "..." : stats.totalProjects.toString()} 
            colorClass="bg-primary" 
          />
          <StatCard 
            label="Skills" 
            value={isStatsLoading ? "..." : stats.totalSkills.toString()} 
            colorClass="bg-secondary" 
          />
          <StatCard 
            label="Social Links" 
            value={isStatsLoading ? "..." : stats.totalSocialLinks.toString()} 
            colorClass="bg-tertiary" 
          />
        </div>

        {/* Quick Actions Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-on-surface">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => router.push(action.path)}
                className="p-4 rounded-2xl bg-surface-container-low border border-outline/10 hover:border-primary transition-all group text-left shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className={`w-12 h-12 ${action.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <span className="text-sm font-semibold text-on-surface/90">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Preview Action */}
        <div className="pt-12 pb-6 flex flex-col items-center justify-center border-t border-outline/10 mt-12 w-full">
          <div className="text-center max-w-md space-y-4 flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 text-primary font-medium">
              <Share2 className="w-4 h-4" />
              <span>Public Portfolio is live</span>
            </div>
            <p className="text-on-surface/70 text-sm">
              Your profile for <span className="text-primary font-semibold">{stats.activeProfileName}</span> is visible to everyone.
            </p>
            <Button 
              variant="outline"
              className="mt-4 border-outline/20 text-primary hover:bg-primary/5 rounded-xl px-8 py-6 group mx-auto"
              onClick={() => window.open("/", "_blank")}
            >
              Launch Preview
              <Rocket className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
