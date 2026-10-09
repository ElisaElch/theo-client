import { Link } from "react-router";
import sadTheo from "../assets/theo-mascot-sad.png";

// Shown for any address that doesn't exist (the "*" route in App.tsx)
function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      {/* alt="" because the headline below already says what's going on */}
      <img src={sadTheo} alt="" className="w-56 sm:w-72" />

      <div className="flex flex-col gap-2">
        <h1 className="font-sans text-4xl font-bold tracking-tight text-forest sm:text-5xl">
          Page not found
        </h1>
        <p className="text-lg text-ink/80">Looks like this page has wandered off.</p>
      </div>

      {/* "/" shows the landing page when logged out, and the dashboard when logged in */}
      <Link to="/" className="btn btn-primary btn-lg">
        Back to home
      </Link>
    </div>
  );
}

export default NotFoundPage;