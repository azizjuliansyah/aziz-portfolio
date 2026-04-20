"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { LayoutDashboard, Rocket, Code, Share2, User as UserIcon, Settings as SettingsIcon, Plus, Award, Briefcase, LayoutTemplate } from "lucide-react";
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-surface to-secondary/5 border border-primary/10 p-8 shadow-sm">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-10 -mb-4 w-24 h-24 bg-tertiary/20 blur-2xl rounded-full"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-on-surface flex items-center gap-3">
                Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{user?.name || "Admin"}</span>!
              </h1>
              <p className="text-on-surface/70 mt-2 text-lg">
                Currently managing portfolio: <span className="text-primary font-semibold px-2 py-1 bg-primary/10 rounded-md tracking-wide ml-1">{isStatsLoading ? "..." : stats.activeProfileName}</span>
              </p>
            </div>
            
            <div className="hidden md:flex items-center justify-center w-20 h-20 bg-surface rounded-2xl shadow-sm border border-outline/10 text-primary transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Rocket className="w-10 h-10" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Projects" 
            value={isStatsLoading ? "..." : stats.totalProjects.toString()} 
            colorClass="bg-primary"
            icon={LayoutTemplate} 
          />
          <StatCard 
            label="Skills" 
            value={isStatsLoading ? "..." : stats.totalSkills.toString()} 
            colorClass="bg-secondary" 
            icon={Code}
          />
          <StatCard 
            label="Social Links" 
            value={isStatsLoading ? "..." : stats.totalSocialLinks.toString()} 
            colorClass="bg-tertiary" 
            icon={Share2}
          />
        </div>

        {/* Quick Actions Section */}
        <div className="space-y-6 relative z-10">
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => router.push(action.path)}
                className="relative overflow-hidden p-5 rounded-2xl bg-surface border border-outline/10 hover:border-primary/40 transition-all duration-300 group text-center shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center gap-3"
              >
                <div className={`w-14 h-14 ${action.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-inner`}>
                  <action.icon className={`w-7 h-7 ${action.color}`} />
                </div>
                <span className="text-sm font-semibold text-on-surface/90 group-hover:text-primary transition-colors">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Preview Action */}
        <div className="pb-6 flex flex-col items-center justify-center mt-12 w-full relative">
          <div className="absolute inset-0 top-12 bg-gradient-to-t from-primary/5 to-transparent rounded-t-3xl -z-10"></div>
          <div className="text-center max-w-md space-y-6 flex flex-col items-center relative z-10 p-8 rounded-3xl border border-primary/10 bg-surface/50 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-center gap-2 text-primary font-bold tracking-wide uppercase text-sm bg-primary/10 px-4 py-1.5 rounded-full">
              <Share2 className="w-4 h-4" />
              <span>Public Portfolio is live</span>
            </div>
            <p className="text-on-surface/80 text-base">
              Your profile for <span className="text-primary font-semibold border-b-2 border-primary/30 pb-0.5">{stats.activeProfileName}</span> is visible to everyone on the internet.
            </p>
            <Button 
              className="mt-2 bg-gradient-to-r from-primary to-secondary text-on-primary hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 rounded-full px-10 py-6 group mx-auto font-bold text-base transition-all duration-300"
              onClick={() => window.open("/", "_blank")}
            >
              Launch Live Preview
              <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
