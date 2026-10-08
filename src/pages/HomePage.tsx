import { useAuth } from "../context/useAuth";
import HomeHero from "../components/home/HomeHero";
import HomeFeatures from "../components/home/HomeFeatures";
import HomePhotoStrip from "../components/home/HomePhotoStrip";
import HomeClosing from "../components/home/HomeClosing";
import Greeting from "../components/dashboard/Greeting";
import QuickActions from "../components/dashboard/QuickActions";
import RecentlySaved from "../components/dashboard/RecentlySaved";
import FriendsRecentActivity from "../components/dashboard/FriendsRecentActivity";

// "/" shows two different pages:
// the dashboard for logged-in users, and the landing page for visitors
function HomePage() {
  const { user, isLoading } = useAuth();

  // Still checking the login cookie: show nothing, to avoid a flash of the wrong page
  if (isLoading) return null;

  // Logged in: the dashboard
  if (user) {
    return (
      <div className="flex flex-col gap-12">
        <Greeting />
        <QuickActions />
           <RecentlySaved />
             <FriendsRecentActivity />
      </div>
    );
  }

  // Visitors: the landing page
  return (
    <div className="flex flex-col gap-24">
      <HomeHero />

      {/* Features, photos and the closing band belong together, so they get a smaller gap */}
      <div className="flex flex-col gap-12">
        <HomeFeatures />
        <HomePhotoStrip />
        <HomeClosing />
      </div>
    </div>
  );
}

export default HomePage;