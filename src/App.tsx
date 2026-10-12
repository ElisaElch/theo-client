import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import FriendsLayout from "./components/friends/FriendsLayout";
import HomePage from "./pages/HomePage"; // loaded straight away: the first page most people see

// Every other page is loaded only when someone opens it ("code-splitting").
// Vite turns each lazy(() => import(...)) into its own small file, so the first
// download stays small. The map page (with Leaflet) is the biggest saving.
// New pages: add them here the same way.
const MyPlacesPage = lazy(() => import("./pages/MyPlacesPage"));
const MapPage = lazy(() => import("./pages/MapPage"));
const FriendsOverviewPage = lazy(() => import("./pages/FriendsOverviewPage"));
const FriendsActivityPage = lazy(() => import("./pages/FriendsActivityPage"));
const FindFriendsPage = lazy(() => import("./pages/FindFriendsPage"));
const FriendRequestsPage = lazy(() => import("./pages/FriendRequestsPage"));
const ManageFriendsPage = lazy(() => import("./pages/ManageFriendsPage"));
const FriendProfilePage = lazy(() => import("./pages/FriendProfilePage"));
const FriendVisitPage = lazy(() => import("./pages/FriendVisitPage"));
const AddPlacePage = lazy(() => import("./pages/AddPlacePage"));
const PlacePage = lazy(() => import("./pages/PlacePage"));
const EditPlacePage = lazy(() => import("./pages/EditPlacePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const EditProfilePage = lazy(() => import("./pages/EditProfilePage"));

// Shown while a page's file is still downloading
// (mostly when a lazy page is opened or refreshed directly)
function PageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <span className="loading loading-spinner loading-lg text-forest" aria-label="Loading" />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* Pages with the navbar */}
        <Route element={<Layout />}>
          {/* Public: anyone can see these */}
          <Route path="/" element={<HomePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Private: need a login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-places" element={<MyPlacesPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />

            {/* Friends section: shared sidebar + data (FriendsLayout) */}
            <Route path="/friends" element={<FriendsLayout />}>
              <Route index element={<FriendsOverviewPage />} />
              <Route path="activity" element={<FriendsActivityPage />} />
              <Route path="find" element={<FindFriendsPage />} />
              <Route path="requests" element={<FriendRequestsPage />} />
              <Route path="manage" element={<ManageFriendsPage />} />
            </Route>

            {/* A friend's profile and places (full width, no sidebar) */}
            <Route path="/friends/:userId" element={<FriendProfilePage />} />
            <Route path="/friends/:userId/places/:visitId" element={<FriendVisitPage />} />

            <Route path="/places/new" element={<AddPlacePage />} />
            <Route path="/places/:id" element={<PlacePage />} />
            <Route path="/places/:id/edit" element={<EditPlacePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Full-screen pages without the navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;