import { useEffect, useMemo } from "react";
import type { Marker as LeafletMarker } from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { MAP_TILES } from "../../config";
import { theoPin } from "./theoPin";

type Props = {
  lat: number;
  lng: number;
  // If provided, the pin can be dragged, and this runs when it's dropped
  onPinMove?: (lat: number, lng: number) => void;
};

// MapContainer only uses `center` when it first appears.
// This helper moves the map whenever the coordinates change.
function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom()); // keep the user's zoom level
  }, [map, lat, lng]);

  return null;
}

// Clicking anywhere on the map moves the pin there
function ClickToDrop({ onPinMove }: { onPinMove: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => onPinMove(e.latlng.lat, e.latlng.lng),
  });

  return null;
}

// Small map showing one pin: used under the location search
function MiniMap({ lat, lng, onPinMove }: Props) {
  // Runs when the pin is dropped, not while it's moving
  const eventHandlers = useMemo(
    () => ({
      dragend: (e: { target: LeafletMarker }) => {
        const position = e.target.getLatLng();
        onPinMove?.(position.lat, position.lng);
      },
    }),
    [onPinMove],
  );

  return (
    // relative z-0 keeps Leaflet's layers below the navbar dropdown
    <div className="relative z-0 overflow-hidden rounded-box">
      <MapContainer center={[lat, lng]} zoom={16} scrollWheelZoom={false} className="h-56 w-full">
        <TileLayer url={MAP_TILES.url} attribution={MAP_TILES.attribution} />
        <Marker
          position={[lat, lng]}
          icon={theoPin}
          draggable={Boolean(onPinMove)}
          eventHandlers={eventHandlers}
        />
        <Recenter lat={lat} lng={lng} />
        {onPinMove && <ClickToDrop onPinMove={onPinMove} />}
      </MapContainer>
    </div>
  );
}

export default MiniMap;
