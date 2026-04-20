"use client";

import { useEffect, useState } from "react";

export function useActiveProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchActiveProfile = async () => {
      try {
        const res = await fetch("/api/public/profile");
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch active profile:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveProfile();
  }, []);

  return { profile, loading, error };
}
