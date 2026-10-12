import { apiFetch } from "./client";
import type { LocationResult } from "./locationSearch";
import type { PlaceType } from "../types/visit";

// A place as the API sends it back from /places/search
type TheoPlace = {
  externalId: string;
  type: PlaceType;
  name: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
};

// GET /api/places/search?q=: places already saved on Theo (by anyone).
// Returned in the same shape as the OpenStreetMap results, so the form
// can treat both lists the same way when one is picked.
export async function searchTheoPlaces(query: string): Promise<LocationResult[]> {
  const params = new URLSearchParams({ q: query }); // makes spaces, "&", "é" etc. safe in the URL
  const { places } = await apiFetch<{ places: TheoPlace[] }>(`/places/search?${params}`);

  return places.map((place) => ({
    externalId: place.externalId, // the existing id, so the visit links to the same Place
    name: place.name,
    city: place.city,
    country: place.country,
    coordinates: place.coordinates,
    suggestedType: place.type,
    label: [place.city, place.country].filter(Boolean).join(", "), // e.g. "Melbourne, Australia"
  }));
}