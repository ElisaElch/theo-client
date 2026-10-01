import { ImageIcon } from "lucide-react";
import type { Photo } from "../../types/visit";
import { cloudinaryImage } from "../../utils/cloudinaryImage";

type Props = {
  photos: Photo[];
  placeName: string; // used in the image descriptions
};

// Big main photo on the left, up to 4 smaller ones on the right (like the mockup).
// If there are more than 5 photos, the last small one shows "+3" etc.
function PhotoGallery({ photos, placeName }: Props) {
  // No photos: a soft placeholder instead of an empty gap
  if (photos.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-box bg-base-200">
        <ImageIcon className="h-10 w-10 text-ink/30" />
      </div>
    );
  }

  const [mainPhoto, ...otherPhotos] = photos;
  const smallPhotos = otherPhotos.slice(0, 4);
  const hiddenCount = otherPhotos.length - smallPhotos.length;

  return (
    <div className="grid h-72 gap-2 sm:h-96 sm:grid-cols-4 sm:grid-rows-2">
      {/* Main photo: takes the left half (or everything, if it's the only one) */}
      <img
        src={cloudinaryImage(mainPhoto.url, 1200)}
        alt={`${placeName}, photo 1`}
        className={`h-full w-full rounded-box object-cover sm:row-span-2 ${
          smallPhotos.length > 0 ? "sm:col-span-2" : "sm:col-span-4"
        }`}
      />

      {/* Smaller photos: hidden on phones, where there isn't room */}
      {smallPhotos.map((photo, index) => {
        const isLast = index === smallPhotos.length - 1;

        return (
          <div key={photo.publicId} className="relative hidden sm:block">
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
  );
}

export default PhotoGallery;
