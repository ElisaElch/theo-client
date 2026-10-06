import { Link } from "react-router";
import { ImageIcon, MapPin } from "lucide-react";
import type { FeedItem } from "../../types/friends";
import { cloudinaryImage } from "../../utils/cloudinaryImage";
import StarRating from "../StarRating";

const TYPE_LABELS = { cafe: "Café", restaurant: "Restaurant", hotel: "Hotel" };

// One row of the activity feed: "Emma visited Da Adolfo", with a bit of her memory.
// No timestamps: friends never see WHEN someone was somewhere.
function ActivityItem({ item }: { item: FeedItem }) {
  const { friend, visit } = item;
  const { place } = visit;
  const firstName = friend.name.split(" ")[0];
  const verb = visit.type === "hotel" ? "stayed at" : "visited"; // "Tom stayed at Casa Zur"
  const coverPhoto = visit.photos[0];

  return (
    <div className="flex gap-4">
      {/* Who */}
      <Link
        to={`/friends/${friend.id}`}
        className="flex w-24 shrink-0 flex-col items-center gap-1 text-center"
      >
        <span className="avatar avatar-placeholder">
          <span className="w-12 rounded-full bg-sage text-lg text-forest">
            {friend.name.charAt(0).toUpperCase()}
          </span>
        </span>
        <span className="text-sm">
          <span className="font-medium">{firstName}</span> {verb}
        </span>
      </Link>

      {/* What: the whole card opens their place */}
      <Link
        to={`/friends/${friend.id}/places/${visit._id}`}
        className="card flex flex-1 flex-row overflow-hidden bg-soft-white transition hover:shadow-md"
      >
        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="font-sans text-base font-medium text-ink">{place.name}</h3>
          <p className="flex items-center gap-1 text-xs text-ink/70">
            <MapPin className="h-3 w-3" />
            {[place.city, place.country].filter(Boolean).join(", ")}
          </p>
          {visit.rating && <StarRating rating={visit.rating} size="sm" />}
          {visit.memory && (
            <p className="line-clamp-2 text-sm italic text-ink/80">"{visit.memory}"</p>
          )}
          <div className="mt-1 flex flex-wrap gap-1">
            <span className="badge badge-secondary badge-sm">{TYPE_LABELS[visit.type]}</span>
            {visit.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="badge badge-sm bg-base-200">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Photo on the right, hidden on very small screens */}
        <div className="hidden w-32 shrink-0 sm:block">
          {coverPhoto ? (
            <img
              src={cloudinaryImage(coverPhoto.url, 300)}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-base-200">
              <ImageIcon className="h-6 w-6 text-ink/30" />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default ActivityItem;
