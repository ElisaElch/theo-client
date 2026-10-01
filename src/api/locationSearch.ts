import type { PlaceType } from "../types/visit";

// The parts of a Nominatim (OpenStreetMap) search result we use
type NominatimResult = {
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  name: string;
  display_name: string;
  category: string;
  type: string;
  address?: Record<string, string>;
};

// A search result in Theo's shape, ready to fill in the form
export type LocationResult = {
  externalId: string;
  name: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  suggestedType?: PlaceType; // e.g. OpenStreetMap knows a place is a café
  label: string; // full address, shown in the results list
};

// OpenStreetMap place types → Theo's three types
const TYPE_MAP: Record<string, PlaceType> = {
  cafe: "cafe",
  restaurant: "restaurant",
  fast_food: "restaurant",
  hotel: "hotel",
  guest_house: "hotel",
  hostel: "hotel",
};

// Searches OpenStreetMap. Call this on Enter or a button click, never on every
// keystroke: Nominatim's free service allows about one request per second.
export async function searchLocations(query: string): Promise<LocationResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    limit: "5",
  });

  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);

  if (!res.ok) {
    throw new Error("Location search isn't available right now. Please try again.");
  }

  const results: NominatimResult[] = await res.json();
  return results.map(toLocationResult);
}

function toLocationResult(result: NominatimResult): LocationResult {
  const address = result.address ?? {};
  const suggestedType = TYPE_MAP[result.type];

  // Only real venues (cafés, hotels...) get a shared id. A street or a whole city
  // gets a unique id instead, so two different cafés on the same street
  // never get merged into one Place.
  const isVenue =
    Boolean(suggestedType) || result.category === "amenity" || result.category === "tourism";

  return {
    externalId: isVenue
      ? `osm:${result.osm_type}:${result.osm_id}`
      : `custom:${crypto.randomUUID()}`,
    name: result.name || result.display_name.split(",")[0],
    city:
      address.city ??
      address.town ??
      address.village ??
      address.municipality ??
      address.county ??
      "",
    country: address.country ?? "",
    coordinates: { lat: Number(result.lat), lng: Number(result.lon) },
    suggestedType,
    label: result.display_name,
  };
}

// Looks up the address at a point on the map (used for a dragged pin or
// the user's current location), so we know the city and country.
export async function reverseGeocode(lat: number, lng: number): Promise<LocationResult> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: "jsonv2",
    addressdetails: "1",
    zoom: "18", // street level, the most detailed
  });

  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`);

  if (!res.ok) {
    throw new Error("Couldn't look up this location. Please try again.");
  }

  const result: NominatimResult = await res.json();
  const location = toLocationResult(result);

  return {
    ...location,
    // A pin placed by hand is never treated as a known venue, so it gets its
    // own unique id. That way it can't accidentally merge with another place.
    externalId: `custom:${crypto.randomUUID()}`,
    // Keep the exact spot the user chose, not Nominatim's nearest address
    coordinates: { lat, lng },
  };
}
