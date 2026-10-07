import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { getFriendVisits } from "../api/friends";
import VisitCard from "../components/VisitCard";
import type { FriendProfileResponse } from "../types/friends";
import { getVisitStats } from "../utils/visitStats";
import Avatar from "../components/Avatar";

// A friend's places. Only works for accepted friends (the API returns 404 otherwise).
// No dates anywhere: friends never see WHEN someone was somewhere.
function FriendProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<FriendProfileResponse | null>(null);
  const [error, setError] = useState("");

  // Load the friend's places when the page opens (or a different friend is opened)
  useEffect(() => {
    if (!userId) return;
    let ignore = false;

    getFriendVisits(userId)
      .then((data) => {
        if (!ignore) setProfile(data);
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err.message : "Couldn't load this profile");
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  const stats = useMemo(() => getVisitStats(profile?.visits ?? []), [profile]);

  // --- Error and loading states ---
  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <h1>Profile not found</h1>
        <p className="text-ink/70">You can only see the places of people you're friends with.</p>
        <Link to="/friends" className="btn btn-primary">
          Back to Friends
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-forest" />
      </div>
    );
  }

  const { friend, visits } = profile;

  return (
    <div className="flex flex-col gap-8">
      <Link to="/friends" className="flex items-center gap-1 text-sm hover:text-forest">
        <ArrowLeft className="h-4 w-4" />
        Back to Friends
      </Link>

      {/* Who they are, and their stats */}
      <header className="flex flex-wrap items-center gap-5">
                <Avatar name={friend.name} url={friend.avatarUrl} size="xl" />
        <div>
          <h1 className="text-4xl sm:text-5xl">{friend.name}</h1>
          <p className="text-ink/60">@{friend.username}</p>
          <p className="mt-2 font-medium">
            {stats.places} {stats.places === 1 ? "place" : "places"} · {stats.cities}{" "}
            {stats.cities === 1 ? "city" : "cities"} · {stats.countries}{" "}
            {stats.countries === 1 ? "country" : "countries"}
          </p>
        </div>
      </header>

      {/* Their places, best-rated first */}
      {visits.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visits.map((visit) => (
            <VisitCard
              key={visit._id}
              visit={visit}
              to={`/friends/${friend.id}/places/${visit._id}`}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-ink/70">{friend.name} hasn't saved any places yet.</p>
      )}
    </div>
  );
}

export default FriendProfilePage;
