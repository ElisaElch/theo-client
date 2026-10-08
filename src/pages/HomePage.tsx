import { Navigate } from "react-router";
import { useAuth } from "../context/useAuth";
import HomeHero from "../components/home/HomeHero";
import HomeFeatures from "../components/home/HomeFeatures";
import HomeClosing from "../components/home/HomeClosing";

// The landing page for visitors.
// Logged-in users go straight to My Places until their own home page exists.
function HomePage() {
  const { user, isLoading } = useAuth();

  // Still checking the login cookie: show nothing, to avoid a flash of the wrong page
  if (isLoading) return null;

  if (user) return <Navigate to="/my-places" replace />;

  return (
    // gap-24 leaves generous space between the sections we'll add next
    <div className="flex flex-col gap-24">
      <HomeHero />
       <HomeFeatures />
       <HomeClosing />
    </div>
  );
}

export default HomePage;