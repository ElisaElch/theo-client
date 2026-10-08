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