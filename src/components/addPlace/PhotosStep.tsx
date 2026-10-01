import { useState, type ChangeEvent } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { ImagePlus } from "lucide-react";
import { cloudinaryImage } from "../../utils/cloudinaryImage";
import type { StepProps } from "./formTypes";
import SortablePhoto from "./SortablePhoto";

// Same limits as the API
const MAX_PHOTOS = 12;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Step 3: pick photos, see previews straight away, and drag them into order.
// The first photo is the cover. Uploading happens on Save.
function PhotosStep({ form, updateForm }: StepProps) {
  const [error, setError] = useState("");

  // How a drag can start:
  // - mouse: after moving 5px (so a normal click doesn't start a drag)
  // - touch: after holding for 200ms (so swiping still scrolls the page)
  // - keyboard: Space to pick up, arrow keys to move, Space to drop
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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

  // A photo was dropped: move it from its old position to the new one
  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;

    const oldIndex = form.photos.findIndex((photo) => photo.previewUrl === active.id);
    const newIndex = form.photos.findIndex((photo) => photo.previewUrl === over.id);
    updateForm({ photos: arrayMove(form.photos, oldIndex, newIndex) });
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl">Photos</h2>
      <p className="text-ink/70">
        A few photos help you remember the details. Up to 12. Drag them to change the order: the
        first one is your cover photo.
      </p>

      {/* Sortable preview grid */}
      {form.photos.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={form.photos.map((photo) => photo.previewUrl)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {form.photos.map((photo, index) => (
                <SortablePhoto
                  key={photo.previewUrl}
                  id={photo.previewUrl}
                  // Existing photos: ask Cloudinary for a small version
                  src={photo.uploaded ? cloudinaryImage(photo.uploaded.url, 400) : photo.previewUrl}
                  alt={`Photo ${index + 1}`}
                  isCover={index === 0}
                  onRemove={() => removePhoto(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
