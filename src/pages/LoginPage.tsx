import { useState, type SubmitEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/theo-logo.svg";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to go after logging in: the page they tried to open, or My Places
  const from = (location.state as { from?: string } | null)?.from ?? "/my-places";

  // Form fields and status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // true = password shown as text
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser reloading the page
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      // Shows the API's message, e.g. "Incorrect email or password"
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-md bg-soft-white p-8">
            <Link to="/" className="inline-block">
          <img src={logo} alt="theo home" className="h-14 w-auto" />
        </Link>

        <h1 className="mt-6">Welcome back</h1>
        <p className="mt-2 text-ink/70">Log in to your account and continue your next adventure.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              className="input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

                <div className="flex flex-col gap-1">
            <label htmlFor="login-password" className="text-sm font-medium">
              Password
            </label>
            {/* daisyUI: the .input wrapper holds the real input plus the eye button */}
            <div className="input w-full">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-ink/60 hover:text-forest"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="alert alert-error">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" state={location.state} className="link">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
