import L from "leaflet";

// Theo's map markers, built from HTML + Tailwind classes instead of Leaflet's default image pin.
// Both are the same shape; only the colours differ, so yours and your friends' are easy to tell apart.

// Your own places: a forest-green circle with a sage centre
export const theoPin = L.divIcon({
  className: "", // removes Leaflet's default white box around custom icons
  html: `
    <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-soft-white bg-forest shadow-md">
      <div class="h-3 w-3 rounded-full bg-sage"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16], // the centre of the circle sits exactly on the location
});

// Friends' places: a terracotta circle with a peach centre
export const friendPin = L.divIcon({
  className: "",
  html: `
    <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-soft-white bg-terracotta shadow-md">
      <div class="h-3 w-3 rounded-full bg-peach"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Your Want to go places: a lavender circle with a small forest-green heart
// (the heart is Lucide's heart icon, written out as SVG because this is plain HTML, not React)
export const wantToGoPin = L.divIcon({
  className: "",
  html: `
    <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-soft-white bg-lavender text-forest shadow-md">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});