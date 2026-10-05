import { useState } from "react";
import { reverseGeocode, type LocationResult } from "../../api/locationSearch";
import type { PlaceType } from "../../types/visit";
import TagsInput from "../TagsInput";
import TypePicker from "../TypePicker";
import MiniMap from "../map/MiniMap";
import type { StepProps } from "./formTypes";
import LocationSearch from "./LocationSearch";

// Words used in labels, e.g. "Name of the café"
const TYPE_WORDS: Record<PlaceType, string> = {
  cafe: "café",
  restaurant: "restaurant",
  hotel: "hotel",
};

// Step 1: type, location, name, date and tags
function DetailsStep({ form, updateForm }: StepProps) {
  const [pinError, setPinError] = useState("");

  const typeWord = form.type ? TYPE_WORDS[form.type] : "place";

  // A search result, or the user's current location, was chosen
  function handleLocationSelect(result: LocationResult) {
    const isKnownVenue = result.externalId.startsWith("osm:");

    updateForm({
      location: result,
      // Only fill in the name for real venues. Addresses and current location
      // would give a street name, so keep whatever the user typed instead.
      name: isKnownVenue ? result.name : form.name,
      type: form.type || result.suggestedType || "",
    });
  }

  // The pin was moved: look up the new city and country, keep the name
  async function handlePinMove(lat: number, lng: number) {
    setPinError("");
    try {
      const location = await reverseGeocode(lat, lng);
      updateForm({ location });
    } catch {
      setPinError("Couldn't look up that spot. Try moving the pin again.");
    }
  }

  // Today's date as "YYYY-MM-DD", so visit dates can't be in the future
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl">Basic details</h2>

      {/* Type */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">What type of place is it for you?</legend>
        <TypePicker value={form.type} onChange={(type) => updateForm({ type })} />
      </fieldset>

      {/* Find the place */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Find the place</span>
        <LocationSearch type={form.type} onSelect={handleLocationSelect} />{" "}
      </div>

      {/* Name: always visible, filled in automatically for known venues */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Name of the {typeWord}</span>
        <input
          className="input w-full"
          placeholder="e.g. Lune Café"
          value={form.name}
          onChange={(e) => updateForm({ name: e.target.value })}
        />
      </label>

      {/* Map: click or drag the pin to the exact spot */}
      {form.location && (
        <div className="flex flex-col gap-2">
          <MiniMap
            lat={form.location.coordinates.lat}
            lng={form.location.coordinates.lng}
            onPinMove={handlePinMove}
          />
          <p className="text-xs text-ink/60">
            {[form.location.city, form.location.country].filter(Boolean).join(", ")}
            {" · "}Not quite right? Click the map or drag the pin to the exact spot.
          </p>
          {pinError && <p className="text-sm text-error">{pinError}</p>}
        </div>
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
        <TagsInput tags={form.tags} onChange={(tags) => updateForm({ tags })} />
      </div>
    </div>
  );
}

export default DetailsStep;
