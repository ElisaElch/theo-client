import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { getMyVisits } from "../api/visits";
import VisitsMap from "../components/map/VisitsMap";
import type { PlaceType, Visit } from "../types/visit";
import { getVisitStats } from "../utils/visitStats";

const TYPE_OPTIONS: { value: PlaceType; label: string }[] = [
  { value: "cafe", label: "Cafés" },
  { value: "restaurant", label: "Restaurants" },
  { value: "hotel", label: "Hotels" },
];

// Everywhere you've been, on one map
function MapPage() {
  const [visits, setVisits] = useState<Visit[] | null>(null); // null = still loading
  const [error, setError] = useState("");
  // Which types are shown. All three start ticked.
  const [shownTypes, setShownTypes] = useState<PlaceType[]>(["cafe", "restaurant", "hotel"]);

  // Load your visits once when the page opens
  useEffect(() => {
    let ignore = false;

    getMyVisits()
      .then(({ visits }) => {
        if (!ignore) setVisits(visits);
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err.message : "Couldn't load your places");
      });

    return () => {
      ignore = true;
    };
  }, []);

  function toggleType(type: PlaceType) {
    setShownTypes((current) =>
      current.includes(type) ? current.filter((t) => t !== type) : [...current, type],
    );
  }

  // Only the visits of the ticked types
  const shownVisits = useMemo(
    () => (visits ?? []).filter((visit) => shownTypes.includes(visit.type)),
    [visits, shownTypes],
  );
  const stats = useMemo(() => getVisitStats(visits ?? []), [visits]);

  // --- Error and loading states ---
  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!visits) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-forest" />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      {/* Left: what to show, and your stats */}
      <aside className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl">Map</h1>
          <p className="mt-1 text-ink/70">Everywhere you've been.</p>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">Show on map</legend>
          {TYPE_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={shownTypes.includes(value)}
                onChange={() => toggleType(value)}
              />
              {label}
            </label>
          ))}
        </fieldset>

        {/* Stats, like the panel in the mockup */}
        <div className="card grid grid-cols-3 gap-2 bg-soft-white p-4 text-center lg:grid-cols-1 lg:gap-4">
          <div>
            <p className="font-heading text-4xl text-forest">{stats.places}</p>
            <p className="text-sm text-ink/70">{stats.places === 1 ? "place" : "places"}</p>
          </div>
          <div>
            <p className="font-heading text-4xl text-forest">{stats.cities}</p>
            <p className="text-sm text-ink/70">{stats.cities === 1 ? "city" : "cities"}</p>
          </div>
          <div>
            <p className="font-heading text-4xl text-forest">{stats.countries}</p>
            <p className="text-sm text-ink/70">{stats.countries === 1 ? "country" : "countries"}</p>
          </div>
        </div>
      </aside>

      {/* Right: the map */}
      <div className="flex flex-col gap-3">
        <VisitsMap visits={shownVisits} />

        {visits.length === 0 && (
          <p className="text-center text-ink/70">
            No places yet.{" "}
            <Link to="/places/new" className="link">
              Add your first place
            </Link>{" "}
            and it'll appear here.
          </p>
        )}
      </div>
    </div>
  );
}

export default MapPage;
