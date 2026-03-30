"use client";

import { useEffect, useState } from "react";

export function useProjectWithProfile(projectId: string) {
  const [project, setProject] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, profileRes] = await Promise.all([
          fetch(`/api/public/projects/${projectId}`),
          fetch("/api/public/profile")
        ]);

        const [projectData, profileData] = await Promise.all([
          projectRes.json(),
          profileRes.json()
        ]);

        setProject(projectData);
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch project data:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { project, profile, loading, error };
}
