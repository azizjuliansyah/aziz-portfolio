"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { loginSuccess, logout } from "@/app/store/features/authSlice";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/useToast";

export function SessionManager({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { toasts } = useSelector((state: RootState) => state.toast);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      // If we already have a user in Redux, no need to fetch again immediately
      if (user && isAuthenticated) {
        setIsInitializing(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          dispatch(loginSuccess({ user: data.user, token: "" }));
        } else {
          // If we are on a protected route and fetch fails, redirect to login
          if (pathname.startsWith("/dashboard")) {
            toast.error("Session expired or unauthorized");
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Session initialization failed:", error);
        if (pathname.startsWith("/dashboard")) {
          toast.error("Authentication failed. Please login again.");
          router.push("/login");
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initSession();
  }, [dispatch, pathname, router, user, isAuthenticated, toast]);

  // Handle protected route access during navigation
  useEffect(() => {
    if (isInitializing) return;

    if (!isAuthenticated && pathname.startsWith("/dashboard")) {
      const hasLogoutToast = toasts.some(t => t.message === "Logged out successfully");
      if (!hasLogoutToast) {
        toast.error("Please login to access the dashboard");
      }
      router.push("/login");
    } else if (isAuthenticated && pathname === "/login") {
      const hasLoginToast = toasts.some(t => t.message === "Welcome back!");
      if (!hasLoginToast) {
        toast.info("You are already logged in");
      }
      router.replace("/dashboard");
    }
  }, [isInitializing, isAuthenticated, pathname, router, toast, toasts]);

  if (isInitializing && pathname.startsWith("/dashboard")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
}
