import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Photo } from "../../types/visit";
import { cloudinaryImage } from "../../utils/cloudinaryImage";

type Props = {
  photos: Photo[];
  placeName: string;
  startIndex: number; // which photo to open on
  onClose: () => void;
};

const SWIPE_DISTANCE = 50; // how far (in px) a finger must move to count as a swipe

// Full-screen photo viewer: one photo at a time, with arrows, keys (← → Esc) and swiping.
// The parent only shows this while it's open, so it opens itself straight away.
function PhotoViewer({ photos, placeName, startIndex, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);

  // Open as a modal as soon as it appears: the rest of the page can't be clicked,
  // focus moves into the viewer, and Esc closes it (all built into <dialog>)
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const count = photos.length;
  const photo = photos[index];

  // % count makes it wrap around: after the last photo comes the first, and the other way round
  const showPrevious = () => setIndex((i) => (i - 1 + count) % count);
  const showNext = () => setIndex((i) => (i + 1) % count);
  const close = () => dialogRef.current?.close(); // fires the dialog's onClose

  function handleKeyDown(e: KeyboardEvent<HTMLDialogElement>) {
    if (e.key === "ArrowLeft") showPrevious();
    if (e.key === "ArrowRight") showNext();
  }

  // Swiping: remember where the finger started, then compare where it ended
  function handleTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: TouchEvent) {
    if (touchStartX.current === null) return;
    const distance = e.changedTouches[0].clientX - touchStartX.current;
    if (distance < -SWIPE_DISTANCE) showNext(); // swiped left
    if (distance > SWIPE_DISTANCE) showPrevious(); // swiped right
    touchStartX.current = null;
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      aria-label={`Photos of ${placeName}`}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-ink/95 p-0 text-soft-white backdrop:bg-transparent"
    >
      <div
        className="relative flex h-full w-full items-center justify-center px-4 py-16"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        // Clicking the dark background (not the photo or a button) closes the viewer
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <img
          src={cloudinaryImage(photo.url, 1600)}
          alt={`${placeName}, photo ${index + 1} of ${count}`}
          className="max-h-full max-w-full rounded-box object-contain"
        />

        {/* Top: counter and close button */}
        <span className="absolute top-4 left-4 text-sm">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          onClick={close}
          aria-label="Close photos"
          className="btn btn-circle btn-ghost absolute top-3 right-3 text-soft-white"
        >
          <X className="size-6" />
        </button>

        {/* Arrows (only when there's more than one photo) */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous photo"
              className="btn btn-circle absolute left-3 border-none bg-soft-white/20 text-soft-white hover:bg-soft-white/30"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next photo"
              className="btn btn-circle absolute right-3 border-none bg-soft-white/20 text-soft-white hover:bg-soft-white/30"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}

export default PhotoViewer;