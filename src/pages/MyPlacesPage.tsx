import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { getMyVisits } from "../api/visits";
import MyPlacesFilters from "../components/myPlaces/MyPlacesFilters";
import VisitCard from "../components/VisitCard";
import type { SavedFrom, Visit } from "../types/visit";
import { defaultFilters, filterVisits, type VisitFilters } from "../utils/filterVisits";
import { getVisitStats } from "../utils/visitStats";

// The "Recommended by" choice: "" = all, "me" = added by me, otherwise a friend's id
const ALL = "";
const ADDED_BY_ME = "me";

// "Where have I been?" and "Where do I want to go?": your saved places in two tabs.
// The tab is in the URL (?tab=want-to-go) so other pages can link straight to it.
function MyPlacesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [visits, setVisits] = useState<Visit[] | null>(null); // null = still loading
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<VisitFilters>(defaultFilters);
  const [recommendedBy, setRecommendedBy] = useState(ALL);

  const isWantToGoTab = searchParams.get("tab") === "want-to-go";

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

  // Back to everything (search, filters and "Recommended by")
  function clearAll() {
    setFilters(defaultFilters);
    setRecommendedBy(ALL);
  }

  // Switch tabs by changing the URL; filters start fresh on each tab
  function showTab(wantToGo: boolean) {
    setSearchParams(wantToGo ? { tab: "want-to-go" } : {});
    clearAll();
  }

  // Split your places into the two lists
  const beenHere = useMemo(
    () => (visits ?? []).filter((visit) => visit.status !== "wantToGo"),
    [visits],
  );
  const wantToGo = useMemo(
    () => (visits ?? []).filter((visit) => visit.status === "wantToGo"),
    [visits],
  );

  // Friends you've saved Want to go places from (each once, by first name)
  const recommenders = useMemo(() => {
    const byId = new Map<string, SavedFrom>();
    wantToGo.forEach(({ savedFrom }) => {
      if (savedFrom) byId.set(savedFrom._id, savedFrom);
    });
    return [...byId.values()].sort((a, b) => a.firstName.localeCompare(b.firstName));
  }, [wantToGo]);

  const currentList = isWantToGoTab ? wantToGo : beenHere;

  const shownVisits = useMemo(() => {
    if (!isWantToGoTab) return filterVisits(beenHere, filters);

    // Want to go: only the search box and "Recommended by" (date and rating don't apply)
    const searched = filterVisits(wantToGo, { ...defaultFilters, search: filters.search });
    if (recommendedBy === ALL) return searched;
    if (recommendedBy === ADDED_BY_ME) return searched.filter((visit) => !visit.savedFrom);
    return searched.filter((visit) => visit.savedFrom?._id === recommendedBy);
  }, [isWantToGoTab, wantToGo, beenHere, filters, recommendedBy]);

  // Stats only count places you've actually been to
  const stats = useMemo(() => getVisitStats(beenHere), [beenHere]);

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

  // --- Nothing saved at all yet ---
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
    <MyPlacesFilters filters={filters} onChange={updateFilters} onClear={clearAll} />
  );

  return (
    <div className={`grid gap-8 ${isWantToGoTab ? "" : "lg:grid-cols-[220px_1fr]"}`}>
      {/* Filters: sidebar on desktop (Been here only) */}
      {!isWantToGoTab && <aside className="hidden lg:block">{filters_panel}</aside>}

      <div className="flex flex-col gap-6">
        {/* Heading, tabs and stats */}
        <header className="flex flex-col gap-4">
          <div>
            <h1 className="text-5xl">My places</h1>
            <p className="mt-2 text-lg text-ink/70">
              {isWantToGoTab ? "Places you'd love to try." : "Everywhere worth remembering."}
            </p>
          </div>

          <div role="tablist" className="tabs tabs-border">
            <button
              type="button"
              role="tab"
              aria-selected={!isWantToGoTab}
              className={`tab ${!isWantToGoTab ? "tab-active" : ""}`}
              onClick={() => showTab(false)}
            >
              Been here ({beenHere.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isWantToGoTab}
              className={`tab ${isWantToGoTab ? "tab-active" : ""}`}
              onClick={() => showTab(true)}
            >
              Want to go ({wantToGo.length})
            </button>
          </div>

          {!isWantToGoTab && beenHere.length > 0 && (
            <p className="font-medium">
              {stats.places} {stats.places === 1 ? "place" : "places"} · {stats.cities}{" "}
              {stats.cities === 1 ? "city" : "cities"} · {stats.countries}{" "}
              {stats.countries === 1 ? "country" : "countries"}
            </p>
          )}
        </header>

        {currentList.length === 0 ? (
          /* This tab is empty */
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="max-w-md text-ink/70">
              {isWantToGoTab
                ? "Nothing on your Want to go list yet. Save places you'd love to try, from Add a place or from a friend's place."
                : "You haven't marked any places as visited yet."}
            </p>
            <Link to="/places/new" className="btn btn-primary">
              + Add a place
            </Link>
          </div>
        ) : (
          <>
            {/* Search, plus "Recommended by" on the Want to go tab */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="input w-full">
                <Search className="h-4 w-4 text-ink/50" />
                <input
                  type="search"
                  placeholder="Search by name, city or tag"
                  value={filters.search}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                />
              </label>

              {isWantToGoTab && recommenders.length > 0 && (
                <select
                  className="select w-full sm:w-56"
                  value={recommendedBy}
                  onChange={(e) => setRecommendedBy(e.target.value)}
                  aria-label="Recommended by"
                >
                  <option value={ALL}>All recommendations</option>
                  {recommenders.map((friend) => (
                    <option key={friend._id} value={friend._id}>
                      From {friend.firstName}
                    </option>
                  ))}
                  <option value={ADDED_BY_ME}>Added by me</option>
                </select>
              )}
            </div>

            {/* Filters: collapsible on phones and tablets (Been here only) */}
            {!isWantToGoTab && (
              <details className="collapse collapse-arrow bg-soft-white lg:hidden">
                <summary className="collapse-title font-medium">Filters</summary>
                <div className="collapse-content">{filters_panel}</div>
              </details>
            )}

            {/* Results */}
            {shownVisits.length > 0 ? (
              <>
                <p className="text-sm text-ink/70">
                  Showing {shownVisits.length} of {currentList.length}
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
                <button type="button" className="btn btn-ghost btn-sm" onClick={clearAll}>
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MyPlacesPage;