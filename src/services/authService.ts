import type { AuthResponse, LoginCredentials, RegisterData } from "@/types";
import { API_ENDPOINTS } from "@/constants/api";

/**
 * Service for authentication-related API calls
 */
export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Login failed");
    }

    return res.json();
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Registration failed");
    }

    return res.json();
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    const res = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Logout failed");
    }
  },
};
