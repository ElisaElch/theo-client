import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import MyPlacesPage from "./pages/MyPlacesPage";
import MapPage from "./pages/MapPage";
import FriendsPage from "./pages/FriendsPage";
import AddPlacePage from "./pages/AddPlacePage";
import PlacePage from "./pages/PlacePage";
import EditPlacePage from "./pages/EditPlacePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import FriendProfilePage from "./pages/FriendProfilePage";
import FriendVisitPage from "./pages/FriendVisitPage";

function App() {
  return (
    <Routes>
      {/* Pages with the navbar */}
      <Route element={<Layout />}>
        {/* Public: anyone can see these */}
        <Route path="/" element={<HomePage />} />

        {/* Private: need a login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/my-places" element={<MyPlacesPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/places/new" element={<AddPlacePage />} />
          <Route path="/places/:id" element={<PlacePage />} />
          <Route path="/places/:id/edit" element={<EditPlacePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/friends/:userId" element={<FriendProfilePage />} />
          <Route path="/friends/:userId" element={<FriendProfilePage />} />
          <Route path="/friends/:userId/places/:visitId" element={<FriendVisitPage />} />
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
