import type { PlaceType, Visit } from "../types/visit";

// Everything the My Places filters can be set to
export type VisitFilters = {
  search: string;
  types: PlaceType[]; // empty = all types
  minRating: number; // 0 = any rating, 11 = exceptional only
  dateRange: "any" | "thisYear" | "lastYear" | "older";
  favouritesOnly: boolean;
};

export const defaultFilters: VisitFilters = {
  search: "",
  types: [],
  minRating: 0,
  dateRange: "any",
  favouritesOnly: false,
};

// Returns only the visits that match every active filter
export function filterVisits(visits: Visit[], filters: VisitFilters): Visit[] {
  const search = filters.search.trim().toLowerCase();
  const thisYear = new Date().getFullYear();

  return visits.filter((visit) => {
    const { place } = visit;

    // Search: name, city, country or any tag contains the text
    if (search) {
      const searchable = [place.name, place.city, place.country, ...visit.tags];
      if (!searchable.some((text) => text.toLowerCase().includes(search))) return false;
    }

    // Type: only the ticked types (none ticked = all)
    if (filters.types.length > 0 && !filters.types.includes(place.type)) return false;

    // Rating: at least the minimum
    if (filters.minRating > 0 && (visit.rating ?? 0) < filters.minRating) return false;

    // Favourites only
    if (filters.favouritesOnly && !visit.isFavourite) return false;

    // Date visited
    if (filters.dateRange !== "any") {
      if (!visit.visitDate) return false;
      const year = new Date(visit.visitDate).getUTCFullYear();
      if (filters.dateRange === "thisYear" && year !== thisYear) return false;
      if (filters.dateRange === "lastYear" && year !== thisYear - 1) return false;
      if (filters.dateRange === "older" && year >= thisYear - 1) return false;
    }

    return true; // passed every filter
  });
}
