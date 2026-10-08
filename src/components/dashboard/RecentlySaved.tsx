import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ImageIcon, Plus } from "lucide-react";
import { getMyVisits } from "../../api/visits";
import type { Visit } from "../../types/visit";
import { cloudinaryImage } from "../../utils/cloudinaryImage";

const HOW_MANY = 4;

// Your four most recently saved places, each linking to its place page
function RecentlySaved() {
  const [visits, setVisits] = useState<Visit[] | null>(null); // null = still loading
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false; // stops an old request updating the page after it's been left

    getMyVisits()
      .then(({ visits }) => {
        if (ignore) return;
        // Newest saved first (createdAt), only places you've been to
        const recent = visits
          .filter((visit) => visit.status === "visited")
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, HOW_MANY);
        setVisits(recent);
      })
      .catch(() => {
        if (!ignore) setError("Your places couldn't be loaded. Try refreshing the page.");
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-heading text-3xl font-semibold text-forest">Recently saved</h2>
        {visits && visits.length > 0 && (
          <Link to="/my-places" className="flex items-center gap-1 text-sm font-medium text-forest">
            View all <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      {/* Loading: four grey placeholders the same shape as the cards */}
      {!error && visits === null && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: HOW_MANY }, (_, i) => (
            <div key={i} className="skeleton aspect-[4/3] w-full rounded-2xl" />
          ))}
        </div>
      )}

      {/* Empty: a friendly prompt instead of an empty row */}
      {visits && visits.length === 0 && (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-base-300 p-6">
          <p className="text-ink/80">You haven't saved any places yet. Start with one you loved.</p>
          <Link to="/places/new" className="btn btn-primary btn-sm">
            <Plus className="size-4" aria-hidden="true" />
            Save your first place
          </Link>
        </div>
      )}

      {/* The cards */}
      {visits && visits.length > 0 && (
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {visits.map((visit) => {
            const photo = visit.photos[0];
            return (
              <li key={visit._id}>
                <Link to={`/places/${visit._id}`} className="group flex flex-col gap-2">
                  {photo ? (
                    <img
                      src={cloudinaryImage(photo.url, 600)}
                      alt=""
                      className="aspect-[4/3] w-full rounded-2xl object-cover transition group-hover:opacity-90"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-base-200">
                      <ImageIcon className="size-8 text-ink/30" aria-hidden="true" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-ink group-hover:text-forest">{visit.place.name}</p>
                    <p className="text-sm text-ink/70">
                      {[visit.place.city, visit.place.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default RecentlySaved;