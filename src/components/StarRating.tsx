import { Star } from "lucide-react";

type Props = {
  rating: number; // 1–10, or 11 for exceptional
  size?: "sm" | "md";
};

// Shows a rating as 10 stars, plus a terracotta 11th star for exceptional places.
// Display only. The Experience step has its own clickable version.
function StarRating({ rating, size = "md" }: Props) {
  const filled = Math.min(rating, 10);
  const isExceptional = rating === 11;
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={
        isExceptional ? "10 out of 10, plus the exceptional star" : `${rating} out of 10 stars`
      }
    >
      {/* Stars 1–10 */}
      {Array.from({ length: 10 }, (_, index) => (
        <Star
          key={index}
          className={`${iconSize} ${
            index < filled ? "fill-amber-400 text-amber-400" : "text-base-300"
          }`}
        />
      ))}

      {/* The 11th star: bigger and terracotta, so it stands out */}
      {isExceptional && (
        <Star
          className={`ml-1 ${size === "sm" ? "h-5 w-5" : "h-7 w-7"} fill-terracotta text-terracotta`}
        />
      )}
    </span>
  );
}

export default StarRating;
