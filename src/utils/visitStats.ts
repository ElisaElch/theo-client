// Anything with a place that has a city and country:
// your own visits and friends' visits both fit
type HasPlace = { place: { city: string; country: string } };

// Counts places, cities and countries from a list of visits
export function getVisitStats(visits: HasPlace[]) {
  // A Set only keeps unique values, so the same city counted twice stays one
  const cities = new Set(visits.map((visit) => `${visit.place.city}, ${visit.place.country}`));
  const countries = new Set(visits.map((visit) => visit.place.country));

  return {
    places: visits.length,
    cities: cities.size,
    countries: countries.size,
  };
}
