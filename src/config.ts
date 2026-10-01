// CARTO map tiles key (public by design: every visitor's browser sends it)
const CARTO_KEY = import.meta.env.VITE_CARTO_KEY;

// Map style used by every map in the app (CARTO Positron).
// To try a different style, change only the url and attribution here.
export const MAP_TILES = {
  url: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=${CARTO_KEY}`,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
};
