import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { getFriendsMapPlaces } from "../api/feed";
import { getMyVisits } from "../api/visits";
import VisitsMap from "../components/map/VisitsMap";
import type { FeedItem, FriendUser } from "../types/friends";
import type { PlaceType, Visit } from "../types/visit";
import { getVisitStats } from "../utils/visitStats";

const TYPE_OPTIONS: { value: PlaceType; label: string }[] = [
  { value: "cafe", label: "Cafés" },
  { value: "restaurant", label: "Restaurants" },
  { value: "hotel", label: "Hotels" },
];

// The three fixed views. Any other value of ?show= is one friend's id.
const VIEW_OPTIONS = [
  { value: "mine", label: "My places" },
  { value: "friends", label: "All friends" },
  { value: "everyone", label: "Everyone" },
];

const firstName = (name: string) => name.split(" ")[0];

// Everywhere you (and your friends) have been, on one map
function MapPage() {
  const [visits, setVisits] = useState<Visit[] | null>(null); // null = still loading
  const [friendPlaces, setFriendPlaces] = useState<FeedItem[]>([]);
  const [error, setError] = useState("");
  const [friendsError, setFriendsError] = useState("");
  // Which types are shown. All three start ticked.
  const [shownTypes, setShownTypes] = useState<PlaceType[]>(["cafe", "restaurant", "hotel"]);

  // The view lives in the address (?show=...), so links, Back and refresh all keep it
  const [searchParams, setSearchParams] = useSearchParams();
  const show = searchParams.get("show") ?? "mine";

  function setShow(value: string) {
    // replace: changing the filter shouldn't add lots of steps to the Back button
    setSearchParams(value === "mine" ? {} : { show: value }, { replace: true });
  }

  // Load your visits once when the page opens
  useEffect(() => {
    let ignore = false;

    getMyVisits()
      .then(({ visits }) => {
        if (!ignore) setVisits(visits);
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err.message : "Couldn't load your places");
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Load your friends' places separately, so a problem there never breaks your own map
  useEffect(() => {
    let ignore = false;

    getFriendsMapPlaces()
      .then(({ places }) => {
        if (!ignore) setFriendPlaces(places);
      })
      .catch(() => {
        if (!ignore) setFriendsError("Your friends' places couldn't be loaded.");
      });

    return () => {
      ignore = true;
    };
  }, []);

  function toggleType(type: PlaceType) {
    setShownTypes((current) =>
      current.includes(type) ? current.filter((t) => t !== type) : [...current, type],
    );
  }

  // Friends who have places, for the dropdown (each friend once, sorted by name)
  const friends = useMemo(() => {
    const byId = new Map<string, FriendUser>();
    friendPlaces.forEach(({ friend }) => byId.set(friend.id, friend));
    return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [friendPlaces]);

  // For your pins: which friends have been to the same place ("Also visited by Sophie")
  const alsoVisitedBy = useMemo(() => {
    const names: Record<string, string[]> = {};
    friendPlaces.forEach(({ friend, visit }) => {
      const list = (names[visit.place._id] ??= []); // create the list the first time
      const name = firstName(friend.name);
      if (!list.includes(name)) list.push(name);
    });
    return names;
  }, [friendPlaces]);

  // What's on the map right now, based on the view and the ticked types
  const { shownMine, shownFriends } = useMemo(() => {
    const byType = <T extends { type: PlaceType }>(v: T) => shownTypes.includes(v.type);
    const mine = (visits ?? []).filter(byType);
    const theirs = friendPlaces.filter(({ visit }) => byType(visit));

    if (show === "mine") return { shownMine: mine, shownFriends: [] };
    if (show === "friends") return { shownMine: [], shownFriends: theirs };
    if (show === "everyone") {
      // A place you've been to shows as YOUR pin (with "Also visited by..."), not twice
      const myPlaceIds = new Set(mine.map((v) => v.place._id));
      return {
        shownMine: mine,
        shownFriends: theirs.filter(({ visit }) => !myPlaceIds.has(visit.place._id)),
      };
    }
    // Otherwise "show" is one friend's id
    return { shownMine: [], shownFriends: theirs.filter(({ friend }) => friend.id === show) };
  }, [visits, friendPlaces, shownTypes, show]);

  const stats = useMemo(() => getVisitStats(visits ?? []), [visits]);

  // The line under the heading, depending on the view
  const selectedFriend = friends.find((friend) => friend.id === show);
  const subtitle =
    show === "mine"
      ? "Everywhere you've been."
      : show === "friends"
        ? "Everywhere your friends have been."
        : show === "everyone"
          ? "You and your friends, together."
          : selectedFriend
            ? `Everywhere ${firstName(selectedFriend.name)} has been.`
            : "";

  // --- Error and loading states ---
  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!visits) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-forest" />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      {/* Left: whose places, what types, and your stats */}
      <aside className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl">Map</h1>
          <p className="mt-1 text-ink/70">{subtitle}</p>
        </div>

        {/* Whose places to show */}
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">Whose places</legend>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {VIEW_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setShow(value)}
                aria-pressed={show === value}
                className={`btn btn-sm justify-start ${show === value ? "btn-primary" : "btn-ghost"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* One friend */}
          <select
            className="select select-sm mt-1 w-full"
            value={selectedFriend ? show : ""}
            onChange={(e) => setShow(e.target.value || "mine")}
            disabled={friends.length === 0}
            aria-label="Show one friend's places"
          >
            <option value="">{friends.length === 0 ? "No friends' places yet" : "One friend…"}</option>
            {friends.map((friend) => (
              <option key={friend.id} value={friend.id}>
                {friend.name}
              </option>
            ))}
          </select>

          {friendsError && <p className="text-xs text-error">{friendsError}</p>}
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">Show on map</legend>
          {TYPE_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={shownTypes.includes(value)}
                onChange={() => toggleType(value)}
              />
              {label}
            </label>
          ))}
        </fieldset>

        {/* Your own stats, like the panel in the mockup */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Your places</p>
          <div className="card grid grid-cols-3 gap-2 bg-soft-white p-4 text-center lg:grid-cols-1 lg:gap-4">
            <div>
              <p className="font-heading text-4xl text-forest">{stats.places}</p>
              <p className="text-sm text-ink/70">{stats.places === 1 ? "place" : "places"}</p>
            </div>
            <div>
              <p className="font-heading text-4xl text-forest">{stats.cities}</p>
              <p className="text-sm text-ink/70">{stats.cities === 1 ? "city" : "cities"}</p>
            </div>
            <div>
              <p className="font-heading text-4xl text-forest">{stats.countries}</p>
              <p className="text-sm text-ink/70">
                {stats.countries === 1 ? "country" : "countries"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Right: the map */}
      <div className="flex flex-col gap-3">
        <VisitsMap myVisits={shownMine} friendPlaces={shownFriends} alsoVisitedBy={alsoVisitedBy} />

        {show === "mine" && visits.length === 0 && (
          <p className="text-center text-ink/70">
            No places yet.{" "}
            <Link to="/places/new" className="link">
              Add your first place
            </Link>{" "}
            and it'll appear here.
          </p>
        )}

        {show === "friends" && friendPlaces.length === 0 && !friendsError && (
          <p className="text-center text-ink/70">
            Your friends haven't added any places yet.{" "}
            <Link to="/friends/find" className="link">
              Find friends
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default MapPage;