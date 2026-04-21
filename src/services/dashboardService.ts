import { API_ENDPOINTS } from "@/constants/api";

export const dashboardService = {
  async fetchStats() {
    const res = await fetch(API_ENDPOINTS.DASHBOARD.STATS);
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return res.json();
  },
};
