import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { loginSuccess, logout as logoutAction } from "@/app/store/features/authSlice";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage, LoginCredentials } from "@/types";
import { ROUTES } from "@/constants/routes";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      toast.success("Welcome back!");
      router.push(ROUTES.DASHBOARD.HOME);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error) || "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch(logoutAction());
      toast.success("Logged out successfully");
      router.push(ROUTES.LOGIN);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error) || "Logout failed");
      return false;
    }
  };

  return {
    login,
    logout,
    isLoading,
  };
};
