import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Search } from "lucide-react";
import { getMyVisits } from "../api/visits";
import MyPlacesFilters from "../components/myPlaces/MyPlacesFilters";
import VisitCard from "../components/VisitCard";
import type { Visit } from "../types/visit";
import { defaultFilters, filterVisits, type VisitFilters } from "../utils/filterVisits";
import { getVisitStats } from "../utils/visitStats";

// "Where have I been?": all your saved places, with search and filters
function MyPlacesPage() {
  const [visits, setVisits] = useState<Visit[] | null>(null); // null = still loading
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<VisitFilters>(defaultFilters);

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

  function updateFilters(changes: Partial<VisitFilters>) {
    setFilters((current) => ({ ...current, ...changes }));
  }

  // Only re-filter when the visits or the filters change, not on every render
  const shownVisits = useMemo(() => filterVisits(visits ?? [], filters), [visits, filters]);
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

  // --- Nothing saved yet ---
  if (visits.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <h1>My places</h1>
        <p className="max-w-md text-ink/70">
          Your memory book is empty. Add the first café, restaurant or hotel you'd like to remember.
        </p>
        <Link to="/places/new" className="btn btn-primary">
          + Add your first place
        </Link>
      </div>
    );
  }

  const filters_panel = (
    <MyPlacesFilters
      filters={filters}
      onChange={updateFilters}
      onClear={() => setFilters(defaultFilters)}
    />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      {/* Filters: sidebar on desktop */}
      <aside className="hidden lg:block">{filters_panel}</aside>

      <div className="flex flex-col gap-6">
        {/* Heading and stats */}
        <header>
          <h1 className="text-5xl">My places</h1>
          <p className="mt-2 text-lg text-ink/70">Everywhere worth remembering.</p>
          <p className="mt-4 font-medium">
            {stats.places} {stats.places === 1 ? "place" : "places"} · {stats.cities}{" "}
            {stats.cities === 1 ? "city" : "cities"} · {stats.countries}{" "}
            {stats.countries === 1 ? "country" : "countries"}
          </p>
        </header>

        {/* Search */}
        <label className="input w-full">
          <Search className="h-4 w-4 text-ink/50" />
          <input
            type="search"
            placeholder="Search by name, city or tag"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </label>

        {/* Filters: collapsible on phones and tablets */}
        <details className="collapse collapse-arrow bg-soft-white lg:hidden">
          <summary className="collapse-title font-medium">Filters</summary>
          <div className="collapse-content">{filters_panel}</div>
        </details>

        {/* Results */}
        {shownVisits.length > 0 ? (
          <>
            <p className="text-sm text-ink/70">
              Showing {shownVisits.length} of {visits.length}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {shownVisits.map((visit) => (
                <VisitCard key={visit._id} visit={visit} to={`/places/${visit._id}`} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-ink/70">No places match your search or filters.</p>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setFilters(defaultFilters)}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPlacesPage;
