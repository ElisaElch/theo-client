import { useEffect } from "react";
import { Link } from "react-router";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { MAP_TILES } from "../../config";
import type { Visit } from "../../types/visit";
import { cloudinaryImage } from "../../utils/cloudinaryImage";
import StarRating from "../StarRating";
import { theoPin } from "./theoPin";

// Zooms the map so every pin fits on screen, whenever the shown places change
function FitToVisits({ visits }: { visits: Visit[] }) {
  const map = useMap();

  useEffect(() => {
    if (visits.length === 0) return;

    const bounds = L.latLngBounds(
      visits.map((visit) => [visit.place.coordinates.lat, visit.place.coordinates.lng]),
    );
    // padding keeps pins away from the edges; maxZoom stops it zooming in too far for 1 place
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [map, visits]);

  return null;
}

// Big map with a pin for every visit. Clicking a pin opens a small card.
function VisitsMap({ visits }: { visits: Visit[] }) {
  return (
    // relative z-0 keeps Leaflet's layers below the navbar dropdown
    <div className="relative z-0 overflow-hidden rounded-box">
      <MapContainer center={[20, 0]} zoom={2} className="h-[70vh] w-full">
        <TileLayer url={MAP_TILES.url} attribution={MAP_TILES.attribution} />

        {visits.map((visit) => (
          <Marker
            key={visit._id}
            position={[visit.place.coordinates.lat, visit.place.coordinates.lng]}
            icon={theoPin}
          >
            {/* The small card shown when a pin is clicked */}
            <Popup>
              <div className="flex w-48 flex-col gap-1">
                {visit.photos[0] && (
                  <img
                    src={cloudinaryImage(visit.photos[0].url, 300)}
                    alt=""
                    className="mb-1 aspect-[4/3] w-full rounded-lg object-cover"
                  />
                )}
                <strong className="text-base text-forest">{visit.place.name}</strong>
                <span className="text-xs text-ink/70">
                  {[visit.place.city, visit.place.country].filter(Boolean).join(", ")}
                </span>
                {visit.rating && <StarRating rating={visit.rating} size="sm" />}
                <Link to={`/places/${visit._id}`} className="mt-1 font-medium text-forest">
                  View place →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        <FitToVisits visits={visits} />
      </MapContainer>
    </div>
  );
}

export default VisitsMap;
