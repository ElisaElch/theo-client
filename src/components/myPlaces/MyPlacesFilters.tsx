import { useId } from "react";
import type { PlaceType } from "../../types/visit";
import type { VisitFilters } from "../../utils/filterVisits";

type Props = {
  filters: VisitFilters;
  onChange: (changes: Partial<VisitFilters>) => void;
  onClear: () => void;
};

const TYPE_OPTIONS: { value: PlaceType; label: string }[] = [
  { value: "cafe", label: "Cafés" },
  { value: "restaurant", label: "Restaurants" },
  { value: "hotel", label: "Hotels" },
];

const RATING_OPTIONS = [
  { value: 0, label: "Any rating" },
  { value: 9, label: "9+ stars" },
  { value: 7, label: "7+ stars" },
  { value: 5, label: "5+ stars" },
  { value: 11, label: "Exceptional only" },
];

// The filter sidebar from the My Places mockup.
// It only shows the controls; filterVisits() does the actual filtering.
function MyPlacesFilters({ filters, onChange, onClear }: Props) {
  // Unique per copy of this panel. The page shows two copies (sidebar + phone),
  // and radio buttons with the same name would interfere with each other.
  const radioGroup = useId();

  // Tick or untick one type
  function toggleType(type: PlaceType) {
    const types = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onChange({ types });
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl">Filters</h2>

      {/* Type */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Type</legend>
        {TYPE_OPTIONS.map(({ value, label }) => (
          <label key={value} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={filters.types.includes(value)}
              onChange={() => toggleType(value)}
            />
            {label}
          </label>
        ))}
      </fieldset>

      {/* Favourites */}
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          className="checkbox checkbox-primary checkbox-sm"
          checked={filters.favouritesOnly}
          onChange={() => onChange({ favouritesOnly: !filters.favouritesOnly })}
        />
        Favourites only
      </label>

      {/* Date visited */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Date visited</span>
        <select
          className="select select-sm w-full"
          value={filters.dateRange}
          onChange={(e) => onChange({ dateRange: e.target.value as VisitFilters["dateRange"] })}
        >
          <option value="any">Any time</option>
          <option value="thisYear">This year</option>
          <option value="lastYear">Last year</option>
          <option value="older">Older</option>
        </select>
      </label>

      {/* Rating */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Rating</legend>
        {RATING_OPTIONS.map(({ value, label }) => (
          <label key={value} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name={`minRating-${radioGroup}`}
              className="radio radio-primary radio-sm"
              checked={filters.minRating === value}
              onChange={() => onChange({ minRating: value })}
            />
            {label}
          </label>
        ))}
      </fieldset>

      <button type="button" className="link self-start text-sm" onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}

export default MyPlacesFilters;
