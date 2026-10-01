import { useState, type KeyboardEvent } from "react";
import { LocateFixed } from "lucide-react";
import { reverseGeocode, searchLocations, type LocationResult } from "../../api/locationSearch";

type Props = {
  onSelect: (result: LocationResult) => void;
};

// Positions less accurate than this (in metres) get a warning
const ACCURATE_ENOUGH = 500;

// Search box, "use my current location", and the results list.
// Searches on Enter or the button, never while typing.
function LocationSearch({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(""); // e.g. "only approximate"

  async function handleSearch() {
    if (!query.trim()) return;

    setIsBusy(true);
    setError("");
    setNotice("");

    try {
      setResults(await searchLocations(query.trim()));
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
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

  function handleSelect(result: LocationResult) {
    onSelect(result);
    setQuery(result.name);
    setResults([]);
    setHasSearched(false);
    setNotice("");
  }

  // Asks the browser for the user's position (it asks for permission first),
  // then looks up the address there
  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Your browser can't share your location.");
      return;
    }

    setIsBusy(true);
    setError("");
    setNotice("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // accuracy = how sure the device is, in metres (smaller is better)
        const { latitude, longitude, accuracy } = position.coords;

        try {
          const result = await reverseGeocode(latitude, longitude);
          onSelect(result);
          setResults([]);

          // Laptops without GPS often only know roughly where they are
          if (accuracy > ACCURATE_ENOUGH) {
            const distance =
              accuracy >= 1000 ? `${Math.round(accuracy / 1000)} km` : `${Math.round(accuracy)} m`;
            setNotice(
              `This is only your approximate location (within about ${distance}). Click the map or drag the pin to the exact spot.`,
            );
          }
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

      {/* Results list */}
      {results.length > 0 && (
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
      )}

      {hasSearched && results.length === 0 && (
        <p className="text-sm text-ink/70">
          No results. Try adding the city, or search for the street address instead.
        </p>
      )}
    </div>
  );
}

export default LocationSearch;
