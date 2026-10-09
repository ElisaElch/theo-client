import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import FriendsLayout from "./components/friends/FriendsLayout";
import HomePage from "./pages/HomePage";
import MyPlacesPage from "./pages/MyPlacesPage";
import MapPage from "./pages/MapPage";
import FriendsOverviewPage from "./pages/FriendsOverviewPage";
import FriendsActivityPage from "./pages/FriendsActivityPage";
import FindFriendsPage from "./pages/FindFriendsPage";
import FriendRequestsPage from "./pages/FriendRequestsPage";
import ManageFriendsPage from "./pages/ManageFriendsPage";
import FriendProfilePage from "./pages/FriendProfilePage";
import FriendVisitPage from "./pages/FriendVisitPage";
import AddPlacePage from "./pages/AddPlacePage";
import PlacePage from "./pages/PlacePage";
import EditPlacePage from "./pages/EditPlacePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import EditProfilePage from "./pages/EditProfilePage";

function App() {
  return (
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
  );
}

export default App;
