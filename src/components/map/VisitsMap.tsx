import { useEffect, useMemo } from "react";
import { Link } from "react-router";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import { MAP_TILES } from "../../config";
import type { FeedItem } from "../../types/friends";
import type { Visit } from "../../types/visit";
import { cloudinaryImage } from "../../utils/cloudinaryImage";
import Avatar from "../Avatar";
import StarRating from "../StarRating";
import { friendPin, theoPin } from "./theoPin";

type LatLng = [number, number];

type Props = {
  myVisits: Visit[]; // your own places (forest pins)
  friendPlaces?: FeedItem[]; // friends' places (terracotta pins)
  alsoVisitedBy?: Record<string, string[]>; // place id → friends' first names, for your pins
};

// "Sophie", "Sophie and Bill", "Sophie, Bill and Mike"
const listFormat = new Intl.ListFormat("en-GB", { type: "conjunction" });

// Zooms the map so every pin fits on screen, whenever the shown places change
function FitToPoints({ points }: { points: LatLng[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    // padding keeps pins away from the edges; maxZoom stops it zooming in too far for 1 place
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 14 });
  }, [map, points]);

  return null;
}

// The round bubble shown when several pins are grouped. Its colour shows what's inside:
// forest = only your places, terracotta = only friends' places, sage = a mix of both.
// It gets a little bigger as the number grows.
function createClusterIcon(cluster: {
  getChildCount: () => number;
  getAllChildMarkers: () => L.Marker[];
}) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 40 : count < 100 ? 48 : 56;

  // How many of the grouped pins are friends' pins?
  const markers = cluster.getAllChildMarkers();
  const friendCount = markers.filter((marker) => marker.options.icon === friendPin).length;

  const colours =
    friendCount === 0
      ? "bg-forest text-cream" // all yours
      : friendCount === markers.length
        ? "bg-terracotta text-soft-white" // all friends'
        : "bg-sage text-forest"; // a mix

  return L.divIcon({
    className: "", // removes Leaflet's default white box, like theoPin
    html: `
      <div class="flex items-center justify-center rounded-full border-2 border-soft-white font-medium shadow-md ${colours}"
           style="width: ${size}px; height: ${size}px;">
        ${count}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2], // the centre sits on the group's position
  });
}

// Shared top part of both popups: photo, name, location, stars
function PopupPlace({ visit }: { visit: Visit | FeedItem["visit"] }) {
  return (
    <>
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
    </>
  );
}

// Big map with your places and (optionally) your friends' places.
// Pins close together are grouped into a numbered bubble; clicking a pin opens a small card.
function VisitsMap({ myVisits, friendPlaces = [], alsoVisitedBy = {} }: Props) {
  // Every pin's position, for fitting the map. useMemo keeps the same list between renders,
  // so the map only re-fits when the shown places actually change.
  const points = useMemo<LatLng[]>(
    () => [
      ...myVisits.map((v): LatLng => [v.place.coordinates.lat, v.place.coordinates.lng]),
      ...friendPlaces.map(({ visit: v }): LatLng => [v.place.coordinates.lat, v.place.coordinates.lng]),
    ],
    [myVisits, friendPlaces],
  );

  return (
    // relative z-0 keeps Leaflet's layers below the navbar dropdown
    <div className="relative z-0 overflow-hidden rounded-box">
      <MapContainer center={[20, 0]} zoom={2} className="h-[70vh] w-full">
        <TileLayer url={MAP_TILES.url} attribution={MAP_TILES.attribution} />

        <MarkerClusterGroup
          iconCreateFunction={createClusterIcon}
          showCoverageOnHover={false} // no blue outline of the group's area on hover
          chunkedLoading // adds lots of pins in small batches, so the page stays responsive
        >
          {/* Your places: forest pins */}
          {myVisits.map((visit) => {
            const friendNames = alsoVisitedBy[visit.place._id] ?? [];
            return (
              <Marker
                key={visit._id}
                position={[visit.place.coordinates.lat, visit.place.coordinates.lng]}
                icon={theoPin}
              >
                <Popup>
                  <div className="flex w-48 flex-col gap-1">
                    <PopupPlace visit={visit} />
                    {friendNames.length > 0 && (
                      <span className="text-xs text-terracotta">
                        Also visited by {listFormat.format(friendNames)}
                      </span>
                    )}
                    <Link to={`/places/${visit._id}`} className="mt-1 font-medium text-forest">
                      View place →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Friends' places: terracotta pins */}
          {friendPlaces.map(({ friend, visit }) => (
            <Marker
              key={`friend-${visit._id}`}
              position={[visit.place.coordinates.lat, visit.place.coordinates.lng]}
              icon={friendPin}
            >
              <Popup>
                <div className="flex w-48 flex-col gap-1">
                  {/* Whose place this is */}
                  <div className="mb-1 flex items-center gap-2">
                    <Avatar name={friend.name} url={friend.avatarUrl} size="sm" />
                    <span className="text-sm font-medium text-ink">{friend.name.split(" ")[0]}</span>
                  </div>
                  <PopupPlace visit={visit} />
                  <Link
                    to={`/friends/${friend.id}/places/${visit._id}`}
                    className="mt-1 font-medium text-forest"
                  >
                    View their visit →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        <FitToPoints points={points} />
      </MapContainer>
    </div>
  );
}

export default VisitsMap;