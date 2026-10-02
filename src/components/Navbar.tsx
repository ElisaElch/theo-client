import { Link, NavLink, useNavigate } from "react-router";
import { Menu, Plus } from "lucide-react";
import { useAuth } from "../context/useAuth";

// Underline for the page you're currently on (desktop links)
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 pb-1 ${
    isActive ? "border-forest text-forest" : "border-transparent hover:text-forest"
  }`;

// daisyUI dropdowns stay open while something inside them has focus.
// Removing focus closes the menu after a link is tapped.
function closeMenu() {
  (document.activeElement as HTMLElement | null)?.blur();
}

const MAIN_LINKS = [
  { to: "/my-places", label: "My Places" },
  { to: "/map", label: "Map" },
  { to: "/friends", label: "Friends" },
];

function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    closeMenu();
    await logout();
    navigate("/");
  }

  return (
    <header className="navbar border-b border-base-300 bg-base-100 px-4 sm:px-6">
      {/* Left: menu button (small screens only) + logo */}
      <div className="navbar-start gap-1">
        {user && (
          <div className="dropdown md:hidden">
            <button
              type="button"
              tabIndex={0}
              className="btn btn-ghost btn-square"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu z-10 mt-2 w-52 rounded-box bg-soft-white p-2 shadow"
            >
              {MAIN_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} onClick={closeMenu}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link to="/" className="font-heading text-3xl font-bold text-forest">
          theo
        </Link>
      </div>

      {/* Middle: main pages (larger screens only, when logged in) */}
      {user && (
        <nav className="navbar-center hidden gap-8 font-medium md:flex">
          {MAIN_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}

      {/* Right: depends on login state. Empty while checking, to avoid a flicker */}
      <div className="navbar-end gap-2">
        {isLoading ? null : user ? (
          <>
            {/* Add a place: a button on larger screens (inside the user menu on phones) */}
            <Link to="/places/new" className="btn btn-primary hidden md:inline-flex">
              <Plus className="h-4 w-4" />
              Add a place
            </Link>

            {/* User menu */}
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
                className="dropdown-content menu z-10 mt-2 w-52 rounded-box bg-soft-white p-2 shadow"
              >
                <li className="menu-title">@{user.username}</li>
                <li className="md:hidden">
                  <Link to="/places/new" onClick={closeMenu}>
                    <Plus className="h-4 w-4" />
                    Add a place
                  </Link>
                </li>
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
