import { createContext } from "react";
import type { User } from "../types/user";
import type { LoginData, RegisterData } from "../api/auth";

// Everything the rest of the app can use from auth
export type AuthContextValue = {
  user: User | null; // null = not logged in
  isLoading: boolean; // true while checking the login cookie on page load
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
};

// Starts as null; AuthProvider fills in the real value
export const AuthContext = createContext<AuthContextValue | null>(null);
