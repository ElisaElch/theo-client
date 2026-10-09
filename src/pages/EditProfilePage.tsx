import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { MapPin } from "lucide-react";
import { removeAvatar, updateAvatar, updateProfile } from "../api/profile";
import AvatarPicker from "../components/auth/AvatarPicker";
import { useAuth } from "../context/useAuth";

const BIO_MAX = 150; // same limit as the API

// The red-ish * after required labels (hidden from screen readers; "required" tells them)
function RequiredMark() {
  return (
    <span className="text-terracotta" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

// /profile/edit: change your photo, name, home city and bio
function EditProfilePage() {
  const { user, updateUser } = useAuth();

  // The form starts with your current details
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    location: user?.location ?? "",
    bio: user?.bio ?? "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // a new photo to upload
  const [photoRemoved, setPhotoRemoved] = useState(false); // Remove clicked on your current photo

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // The page is behind ProtectedRoute, so this only happens for a split second, if ever
  if (!user) return null;

  // Updates whichever field changed, using its name attribute
  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false); // hide "Saved" again once something changes
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setIsSaving(true);

    try {
      // 1. Name, home city and bio
      const { user: updated } = await updateProfile(form);
      updateUser(updated);

      // 2. The photo: upload a new one, or remove the old one
      if (avatarFile) {
        const { avatarUrl } = await updateAvatar(avatarFile);
        updateUser({ avatarUrl });
      } else if (photoRemoved && user?.avatarUrl) {
        await removeAvatar();
        updateUser({ avatarUrl: null });
      }

      // Start fresh: the new photo (or no photo) is now your "current" one
      setAvatarFile(null);
      setPhotoRemoved(false);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8">
      <header>
        <h1 className="font-display text-4xl tracking-tight text-forest sm:text-5xl">
          Edit profile
        </h1>
        <p className="mt-2 text-ink/80">This is how your friends see you on Theo.</p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <AvatarPicker
          file={avatarFile}
          onChange={(file) => {
            setAvatarFile(file);
            setSaved(false);
          }}
          currentUrl={photoRemoved ? null : user.avatarUrl}
          onRemoveCurrent={() => {
            setPhotoRemoved(true);
            setSaved(false);
          }}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">
              First name
              <RequiredMark />
            </span>
            <input
              name="firstName"
              className="input w-full"
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
              value={form.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              maxLength={50}
            />
          </label>
        </div>

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

        {error && (
          <div role="alert" className="alert alert-error whitespace-pre-line">
            {error}
          </div>
        )}

        {saved && (
          <div role="status" className="alert alert-success">
            Your profile has been saved.
          </div>
        )}

        <button type="submit" className="btn btn-primary self-start" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default EditProfilePage;