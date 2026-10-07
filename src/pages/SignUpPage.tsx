import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Eye, EyeOff, MapPin } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { updateAvatar } from "../api/profile";
import AvatarPicker from "../components/auth/AvatarPicker";
import SignUpPhotoPanel from "../components/auth/SignUpPhotoPanel";
import logo from "../assets/theo-logo.svg";

const BIO_MAX = 150; // same limit as the API

// The red-ish * after required labels. Hidden from screen readers,
// because the inputs' "required" attribute already tells them.
function RequiredMark() {
  return (
    <span className="text-terracotta" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

function SignUpPage() {
  const { register, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to go afterwards: the page they tried to open (e.g. an invite link), or My Places
  const from = (location.state as { from?: string } | null)?.from ?? "/my-places";

  // All text fields in one object; their keys match the inputs' name attributes
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    location: "",
    bio: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  // What's happening right now, shown on the button
  const [status, setStatus] = useState<"idle" | "creating" | "uploading">("idle");

  // Updates whichever field changed, using its name attribute
  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setStatus("creating");

    // 1. Create the account (this also logs them in)
    try {
      await register({ ...form, termsAccepted });
    } catch (err) {
      // Shows the API's message, e.g. "username is already taken"
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("idle");
      return;
    }

    // 2. Upload the photo, now that the account exists.
    // If this fails, the account is still fine: they can add a photo later.
    if (avatarFile) {
      setStatus("uploading");
      try {
        const { avatarUrl } = await updateAvatar(avatarFile);
        updateUser({ avatarUrl });
      } catch {
        // Deliberately ignored: a missing photo shouldn't block signing up
      }
    }

    navigate(from, { replace: true });
  }

  const isBusy = status !== "idle";

  return (
    <div className="flex min-h-screen bg-cream">
      <SignUpPhotoPanel />

      <main className="flex-1 px-6 py-8 sm:px-10">
        {/* Top bar: logo on small screens only (the photo panel has it on large ones) */}
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="lg:hidden">
            <img src={logo} alt="theo home" className="w-24" />
          </Link>
          <p className="ml-auto text-sm text-ink">
            Already have an account?{" "}
            <Link to="/login" state={location.state} className="link font-medium">
              Log in
            </Link>
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-xl">
          <h1 className="font-heading text-5xl font-semibold text-forest">Create your account</h1>
          <p className="mt-2 text-ink/80">Join theo and make every place part of your story.</p>
          <p className="mt-1 text-xs text-ink/60">
            <span className="text-terracotta">*</span> required
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">
            {/* ---------- Your account ---------- */}
            <fieldset className="flex flex-col gap-4">
              <legend className="mb-4 font-heading text-2xl font-semibold text-forest">
                Your account
              </legend>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    First name
                    <RequiredMark />
                  </span>
                  <input
                    name="firstName"
                    className="input w-full"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    maxLength={50}
                    required
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Last name</span>
                  <input
                    name="lastName"
                    className="input w-full"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    maxLength={50}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  Username
                  <RequiredMark />
                </span>
                <input
                  name="username"
                  className="input w-full"
                  placeholder="theotravels"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  minLength={3}
                  maxLength={30}
                  required
                />
                <span className="text-xs text-ink/60">
                  Letters, numbers, dots and underscores. Friends find you by this.
                </span>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  Email
                  <RequiredMark />
                </span>
                <input
                  type="email"
                  name="email"
                  className="input w-full"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </label>

              <div className="flex flex-col gap-1">
                <label htmlFor="signup-password" className="text-sm font-medium">
                  Password
                  <RequiredMark />
                </label>
                {/* daisyUI: a label.input wraps the real input plus the eye button */}
                <div className="input w-full">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={8}
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
                <span className="text-xs text-ink/60">
                  At least 8 characters, including a letter and a number.
                </span>
              </div>
            </fieldset>

            {/* ---------- About you ---------- */}
            <fieldset className="flex flex-col gap-4">
              <legend className="mb-4 font-heading text-2xl font-semibold text-forest">
                About you
              </legend>

              <AvatarPicker file={avatarFile} onChange={setAvatarFile} />

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Home city</span>
                <div className="input w-full">
                  <MapPin className="size-4 text-ink/60" aria-hidden="true" />
                  <input
                    name="location"
                    placeholder="Your home city"
                    value={form.location}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    maxLength={100}
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Bio</span>
                <textarea
                  name="bio"
                  className="textarea w-full"
                  rows={3}
                  placeholder="A few words about you"
                  value={form.bio}
                  onChange={handleChange}
                  maxLength={BIO_MAX}
                />
                <span className="self-end text-xs text-ink/60">
                  {form.bio.length}/{BIO_MAX}
                </span>
              </label>
            </fieldset>

            {/* ---------- Terms ---------- */}
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="checkbox checkbox-sm mt-0.5"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <span>
                I agree to the Terms of Service and Privacy Policy
                <RequiredMark />
              </span>
            </label>

            {error && (
              <div role="alert" className="alert alert-error whitespace-pre-line">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" disabled={isBusy}>
              {status === "creating" && "Creating your account..."}
              {status === "uploading" && "Adding your photo..."}
              {status === "idle" && "Create account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SignUpPage;