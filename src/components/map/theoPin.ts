import L from "leaflet";

// Theo's map marker: a forest-green circle with a sage centre.
// Built from HTML + Tailwind classes instead of Leaflet's default image pin.
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
