import { useState, type KeyboardEvent } from "react";
import { BedDouble, Coffee, UtensilsCrossed, X } from "lucide-react";
import type { LocationResult } from "../../api/locationSearch";
import type { PlaceType } from "../../types/visit";
import MiniMap from "../map/MiniMap";
import type { StepProps } from "./formTypes";
import LocationSearch from "./LocationSearch";

// The three type buttons, in the order shown
const PLACE_TYPES: { value: PlaceType; label: string; Icon: typeof Coffee }[] = [
  { value: "cafe", label: "Café", Icon: Coffee },
  { value: "restaurant", label: "Restaurant", Icon: UtensilsCrossed },
  { value: "hotel", label: "Hotel", Icon: BedDouble },
];

// Step 1: type, location, name, date and tags
function DetailsStep({ form, updateForm }: StepProps) {
  const [tagInput, setTagInput] = useState("");

  // Picking a search result fills in the name, and the type if
  // OpenStreetMap knows it (unless the user already chose one)
  function handleLocationSelect(result: LocationResult) {
    updateForm({
      location: result,
      name: result.name,
      type: form.type || result.suggestedType || "",
    });
  }

  // --- Tags ---
  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag) && form.tags.length < 20) {
      updateForm({ tags: [...form.tags, tag] });
    }
    setTagInput("");
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  function removeTag(tagToRemove: string) {
    updateForm({ tags: form.tags.filter((tag) => tag !== tagToRemove) });
  }

  // Today's date as "YYYY-MM-DD", so visit dates can't be in the future
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl">Basic details</h2>

      {/* Type */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">What type of place is it?</legend>
        <div className="grid grid-cols-3 gap-3">
          {PLACE_TYPES.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => updateForm({ type: value })}
              className={`flex flex-col items-center gap-2 rounded-box border-2 p-4 font-medium ${
                form.type === value
                  ? "border-forest bg-soft-white"
                  : "border-transparent bg-base-200 hover:border-base-300"
              }`}
            >
              <Icon className="h-6 w-6 text-forest" />
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Location</span>
        <LocationSearch onSelect={handleLocationSelect} />
        {form.location && (
          <MiniMap lat={form.location.coordinates.lat} lng={form.location.coordinates.lng} />
        )}
      </div>

      {/* Name: filled in from the search, can be edited */}
      {form.location && (
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Name</span>
          <input
            className="input w-full"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </label>
      )}

      {/* Date visited */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Date visited</span>
        <input
          type="date"
          className="input w-full"
          value={form.visitDate}
          max={today}
          onChange={(e) => updateForm({ visitDate: e.target.value })}
        />
      </label>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Tags (optional)</span>
        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag) => (
            <span key={tag} className="badge gap-1 bg-base-200 py-3">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          className="input w-full"
          placeholder="Type a tag and press Enter, e.g. Brunch"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={addTag}
        />
      </div>
    </div>
  );
}

export default DetailsStep;
