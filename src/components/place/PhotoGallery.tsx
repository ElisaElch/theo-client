import { useState, type UIEvent } from "react";
import { ImageIcon } from "lucide-react";
import type { Photo } from "../../types/visit";
import { cloudinaryImage } from "../../utils/cloudinaryImage";

type Props = {
  photos: Photo[];
  placeName: string; // used in the image descriptions
};

// Phones: a swipeable carousel with a "2 / 5" counter.
// Tablets and up: big main photo on the left, up to 4 smaller ones on the right.
function PhotoGallery({ photos, placeName }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <>
      {/* --- Phones: swipeable carousel --- */}
      <div className="relative sm:hidden">
        <div className="carousel w-full rounded-box" onScroll={handleScroll}>
          {photos.map((photo, index) => (
            <div key={photo.publicId} className="carousel-item w-full">
              <img
                src={cloudinaryImage(photo.url, 800)}
                alt={`${placeName}, photo ${index + 1}`}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          ))}
        </div>

        {photos.length > 1 && (
          <span className="badge absolute top-3 right-3 border-none bg-forest/70 text-soft-white">
            {currentIndex + 1} / {photos.length}
          </span>
        )}
      </div>

      {/* --- Tablets and up: grid --- */}
      <div className="hidden h-96 grid-cols-4 grid-rows-2 gap-2 sm:grid">
        {/* Main photo: takes the left half (or everything, if it's the only one) */}
        <img
          src={cloudinaryImage(mainPhoto.url, 1200)}
          alt={`${placeName}, photo 1`}
          className={`row-span-2 h-full w-full rounded-box object-cover ${
            smallPhotos.length > 0 ? "col-span-2" : "col-span-4"
          }`}
        />

        {smallPhotos.map((photo, index) => {
          const isLast = index === smallPhotos.length - 1;

          return (
            <div key={photo.publicId} className="relative">
              <img
                src={cloudinaryImage(photo.url, 600)}
                alt={`${placeName}, photo ${index + 2}`}
                className="h-full w-full rounded-box object-cover"
              />

              {/* "+3" on the last small photo when there are more */}
              {isLast && hiddenCount > 0 && (
                <div className="absolute inset-0 flex items-center justify-center rounded-box bg-forest/60 text-2xl font-medium text-soft-white">
                  +{hiddenCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PhotoGallery;
