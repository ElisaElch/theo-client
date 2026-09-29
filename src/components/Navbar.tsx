import { Link, NavLink } from "react-router";

// TEMPORARY: replaced by real login state (AuthContext) on card 10
const isLoggedIn = true;

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 pb-1 ${
    isActive ? "border-forest text-forest" : "border-transparent hover:text-forest"
  }`;

function Navbar() {
  return (
    <header className="navbar border-b border-base-300 bg-base-100 px-6">
      <div className="navbar-start">
        <Link to="/" className="font-heading text-3xl font-bold text-forest">
          theo
        </Link>
      </div>

      {isLoggedIn && (
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

      <div className="navbar-end gap-2">
        {isLoggedIn ? (
          <Link to="/places/new" className="btn btn-primary">
            + Add a place
          </Link>
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
