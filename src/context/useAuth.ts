import { useContext } from "react";
import { AuthContext } from "./authContext";

// Use in any component: const { user, login, logout } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);

  // Only happens if a component is used outside <AuthProvider>
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}
