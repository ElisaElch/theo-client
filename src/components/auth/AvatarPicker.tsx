import { useEffect, useId, useMemo, useState, type ChangeEvent } from "react";
import { Camera } from "lucide-react";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB, the same limit as the API

type AvatarPickerProps = {
  file: File | null; // the chosen photo, or null
  onChange: (file: File | null) => void;
};

// Round photo preview with "Choose photo" and "Remove" buttons.
// Nothing is uploaded here; the parent decides when to upload.
function AvatarPicker({ file, onChange }: AvatarPickerProps) {
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

  return (
    <div className="flex items-center gap-4">
      {/* The round preview: the chosen photo, or a camera icon */}
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sage">
        {previewUrl ? (
          <img src={previewUrl} alt="Your chosen profile photo" className="size-full object-cover" />
        ) : (
          <Camera className="size-6 text-forest" aria-hidden="true" />
        )}
      </div>

      <div>
        <div className="flex gap-2">
          {/* The label works as the button; the real file input is hidden */}
          <label htmlFor={inputId} className="btn btn-outline btn-sm">
            {file ? "Change photo" : "Choose photo"}
          </label>
          {file && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange(null)}>
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