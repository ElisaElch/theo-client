import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, CalendarDays, Heart, MapPin } from "lucide-react";
import { getVisit } from "../api/visits";
import StarRating from "../components/StarRating";
import MiniMap from "../components/map/MiniMap";
import PhotoGallery from "../components/place/PhotoGallery";
import type { Visit } from "../types/visit";
import { formatDate } from "../utils/formatDate";

const TYPE_LABELS = { cafe: "Café", restaurant: "Restaurant", hotel: "Hotel" };

// One of your saved places: photos, your visit, and where it is.
// The URL is /places/VISIT_ID
function PlacePage() {
  const { id } = useParams();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [error, setError] = useState("");

  // Load the visit when the page opens (or when the id in the URL changes)
  useEffect(() => {
    if (!id) return;
    let ignore = false; // stops a slow, outdated response from overwriting a newer one

    getVisit(id)
      .then(({ visit }) => {
        if (!ignore) setVisit(visit);
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err.message : "Couldn't load this place");
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  // --- Error and loading states ---
  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <h1>Place not found</h1>
        <p className="text-ink/70">{error}</p>
        <Link to="/my-places" className="btn btn-primary">
          Back to My Places
        </Link>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-forest" />
      </div>
    );
  }

  const { place } = visit;

  return (
    <div className="flex flex-col gap-8">
      <Link to="/my-places" className="flex items-center gap-1 text-sm hover:text-forest">
        <ArrowLeft className="h-4 w-4" />
        Back to My Places
      </Link>

      <PhotoGallery photos={visit.photos} placeName={place.name} />

      {/* Heading: name, location, type, favourite, tags */}
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-5xl">{place.name}</h1>
          {visit.isFavourite && (
            <Heart
              className="h-6 w-6 fill-terracotta text-terracotta"
              aria-label="One of your favourites"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-ink/70">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {[place.city, place.country].filter(Boolean).join(", ")}
          </span>
          <span className="badge badge-secondary">{TYPE_LABELS[place.type]}</span>
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
        {/* Left: your visit */}
        <section className="card flex flex-col gap-4 bg-soft-white p-6">
          <h2 className="text-3xl">Your visit</h2>

          {visit.visitDate && (
            <p className="flex items-center gap-2 text-ink/70">
              <CalendarDays className="h-4 w-4" />
              Visited {formatDate(visit.visitDate)}
            </p>
          )}

          {visit.rating && <StarRating rating={visit.rating} />}

          {visit.rating === 11 && visit.exceptionalReason && (
            <p className="italic text-terracotta">Exceptional because: {visit.exceptionalReason}</p>
          )}

          {visit.whatIHad && (
            <div>
              <h3 className="text-sm font-medium">What I had</h3>
              <p>{visit.whatIHad}</p>
            </div>
          )}

          {visit.memory && (
            <div>
              <h3 className="text-sm font-medium">My memory</h3>
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

export default PlacePage;
