import { Link } from "react-router";
import { CalendarDays, Heart, ImageIcon, MapPin } from "lucide-react";
import type { FriendVisit } from "../types/friends";
import { cloudinaryImage } from "../utils/cloudinaryImage";
import { formatDate } from "../utils/formatDate";
import StarRating from "./StarRating";

const TYPE_LABELS = { cafe: "Café", restaurant: "Restaurant", hotel: "Hotel" };

type Props = {
  // Your own visit (with a date), or a friend's visit (without one)
  visit: FriendVisit & { visitDate?: string };
  // Where the card links to. No link = a plain card (e.g. friends' places for now)
  to?: string;
};

// One place in a grid: photo, name, location, date (own visits only), stars, a bit of the memory
function VisitCard({ visit, to }: Props) {
  const { place } = visit;
  const coverPhoto = visit.photos[0];

  const content = (
    <>
      {/* Photo, with the favourite heart in the corner */}
      <div className="relative">
        {coverPhoto ? (
          <img
            src={cloudinaryImage(coverPhoto.url, 600)}
            alt=""
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-base-200">
            <ImageIcon className="h-8 w-8 text-ink/30" />
          </div>
        )}

        {visit.isFavourite && (
          <span className="absolute top-3 right-3 rounded-full bg-soft-white p-1.5">
            <Heart className="h-4 w-4 fill-terracotta text-terracotta" aria-label="Favourite" />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-sans text-lg font-medium text-ink">{place.name}</h3>

        <p className="flex items-center gap-1 text-sm text-ink/70">
          <MapPin className="h-3.5 w-3.5" />
          {[place.city, place.country].filter(Boolean).join(", ")}
        </p>

        {/* Only your own visits have a date (friends never see when) */}
        {visit.visitDate && (
          <p className="flex items-center gap-1 text-sm text-ink/70">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(visit.visitDate)}
          </p>
        )}

        {visit.rating && <StarRating rating={visit.rating} size="sm" />}

        {/* First couple of lines of the memory */}
        {visit.memory && <p className="line-clamp-2 text-sm text-ink/80">{visit.memory}</p>}

        <div className="mt-1 flex flex-wrap gap-1">
          <span className="badge badge-secondary badge-sm">{TYPE_LABELS[visit.type]}</span>
          {visit.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="badge badge-sm bg-base-200">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  const cardClass = "card overflow-hidden bg-soft-white";

  // With a link: the whole card is clickable, with a hover lift
  if (to) {
    return (
      <Link to={to} className={`${cardClass} transition hover:-translate-y-1 hover:shadow-md`}>
        {content}
      </Link>
    );
  }

  // Without a link: a plain card
  return <div className={cardClass}>{content}</div>;
}

export default VisitCard;
