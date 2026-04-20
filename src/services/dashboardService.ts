export const dashboardService = {
  async fetchStats() {
    const res = await fetch("/api/dashboard/stats");
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return res.json();
  },
};
