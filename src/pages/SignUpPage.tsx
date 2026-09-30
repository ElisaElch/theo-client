import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";

function SignUpPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // One state object for all four fields
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Updates whichever field changed, using the input's name attribute
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(form);
      navigate("/my-places", { replace: true });
    } catch (err) {
      // Shows the API's message, e.g. "username is already taken"
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md bg-soft-white p-8">
        <Link to="/" className="font-heading text-3xl font-bold text-forest">
          theo
        </Link>

        <h1 className="mt-6">Create your account</h1>
        <p className="mt-2 text-ink/70">Start remembering the places that make life richer.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Name</span>
            <input
              name="name"
              className="input w-full"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Username</span>
            <input
              name="username"
              className="input w-full"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
            <span className="text-xs text-ink/60">
              Letters, numbers, dots and underscores. Visible to friends.
            </span>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              name="email"
              className="input w-full"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              name="password"
              className="input w-full"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <span className="text-xs text-ink/60">
              At least 8 characters, including a letter and a number.
            </span>
          </label>

          {error && (
            <div role="alert" className="alert alert-error whitespace-pre-line">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default SignUpPage;
