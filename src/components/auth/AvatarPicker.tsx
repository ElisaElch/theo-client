import { useEffect, useId, useMemo, useState, type ChangeEvent } from "react";
import { Camera } from "lucide-react";
import { cloudinaryImage } from "../../utils/cloudinaryImage";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB, the same limit as the API

type AvatarPickerProps = {
  file: File | null; // a newly chosen photo, or null
  onChange: (file: File | null) => void;
  currentUrl?: string | null; // the photo you already have (Edit profile only)
  onRemoveCurrent?: () => void; // Remove clicked on that existing photo (Edit profile only)
};

// Round photo preview with "Choose photo" and "Remove" buttons.
// Nothing is uploaded here; the parent decides when to upload.
function AvatarPicker({ file, onChange, currentUrl, onRemoveCurrent }: AvatarPickerProps) {
  const inputId = useId();
  const [error, setError] = useState("");

  // A temporary local address for the chosen file, so it can be shown instantly
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  // Free that temporary address when the photo changes or the page closes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const chosen = e.target.files?.[0];
    e.target.value = ""; // lets you choose the same file again after removing it
    if (!chosen) return;

    if (chosen.size > MAX_SIZE) {
      setError("That photo is over 10 MB. Please choose a smaller one.");
      return;
    }

    setError("");
    onChange(chosen);
  }

  // Remove: undo a newly chosen file, or (on Edit profile) remove the existing photo
  function handleRemove() {
    if (file) onChange(null);
    else onRemoveCurrent?.();
  }

  // What to show in the circle: the new file first, then the existing photo
  const shownUrl = previewUrl ?? (currentUrl ? cloudinaryImage(currentUrl, 160) : null);
  const hasPhoto = Boolean(file || currentUrl);

  return (
    <div className="flex items-center gap-4">
      {/* The round preview: a photo, or a camera icon */}
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sage">
        {shownUrl ? (
          <img src={shownUrl} alt="Your profile photo" className="size-full object-cover" />
        ) : (
          <Camera className="size-6 text-forest" aria-hidden="true" />
        )}
      </div>

      <div>
        <div className="flex gap-2">
          {/* The label works as the button; the real file input is hidden */}
          <label htmlFor={inputId} className="btn btn-outline btn-sm">
            {hasPhoto ? "Change photo" : "Choose photo"}
          </label>
          {hasPhoto && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleRemove}>
              Remove
            </button>
          )}
        </div>

        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleChange}
        />

        {error ? (
          <p role="alert" className="mt-1 text-xs text-error">
            {error}
          </p>
        ) : (
          <p className="mt-1 text-xs text-ink/60">JPG, PNG or WebP, up to 10 MB.</p>
        )}
      </div>
    </div>
  );
}

export default AvatarPicker;