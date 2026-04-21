import { useState, useEffect } from "react";
import { dashboardService } from "@/services/dashboardService";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/types";

export interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalSocialLinks: number;
  activeProfileName: string;
  activeProfileId: string | null;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({ 
    totalProjects: 0, 
    totalSkills: 0, 
    totalSocialLinks: 0,
    activeProfileName: "Loading...",
    activeProfileId: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await dashboardService.fetchStats();
        setStats(data);
      } catch (error) {
        toast.error(getErrorMessage(error) || "Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };
    getStats();
  }, [toast]);

  return {
    stats,
    isLoading,
  };
};
