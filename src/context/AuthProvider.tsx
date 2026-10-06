import { useEffect, useState, type ReactNode } from "react";
import * as authApi from "../api/auth";
import type { LoginData, RegisterData } from "../api/auth";
import type { User } from "../types/user";
import { AuthContext } from "./authContext";

// Holds the logged-in user and shares it with the whole app
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On page load: ask the API whether the login cookie belongs to someone
  useEffect(() => {
    authApi
      .getMe()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null)) // 401 = not logged in, which is fine
      .finally(() => setIsLoading(false));
  }, []);

  async function login(data: LoginData) {
    const { user } = await authApi.login(data);
    setUser(user);
  }

  async function register(data: RegisterData) {
    const { user } = await authApi.register(data);
    setUser(user);
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  // Merges the changed fields into the logged-in user (does nothing if logged out)
  function updateUser(changes: Partial<User>) {
    setUser((current) => (current ? { ...current, ...changes } : current));
  }

  return (
    <AuthContext value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext>
  );
}

export default AuthProvider;