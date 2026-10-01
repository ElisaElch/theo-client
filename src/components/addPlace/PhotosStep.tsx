import { useState, type ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { cloudinaryImage } from "../../utils/cloudinaryImage";
import type { StepProps } from "./formTypes";

// Same limits as the API
const MAX_PHOTOS = 12;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Step 3: pick photos and see previews straight away (uploading happens on Save).
// When editing, already-uploaded photos are shown too and can be removed.
function PhotosStep({ form, updateForm }: StepProps) {
  const [error, setError] = useState("");

  function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ""; // reset, so picking the same file again still works
    setError("");

    // Check size and count here, so users don't wait for an upload that will fail
    const tooBig = picked.filter((file) => file.size > MAX_FILE_SIZE);
    const okFiles = picked.filter((file) => file.size <= MAX_FILE_SIZE);
    const spaceLeft = MAX_PHOTOS - form.photos.length;

    if (tooBig.length > 0) setError("Some photos were over 10 MB and were skipped.");
    if (okFiles.length > spaceLeft) setError(`You can add up to ${MAX_PHOTOS} photos.`);

    // Create a temporary local URL for each new photo, for an instant preview
    const newPhotos = okFiles.slice(0, spaceLeft).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    updateForm({ photos: [...form.photos, ...newPhotos] });
  }

  function removePhoto(index: number) {
    const photo = form.photos[index];

    // Only new photos have a temporary local URL to free.
    // Existing photos are removed from Cloudinary by the API when saving.
    if (photo.file) URL.revokeObjectURL(photo.previewUrl);

    updateForm({ photos: form.photos.filter((_, i) => i !== index) });
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl">Photos</h2>
      <p className="text-ink/70">A few photos help you remember the details. Up to 12.</p>

      {/* Preview grid */}
      {form.photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {form.photos.map((photo, index) => (
            <div key={photo.previewUrl} className="relative">
              <img
                // Existing photos: ask Cloudinary for a small version
                src={photo.uploaded ? cloudinaryImage(photo.uploaded.url, 400) : photo.previewUrl}
                alt={`Photo ${index + 1}`}
                className="aspect-square w-full rounded-box object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="btn btn-circle btn-sm absolute top-2 right-2"
                aria-label={`Remove photo ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Picker: a styled label wrapping a hidden file input */}
      {form.photos.length < MAX_PHOTOS && (
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-box border-2 border-dashed border-base-300 p-8 hover:border-sage">
          <ImagePlus className="h-8 w-8 text-forest" />
          <span className="font-medium">Add photos</span>
          <span className="text-xs text-ink/60">JPG, PNG or WebP, up to 10 MB each</span>
          <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
        </label>
      )}

      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}

export default PhotosStep;
