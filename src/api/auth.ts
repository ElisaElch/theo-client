import { apiFetch } from "./client";
import type { User } from "../types/user";

// What register, login and me all return
type AuthResponse = { user: User };

export type RegisterData = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

// Creates an account and logs the user in (the API sets the cookie)
export function register(data: RegisterData) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Logs in with email and password (the API sets the cookie)
export function login(data: LoginData) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Logs out (the API removes the cookie)
export function logout() {
  return apiFetch<{ message: string }>("/auth/logout", { method: "POST" });
}

// Who is logged in? Fails with 401 if nobody is
export function getMe() {
  return apiFetch<AuthResponse>("/auth/me");
}
