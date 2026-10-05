import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Heart, MapPin } from "lucide-react";
import { getFriendVisit } from "../api/friends";
import StarRating from "../components/StarRating";
import MiniMap from "../components/map/MiniMap";
import PhotoGallery from "../components/place/PhotoGallery";
import type { FriendVisitResponse } from "../types/friends";

const TYPE_LABELS = { cafe: "Café", restaurant: "Restaurant", hotel: "Hotel" };

// One of a friend's places, in full. Read-only: no edit or delete, and no dates.
// The URL is /friends/FRIEND_ID/places/VISIT_ID
function FriendVisitPage() {
  const { userId, visitId } = useParams();
  const [data, setData] = useState<FriendVisitResponse | null>(null);
  const [error, setError] = useState("");

  // Load the visit when the page opens (or a different one is opened)
  useEffect(() => {
    if (!userId || !visitId) return;
    let ignore = false;

    getFriendVisit(userId, visitId)
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err.message : "Couldn't load this place");
      });

    return () => {
      ignore = true;
    };
  }, [userId, visitId]);

  // --- Error and loading states ---
  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <h1>Place not found</h1>
        <p className="text-ink/70">You can only see the places of people you're friends with.</p>
        <Link to="/friends" className="btn btn-primary">
          Back to Friends
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-forest" />
      </div>
    );
  }

  const { friend, visit } = data;
  const { place } = visit;
  const firstName = friend.name.split(" ")[0];

  return (
    <div className="flex flex-col gap-8">
      <Link
        to={`/friends/${friend.id}`}
        className="flex items-center gap-1 text-sm hover:text-forest"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {firstName}'s places
      </Link>

      <PhotoGallery photos={visit.photos} placeName={place.name} />

      {/* Heading: name, location, their type, their favourite, their tags */}
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl sm:text-5xl">{place.name}</h1>
          {visit.isFavourite && (
            <Heart
              className="h-6 w-6 fill-terracotta text-terracotta"
              aria-label={`One of ${firstName}'s favourites`}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-ink/70">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {[place.city, place.country].filter(Boolean).join(", ")}
          </span>
          <span className="badge badge-secondary">{TYPE_LABELS[visit.type]}</span>
        </div>

        {visit.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visit.tags.map((tag) => (
              <span key={tag} className="badge bg-base-200">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
        {/* Left: their visit (no date: friends never see when) */}
        <section className="card flex flex-col gap-4 bg-soft-white p-6">
          <h2 className="text-3xl">{firstName}'s visit</h2>

          {visit.rating && <StarRating rating={visit.rating} />}

          {visit.rating === 11 && visit.exceptionalReason && (
            <p className="italic text-terracotta">Exceptional because: {visit.exceptionalReason}</p>
          )}

          {visit.whatIHad && (
            <div>
              <h3 className="text-sm font-medium">What {firstName} had</h3>
              <p>{visit.whatIHad}</p>
            </div>
          )}

          {visit.memory && (
            <div>
              <h3 className="text-sm font-medium">{firstName}'s memory</h3>
              <p className="whitespace-pre-line italic">"{visit.memory}"</p>
            </div>
          )}
        </section>

        {/* Right: where it is */}
        <aside className="flex flex-col gap-2">
          <MiniMap lat={place.coordinates.lat} lng={place.coordinates.lng} />
          <p className="text-sm text-ink/70">
            {[place.city, place.country].filter(Boolean).join(", ")}
          </p>
        </aside>
      </div>
    </div>
  );
}

export default FriendVisitPage;
