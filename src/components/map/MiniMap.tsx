import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { MAP_TILES } from "../../config";
import { theoPin } from "./theoPin";

type Props = { lat: number; lng: number };

// MapContainer only uses `center` when it first appears.
// This helper moves the map whenever a different place is chosen.
function Recenter({ lat, lng }: Props) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 16);
  }, [map, lat, lng]);

  return null;
}

// Small map showing one pin: used under the location search
function MiniMap({ lat, lng }: Props) {
  return (
    // relative z-0 keeps Leaflet's layers below the navbar dropdown
    <div className="relative z-0 overflow-hidden rounded-box">
      <MapContainer center={[lat, lng]} zoom={16} scrollWheelZoom={false} className="h-48 w-full">
        <TileLayer url={MAP_TILES.url} attribution={MAP_TILES.attribution} />
        <Marker position={[lat, lng]} icon={theoPin} />
        <Recenter lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}

export default MiniMap;
