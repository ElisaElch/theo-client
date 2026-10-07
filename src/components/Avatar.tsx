import { cloudinaryImage } from "../utils/cloudinaryImage";

// The four sizes used in the app. px is the photo size requested from Cloudinary:
// twice the displayed size, so photos stay sharp on high-resolution screens.
const SIZES = {
  sm: { box: "w-8", text: "text-sm", px: 64 }, // navbar
  md: { box: "w-12", text: "text-lg", px: 96 }, // activity feed
  lg: { box: "w-16", text: "text-2xl", px: 128 }, // friends grid
  xl: { box: "w-20", text: "text-3xl", px: 160 }, // profile page
};

type AvatarProps = {
  name: string; // used for the letter when there's no photo
  url?: string | null; // the profile photo, if there is one
  size: keyof typeof SIZES;
  className?: string; // extra classes for the circle, e.g. a hover ring
};

// A round profile photo, or the first letter of the name on sage if there's no photo
function Avatar({ name, url, size, className = "" }: AvatarProps) {
  const { box, text, px } = SIZES[size];

  if (url) {
    return (
      <span className="avatar">
             <span className={`block aspect-square overflow-hidden ${box} rounded-full ${className}`}>
          {/* alt="" because the name is always shown next to the avatar */}
          <img src={cloudinaryImage(url, px)} alt="" className="size-full object-cover" />
        </span>
      </span>
    );
  }

  return (
    <span className="avatar avatar-placeholder">
      <span
        className={`flex aspect-square items-center justify-center ${box} rounded-full bg-sage ${text} text-forest ${className}`}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    </span>
  );
}

export default Avatar;