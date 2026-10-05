import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/useAuth";

// Wraps pages that need a login.
// Logged in → show the page. Logged out → send to /login.
function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Still checking the cookie: show a spinner, don't decide yet
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-forest" />
      </div>
    );
  }

  // Not logged in: go to login, remembering where they were heading
  if (!user) {
    // pathname + search keeps e.g. "/friends?add=sophietest" from an invite link
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  // Logged in: show the page
  return <Outlet />;
}

export default ProtectedRoute;
