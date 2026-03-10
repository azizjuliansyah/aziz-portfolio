
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout, loginSuccess } from "../store/features/authSlice";
import { LayoutDashboard } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(!user);
  const [stats, setStats] = useState({ totalProjects: 0, totalSkills: 0, totalInfo: 0 });
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (user) return;
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          dispatch(loginSuccess({ user: data.user, token: "" }));
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [user, dispatch, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(logout());
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <StatCard 
          label="General Info" 
          value={isStatsLoading ? "..." : stats.totalInfo.toString()} 
          colorClass="bg-orange-500" 
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

