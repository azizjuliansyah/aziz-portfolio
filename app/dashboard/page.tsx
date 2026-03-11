"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { LayoutDashboard } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { logout } = useAuth();
  const { stats, isLoading: isStatsLoading } = useDashboard();

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
          label="Total Projects" 
          value={isStatsLoading ? "..." : stats.totalProjects.toString()} 
          colorClass="bg-blue-500" 
        />
        <StatCard 
          label="Total Skills" 
          value={isStatsLoading ? "..." : stats.totalSkills.toString()} 
          colorClass="bg-purple-500" 
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 border border-gray-100 dark:border-gray-800 text-center">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <LayoutDashboard className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Welcome to your Dashboard</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          This is a protected area. You can manage your portfolio content here.
        </p>
        <Button 
          className="mt-6"
          onClick={() => router.push("/dashboard/projects")}
        >
          Manage Projects
        </Button>
      </div>
    </DashboardLayout>
  );
}
