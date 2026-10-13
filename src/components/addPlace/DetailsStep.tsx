import { useState } from "react";
import { Check, Heart } from "lucide-react";
import { reverseGeocode, type LocationResult } from "../../api/locationSearch";
import type { PlaceType } from "../../types/visit";
import { todayLocal } from "../../utils/today";
import TagsInput from "../TagsInput";
import TypePicker from "../TypePicker";
import MiniMap from "../map/MiniMap";
import type { AddPlaceForm, StepProps } from "./formTypes";
import LocationSearch from "./LocationSearch";

// Words used in labels, e.g. "Name of the café"
const TYPE_WORDS: Record<PlaceType, string> = {
  cafe: "café",
  restaurant: "restaurant",
  hotel: "hotel",
};

// The two choices at the top of the form
const STATUS_OPTIONS: {
  value: AddPlaceForm["status"];
  label: string;
  Icon: typeof Check;
}[] = [
  { value: "visited", label: "I've been here", Icon: Check },
  { value: "wantToGo", label: "I want to go", Icon: Heart },
];

// Step 1: been or want to go, type, location, name, date (or note and link) and tags
function DetailsStep({ form, updateForm }: StepProps) {
  const [pinError, setPinError] = useState("");
  const [dateError, setDateError] = useState("");

  const typeWord = form.type ? TYPE_WORDS[form.type] : "place";
  const isWantToGo = form.status === "wantToGo";

  // A place already on Theo: its name and location are shared, so they can't be changed here
  const isOnTheo = Boolean(form.location?.fromTheo);

  // Today in the user's own time zone, so visit dates can't be in the future
  const today = todayLocal();

  // A search result, or the user's current location, was chosen
  function handleLocationSelect(result: LocationResult) {
    // Real venues and places already on Theo come with a proper name.
    // Addresses and current location would give a street name, so keep
    // whatever the user typed instead.
    const hasRealName = result.fromTheo || result.externalId.startsWith("osm:");

    updateForm({
      location: result,
      name: hasRealName ? result.name : form.name,
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

  // Some phones (iPhone Safari) ignore the input's max, so check the date here too.
  // A future date is simply not accepted, and the previous date stays.
  // ("YYYY-MM-DD" text sorts in date order, so > works for comparing.)
  function handleDateChange(value: string) {
    if (value && value > today) {
      setDateError("The visit date can't be in the future.");
      return;
    }
    setDateError("");
    updateForm({ visitDate: value });
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl">Basic details</h2>

      {/* Been here or want to go */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Have you been here?</legend>
        <div className="grid grid-cols-2 gap-3">
          {STATUS_OPTIONS.map(({ value, label, Icon }) => {
            const isSelected = form.status === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => updateForm({ status: value })}
                className={`flex items-center justify-center gap-2 rounded-box p-4 font-medium transition-colors ${
                  isSelected ? "bg-forest text-cream" : "bg-base-200 hover:bg-base-300"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Type */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">What type of place is it for you?</legend>
        <TypePicker value={form.type} onChange={(type) => updateForm({ type })} />
      </fieldset>

      {/* Find the place */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Find the place</span>
        <LocationSearch type={form.type} onSelect={handleLocationSelect} />
      </div>

      {/* Name: filled in automatically for known venues; locked for places already
          on Theo, because their name is shared by everyone who saved them */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Name of the {typeWord}</span>
        <input
          className="input w-full"
          placeholder="e.g. Lune Café"
          value={form.name}
          readOnly={isOnTheo}
          onChange={(e) => updateForm({ name: e.target.value })}
        />
        {isOnTheo && (
          <span className="text-xs text-ink/60">
            Already on Theo, so the name and location are shared with everyone who saved it.
          </span>
        )}
      </label>

      {/* Map: click or drag the pin to the exact spot (not for places already on Theo) */}
      {form.location && (
        <div className="flex flex-col gap-2">
          <MiniMap
            lat={form.location.coordinates.lat}
            lng={form.location.coordinates.lng}
            // Moving the pin would turn a Theo place into a new, separate place
            onPinMove={isOnTheo ? undefined : handlePinMove}
          />
          <p className="text-xs text-ink/60">
            {[form.location.city, form.location.country].filter(Boolean).join(", ")}
            {!isOnTheo && " · Not quite right? Click the map or drag the pin to the exact spot."}
          </p>
          {pinError && <p className="text-sm text-error">{pinError}</p>}
        </div>
      )}

      {isWantToGo ? (
        <>
          {/* Want to go: why, and an optional link */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Why do you want to go? (optional)</span>
            <textarea
              className="textarea w-full"
              rows={3}
              maxLength={300}
              placeholder="e.g. Lena says the cardamom buns are amazing"
              value={form.wantToGoNote}
              onChange={(e) => updateForm({ wantToGoNote: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Link (optional)</span>
            <input
              type="url"
              className="input w-full"
              placeholder="e.g. an Instagram reel or Google Maps link"
              value={form.link}
              onChange={(e) => updateForm({ link: e.target.value })}
            />
          </label>
        </>
      ) : (
        /* Been here: date visited */
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Date visited</span>
          <input
            type="date"
            className="input w-full"
            value={form.visitDate}
            max={today}
            onChange={(e) => handleDateChange(e.target.value)}
          />
          {dateError && (
            <span role="alert" className="text-sm text-error">
              {dateError}
            </span>
          )}
        </label>
      )}

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Tags (optional)</span>
        <TagsInput tags={form.tags} onChange={(tags) => updateForm({ tags })} />
      </div>
    </div>
  );
}

export default DetailsStep;
