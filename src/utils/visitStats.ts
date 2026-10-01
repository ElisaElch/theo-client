import type { Visit } from "../types/visit";

// Counts places, cities and countries from a list of visits
export function getVisitStats(visits: Visit[]) {
  // A Set only keeps unique values, so the same city counted twice stays one
  const cities = new Set(visits.map((visit) => `${visit.place.city}, ${visit.place.country}`));
  const countries = new Set(visits.map((visit) => visit.place.country));

  return {
    places: visits.length,
    cities: cities.size,
    countries: countries.size,
  };
}
