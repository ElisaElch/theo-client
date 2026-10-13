import { useState, type UIEvent } from "react";
import { ImageIcon } from "lucide-react";
import type { Photo } from "../../types/visit";
import { cloudinaryImage } from "../../utils/cloudinaryImage";
import PhotoViewer from "./PhotoViewer";

type Props = {
  photos: Photo[];
  placeName: string; // used in the image descriptions
};

// Phones: a swipeable carousel with a "2 / 5" counter.
// Tablets and up: big main photo on the left, up to 4 smaller ones on the right.
// Clicking any photo (including the "+3" tile) opens the full-screen viewer at that photo.
function PhotoGallery({ photos, placeName }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null); // null = viewer closed

  // No photos: a soft placeholder instead of an empty gap
  if (photos.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-box bg-base-200">
        <ImageIcon className="h-10 w-10 text-ink/30" />
      </div>
    );
  }

  // Work out which photo is showing from how far the carousel has been swiped
  function handleScroll(e: UIEvent<HTMLDivElement>) {
    const { scrollLeft, clientWidth } = e.currentTarget;
    setCurrentIndex(Math.round(scrollLeft / clientWidth));
  }

  const [mainPhoto, ...otherPhotos] = photos;
  const smallPhotos = otherPhotos.slice(0, 4);
  const hiddenCount = otherPhotos.length - smallPhotos.length;

  // Shared classes for the clickable photo buttons
  const photoButton = "block h-full w-full cursor-zoom-in overflow-hidden rounded-box";

  return (
    <>
      {/* --- Phones: swipeable carousel (tap a photo to open it full screen) --- */}
      <div className="relative sm:hidden">
        <div className="carousel w-full rounded-box" onScroll={handleScroll}>
          {photos.map((photo, index) => (
            <div key={photo.publicId} className="carousel-item w-full">
              <button
                type="button"
                onClick={() => setViewerIndex(index)}
                aria-label={`Open photo ${index + 1} of ${photos.length} full screen`}
                className="block w-full"
              >
                <img
                  src={cloudinaryImage(photo.url, 800)}
                  alt={`${placeName}, photo ${index + 1}`}
                  className="aspect-[4/3] w-full object-cover"
                />
              </button>
            </div>
          ))}
        </div>

        {photos.length > 1 && (
          <span className="badge pointer-events-none absolute top-3 right-3 border-none bg-forest/70 text-soft-white">
            {currentIndex + 1} / {photos.length}
          </span>
        )}
      </div>

      {/* --- Tablets and up: grid --- */}
      <div className="hidden h-96 grid-cols-4 grid-rows-2 gap-2 sm:grid">
        {/* Main photo: takes the left half (or everything, if it's the only one) */}
        <button
          type="button"
          onClick={() => setViewerIndex(0)}
          aria-label={`Open photo 1 of ${photos.length} full screen`}
          className={`row-span-2 ${photoButton} ${smallPhotos.length > 0 ? "col-span-2" : "col-span-4"}`}
        >
          <img
            src={cloudinaryImage(mainPhoto.url, 1200)}
            alt={`${placeName}, photo 1`}
            className="h-full w-full object-cover transition hover:scale-[1.02]"
          />
        </button>

        {smallPhotos.map((photo, index) => {
          const photoNumber = index + 2; // the main photo is number 1
          const isLast = index === smallPhotos.length - 1;
          const showMore = isLast && hiddenCount > 0;

          return (
            <button
              key={photo.publicId}
              type="button"
              onClick={() => setViewerIndex(index + 1)}
              aria-label={
                showMore
                  ? `Open photo ${photoNumber} and ${hiddenCount} more full screen`
                  : `Open photo ${photoNumber} of ${photos.length} full screen`
              }
              className={`relative ${photoButton}`}
            >
              <img
                src={cloudinaryImage(photo.url, 600)}
                alt={`${placeName}, photo ${photoNumber}`}
                className="h-full w-full object-cover transition hover:scale-[1.02]"
              />

              {/* "+3" on the last small photo when there are more: clicking it opens the viewer here,
                  and the arrows carry on through the rest */}
              {showMore && (
                <span className="absolute inset-0 flex items-center justify-center bg-forest/60 text-2xl font-medium text-soft-white">
                  +{hiddenCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* The full-screen viewer, only while it's open */}
      {viewerIndex !== null && (
        <PhotoViewer
          photos={photos}
          placeName={placeName}
          startIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </>
  );
}

export default PhotoGallery;
