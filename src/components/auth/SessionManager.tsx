"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { loginSuccess } from "@/app/store/features/authSlice";
import { API_ENDPOINTS } from "@/constants/api";

export function SessionManager({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      // If we already have a user in Redux, no need to fetch again immediately
      if (user && isAuthenticated) {
        setIsInitializing(false);
        return;
      }

      try {
        const res = await fetch(API_ENDPOINTS.AUTH.ME);
        if (res.ok) {
          const data = await res.json();
          dispatch(loginSuccess({ user: data.user, token: "" }));
        }
      } catch (error) {
        console.error("Session initialization failed:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initSession();
  }, [dispatch, user, isAuthenticated]);

  return (
    <>
      {children}
    </>
  );
}
