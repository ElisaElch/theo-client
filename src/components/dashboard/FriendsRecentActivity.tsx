import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ImageIcon } from "lucide-react";
import { getActivityGroups } from "../../api/feed";
import type { ActivityGroup } from "../../types/friends";
import { cloudinaryImage } from "../../utils/cloudinaryImage";
import Avatar from "../Avatar";

const HOW_MANY = 3;

// One photo tile; a soft placeholder if the place has no photos
function Tile({ url, className = "" }: { url?: string; className?: string }) {
  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-base-200 ${className}`}>
        <ImageIcon className="size-6 text-ink/30" aria-hidden="true" />
      </div>
    );
  }
  return <img src={cloudinaryImage(url, 500)} alt="" className={`object-cover ${className}`} />;
}

// One card: a friend's places from one day. No dates are shown (or even known here).
function GroupCard({ group }: { group: ActivityGroup }) {
  const { friend, visits } = group;
  const firstName = friend.name.split(" ")[0];
  const isSingle = visits.length === 1;
  const first = visits[0];

  // One place: open that visit. Several: open the friend's profile.
  const to = isSingle ? `/friends/${friend.id}/places/${first._id}` : `/friends/${friend.id}`;

  // "Kyoto, Japan · 3 places" if they're all in one city, otherwise just "3 places"
  const cities = new Set(visits.map((visit) => visit.place.city));
  const location = [first.place.city, first.place.country].filter(Boolean).join(", ");
  const summary = isSingle
    ? location
    : cities.size === 1 && first.place.city
      ? `${location} · ${visits.length} places`
      : `${visits.length} places`;

  // The first photo of up to three places, for the collage
  const covers = visits.slice(0, 3).map((visit) => visit.photos[0]?.url);

  return (
    <Link
      to={to}
      className="flex flex-col gap-3 rounded-2xl border border-base-300 bg-soft-white p-4 transition hover:border-forest"
    >
      <div className="flex items-center gap-2">
        <Avatar name={friend.name} url={friend.avatarUrl} size="sm" />
        <p className="text-sm text-ink">
          <span className="font-medium">{firstName}</span>{" "}
          {isSingle ? "saved a place" : `added ${visits.length} places`}
        </p>
      </div>

      {/* One place: one photo. Several: a big photo on the left, up to two small ones on the right */}
      {covers.length === 1 ? (
        <Tile url={covers[0]} className="aspect-[4/3] w-full rounded-xl" />
      ) : (
        <div className="grid aspect-[4/3] grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-xl">
          <Tile url={covers[0]} className="row-span-2 size-full" />
          <Tile url={covers[1]} className={`size-full ${covers.length === 2 ? "row-span-2" : ""}`} />
          {covers.length === 3 && <Tile url={covers[2]} className="size-full" />}
        </div>
      )}

      <div>
        {isSingle && <p className="font-medium text-ink">{first.place.name}</p>}
        <p className="text-sm text-ink/70">{summary}</p>
      </div>
    </Link>
  );
}

// The newest few groups of friends' places from the last week
function FriendsRecentActivity() {
  const [groups, setGroups] = useState<ActivityGroup[] | null>(null); // null = still loading
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    getActivityGroups()
      .then(({ groups }) => {
        if (!ignore) setGroups(groups.slice(0, HOW_MANY));
      })
      .catch(() => {
        if (!ignore) setError("Your friends' activity couldn't be loaded. Try refreshing the page.");
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-heading text-3xl font-semibold text-forest">Friends' recent activity</h2>
        <Link
          to="/friends/activity"
          className="flex items-center gap-1 text-sm font-medium text-forest"
        >
          View all <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      {!error && groups === null && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: HOW_MANY }, (_, i) => (
            <div key={i} className="skeleton h-72 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {/* Empty: no friends yet, or nothing new from them this week */}
      {groups && groups.length === 0 && (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-base-300 p-6">
          <p className="text-ink/80">Nothing new from your friends this week.</p>
          <div className="flex flex-wrap gap-2">
            <Link to="/friends/find" className="btn btn-primary btn-sm">
              Find friends
            </Link>
            <Link to="/friends/activity" className="btn btn-outline btn-sm">
              See all activity
            </Link>
          </div>
        </div>
      )}

      {groups && groups.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <li key={`${group.friend.id}-${group.visits[0]._id}`}>
              <GroupCard group={group} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default FriendsRecentActivity;