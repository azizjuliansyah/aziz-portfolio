/**
 * Authentication related types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  image: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}
