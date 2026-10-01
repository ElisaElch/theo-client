import { useState, type KeyboardEvent } from "react";
import { searchLocations, type LocationResult } from "../../api/locationSearch";

type Props = {
  onSelect: (result: LocationResult) => void;
};

// Search box + results list. Searches on Enter or the button, never while typing.
function LocationSearch({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!query.trim()) return;

    setIsSearching(true);
    setError("");

    try {
      setResults(await searchLocations(query.trim()));
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsSearching(false);
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
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          className="input w-full"
          placeholder="e.g. Lune Café Melbourne"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

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
