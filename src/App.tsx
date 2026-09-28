import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import MyPlacesPage from "./pages/MyPlacesPage";
import MapPage from "./pages/MapPage";
import FriendsPage from "./pages/FriendsPage";
import AddPlacePage from "./pages/AddPlacePage";
import PlacePage from "./pages/PlacePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/my-places" element={<MyPlacesPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/friends" element={<FriendsPage />} />
      <Route path="/places/new" element={<AddPlacePage />} />
      <Route path="/places/:id" element={<PlacePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
