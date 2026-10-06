import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getFeed } from "../api/feed";
import ActivityItem from "../components/friends/ActivityItem";
import type { FeedItem } from "../types/friends";

// All recent activity from friends (muted friends are left out by the API)
function FriendsActivityPage() {
  const [feed, setFeed] = useState<FeedItem[] | null>(null); // null = loading
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    getFeed()
      .then(({ items }) => {
        if (!ignore) setFeed(items);
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err.message : "Couldn't load activity");
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-5xl">Activity</h1>
        <p className="mt-2 text-lg text-ink/70">The places your friends have been saving lately.</p>
      </header>

      {error && (
        <div role="alert" className="alert alert-error">
          {error}
        </div>
      )}

      {feed === null && !error && (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-forest" />
        </div>
      )}

      {feed && feed.length > 0 && (
        <div className="flex flex-col gap-5">
          {feed.map((item) => (
            <ActivityItem key={item.visit._id} item={item} />
          ))}
        </div>
      )}

      {feed && feed.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="max-w-md text-ink/70">
            No activity yet. When your friends save places, they'll show up here. Muted friends
            don't appear.
          </p>
          <Link to="/friends/find" className="btn btn-primary">
            Find friends
          </Link>
        </div>
      )}
    </div>
  );
}

export default FriendsActivityPage;
