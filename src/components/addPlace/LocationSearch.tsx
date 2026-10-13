import { useState, type KeyboardEvent } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import {
  reverseGeocode,
  searchLocations,
  searchNearby,
  type LocationResult,
  type NearbyResult,
} from "../../api/locationSearch";
import { searchTheoPlaces } from "../../api/places";
import type { PlaceType } from "../../types/visit";

type Props = {
  type: PlaceType | ""; // which kind of places to suggest nearby
  onSelect: (result: LocationResult) => void;
};

// Positions less accurate than this (in metres) get a warning
const ACCURATE_ENOUGH = 500;

// Labels for the nearby list heading and the "none found" message
const NEARBY_LABELS: Record<PlaceType, string> = {
  cafe: "cafés",
  restaurant: "restaurants",
  hotel: "hotels",
};

// "40 m" or "1.2 km"
function formatDistance(metres: number): string {
  return metres < 1000 ? `${Math.round(metres)} m` : `${(metres / 1000).toFixed(1)} km`;
}

// Search box, "use my current location" (with nearby suggestions), and the results lists.
// Searches on Enter or the button, never while typing.
function LocationSearch({ type, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [theoResults, setTheoResults] = useState<LocationResult[]>([]); // already on Theo
  const [results, setResults] = useState<LocationResult[]>([]); // from OpenStreetMap
  const [nearby, setNearby] = useState<NearbyResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasSearchedNearby, setHasSearchedNearby] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(""); // e.g. "only approximate"

  const nearbyType: PlaceType = type || "cafe"; // cafés if no type is chosen yet

  // Searches Theo and OpenStreetMap at the same time
  async function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsBusy(true);
    setError("");
    setNotice("");
    setNearby([]);
    setHasSearchedNearby(false);

    try {
      // allSettled waits for both and never throws, so if one search fails
      // (e.g. the API is still waking up) the other one's results still show
      const [theoOutcome, osmOutcome] = await Promise.allSettled([
        searchTheoPlaces(trimmed),
        searchLocations(trimmed),
      ]);

      const theoPlaces = theoOutcome.status === "fulfilled" ? theoOutcome.value : [];
      setTheoResults(theoPlaces);

      if (osmOutcome.status === "fulfilled") {
        // A place that's already on Theo shows only once, in the "On Theo" list
        const theoIds = new Set(theoPlaces.map((place) => place.externalId));
        setResults(osmOutcome.value.filter((result) => !theoIds.has(result.externalId)));
        setHasSearched(true);
      } else {
        setResults([]);
        setError(osmOutcome.reason instanceof Error ? osmOutcome.reason.message : "Search failed");
      }
    } finally {
      setIsBusy(false);
    }
  }

  // Enter searches (and doesn't submit anything else on the page)
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  }

  // A Theo place, a search result or a nearby place was picked
  function handleSelect(result: LocationResult) {
    onSelect(result);
    setQuery(result.name);
    setTheoResults([]);
    setResults([]);
    setNearby([]);
    setHasSearched(false);
    setHasSearchedNearby(false);
    setNotice("");
  }

  // Asks the browser for the user's position (it asks for permission first),
  // looks up the address there, then suggests the closest places
  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Your browser can't share your location.");
      return;
    }

    setIsBusy(true);
    setError("");
    setNotice("");
    setTheoResults([]);
    setResults([]);
    setHasSearched(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // accuracy = how sure the device is, in metres (smaller is better)
        const { latitude, longitude, accuracy } = position.coords;

        try {
          const result = await reverseGeocode(latitude, longitude);
          onSelect(result);

          // Laptops without GPS often only know roughly where they are
          if (accuracy > ACCURATE_ENOUGH) {
            const distance =
              accuracy >= 1000 ? `${Math.round(accuracy / 1000)} km` : `${Math.round(accuracy)} m`;
            setNotice(
              `This is only your approximate location (within about ${distance}). Click the map or drag the pin to the exact spot.`,
            );
          }

          // Suggest the closest places. If this fails, the user can still search or use the pin.
          try {
            setNearby(await searchNearby(latitude, longitude, nearbyType));
          } catch {
            setNearby([]);
          }
          setHasSearchedNearby(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Couldn't look up your location.");
        } finally {
          setIsBusy(false);
        }
      },
      () => {
        setError("Couldn't get your location. Check that location access is allowed.");
        setIsBusy(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          className="input w-full"
          placeholder="Name and city, e.g. Lune Café Melbourne"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleSearch}
          disabled={isBusy}
        >
          {isBusy ? "Searching..." : "Search"}
        </button>
      </div>

      <p className="text-xs text-ink/60">
        Can't find it? Try the street address instead, then click the map or drag the pin to the
        exact spot.
      </p>

      <button
        type="button"
        className="btn btn-ghost btn-sm self-start"
        onClick={handleUseCurrentLocation}
        disabled={isBusy}
      >
        <LocateFixed className="h-4 w-4" />
        Use my current location
      </button>

      {error && <p className="text-sm text-error">{error}</p>}

      {notice && (
        <div role="status" className="alert alert-warning text-sm">
          {notice}
        </div>
      )}

      {/* Nearby places, after "Use my current location" */}
      {nearby.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">
            Are you at one of these {NEARBY_LABELS[nearbyType]}?
          </p>
          <ul className="menu w-full rounded-box border border-base-300 bg-soft-white">
            {nearby.map((place) => (
              <li key={place.externalId}>
                <button type="button" onClick={() => handleSelect(place)}>
                  <MapPin className="h-4 w-4 shrink-0 text-forest" />
                  <span className="flex flex-col items-start">
                    <span className="font-medium">{place.name}</span>
                    <span className="text-xs text-ink/60">
                      {formatDistance(place.distance)} away
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nothing nearby: say so, instead of showing nothing */}
      {hasSearchedNearby && nearby.length === 0 && (
        <p className="text-sm text-ink/70">
          No {NEARBY_LABELS[nearbyType]} found within 400 m. Search by name or drop the pin instead.
        </p>
      )}

      {/* Places already saved on Theo (by anyone), shown first */}
      {theoResults.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">On Theo</p>
          <ul className="menu w-full rounded-box border border-base-300 bg-soft-white">
            {theoResults.map((place) => (
              <li key={place.externalId}>
                <button type="button" onClick={() => handleSelect(place)}>
                  <MapPin className="h-4 w-4 shrink-0 text-forest" />
                  <span className="flex flex-col items-start">
                    <span className="font-medium">{place.name}</span>
                    <span className="text-xs text-ink/60">{place.label}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* OpenStreetMap results */}
      {results.length > 0 && (
        <div className="flex flex-col gap-1">
          {/* Only needs a heading when there's an "On Theo" list above it */}
          {theoResults.length > 0 && <p className="text-sm font-medium">More places</p>}
          <ul className="menu w-full rounded-box border border-base-300 bg-soft-white">
            {results.map((result) => (
              <li key={result.externalId}>
                <button type="button" onClick={() => handleSelect(result)}>
                  <span className="flex flex-col items-start">
                    <span className="font-medium">{result.name}</span>
                    <span className="text-xs text-ink/60">{result.label}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasSearched && theoResults.length === 0 && results.length === 0 && (
        <p className="text-sm text-ink/70">
          No results. Try adding the city, or search for the street address instead.
        </p>
      )}
    </div>
  );
}

export default LocationSearch;
