import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";

// Underline for the page you're currently on
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 pb-1 ${
    isActive ? "border-forest text-forest" : "border-transparent hover:text-forest"
  }`;

function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="navbar border-b border-base-300 bg-base-100 px-6">
      {/* Left: logo */}
      <div className="navbar-start">
        <Link to="/" className="font-heading text-3xl font-bold text-forest">
          theo
        </Link>
      </div>

      {/* Middle: main pages (only when logged in) */}
      {user && (
        <nav className="navbar-center hidden gap-8 font-medium md:flex">
          <NavLink to="/my-places" className={navLinkClass}>
            My Places
          </NavLink>
          <NavLink to="/map" className={navLinkClass}>
            Map
          </NavLink>
          <NavLink to="/friends" className={navLinkClass}>
            Friends
          </NavLink>
        </nav>
      )}

      {/* Right: depends on login state. Empty while checking, to avoid a flicker */}
      <div className="navbar-end gap-2">
        {isLoading ? null : user ? (
          <>
            <Link to="/places/new" className="btn btn-primary">
              + Add a place
            </Link>

            {/* User menu: opens on click (daisyUI dropdown uses focus) */}
            <div className="dropdown dropdown-end">
              <button type="button" tabIndex={0} className="btn btn-ghost gap-2">
                <span className="avatar avatar-placeholder">
                  <span className="w-8 rounded-full bg-sage text-forest">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </span>
                <span className="hidden sm:inline">{user.name}</span>
              </button>

              <ul
                tabIndex={0}
                className="dropdown-content menu z-10 mt-2 w-48 rounded-box bg-soft-white p-2 shadow"
              >
                <li className="menu-title">@{user.username}</li>
                <li>
                  <button type="button" onClick={handleLogout}>
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">
              Log in
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
