import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Search } from "lucide-react";
import { getFeed } from "../api/feed";
import ActivityItem from "../components/friends/ActivityItem";
import FriendAvatarGrid from "../components/friends/FriendAvatarGrid";
import { useFriendsData } from "../components/friends/friendsData";
import InviteLinkButton from "../components/friends/InviteLinkButton";
import type { FeedItem } from "../types/friends";

const ACTIVITY_PREVIEW = 5; // how many activity rows to show here

// The Friends overview: your friends, recent activity, and ways to find people
function FriendsOverviewPage() {
  const { connections } = useFriendsData();
  const [search, setSearch] = useState("");
  const [feed, setFeed] = useState<FeedItem[] | null>(null); // null = loading

  // Load recent activity when the page opens
  useEffect(() => {
    let ignore = false;

    getFeed()
      .then(({ items }) => {
        if (!ignore) setFeed(items);
      })
      .catch(() => {
        if (!ignore) setFeed([]); // the rest of the page still works without it
      });

    return () => {
      ignore = true;
    };
  }, []);

  // "Search friends...": filters your friends by name or username as you type
  const query = search.trim().toLowerCase();
  const shownFriends = connections.friends.filter(
    (friend) =>
      friend.user.name.toLowerCase().includes(query) || friend.user.username.includes(query),
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
      {/* Main column */}
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-5xl">Friends</h1>
          <p className="mt-2 text-lg text-ink/70">
            See where your friends have been and get inspired.
          </p>
        </header>

        {connections.friends.length === 0 ? (
          // No friends yet: one clear next step, not empty sections
          <section className="card flex flex-col items-center gap-4 bg-soft-white p-10 text-center">
            <h2 className="text-3xl">Find your people</h2>
            <p className="max-w-md text-ink/70">
              Add friends to see their favourite spots and discover somewhere new, through people
              whose taste you trust.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/friends/find" className="btn btn-primary">
                Find friends
              </Link>
              <InviteLinkButton />
            </div>
          </section>
        ) : (
          <>
            {/* Search your friends */}
            <label className="input w-full">
              <Search className="h-4 w-4 text-ink/50" />
              <input
                type="search"
                placeholder="Search friends..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            {/* Your friends */}
            <section className="card flex flex-col gap-4 bg-soft-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl">Your friends ({connections.friends.length})</h2>
                <Link to="/friends/manage" className="link text-sm">
                  Manage
                </Link>
              </div>

              {shownFriends.length > 0 ? (
                <FriendAvatarGrid friends={shownFriends} />
              ) : (
                <p className="text-ink/70">No friends match "{search}".</p>
              )}
            </section>

            {/* Recent activity */}
            <section className="card flex flex-col gap-4 bg-soft-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl">Recent activity from friends</h2>
                <Link to="/friends/activity" className="flex items-center gap-1 text-sm">
                  See all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {feed === null ? (
                <span className="loading loading-spinner text-forest" />
              ) : feed.length > 0 ? (
                feed
                  .slice(0, ACTIVITY_PREVIEW)
                  .map((item) => <ActivityItem key={item.visit._id} item={item} />)
              ) : (
                <p className="text-ink/70">
                  Nothing yet. When your friends save places, they'll show up here.
                </p>
              )}
            </section>
          </>
        )}
      </div>

      {/* Right column: ways to find people (where the mockup had suggestions) */}
      <aside className="flex flex-col gap-6">
        <div className="card flex flex-col gap-3 bg-sage/30 p-6">
          <h2 className="text-2xl">Find your people</h2>
          <p className="text-sm text-ink/80">
            Add friends, see their favourite spots and discover somewhere new together.
          </p>
          <Link to="/friends/find" className="btn btn-primary">
            Find friends
          </Link>
        </div>

        <div className="card flex flex-col gap-3 bg-soft-white p-6">
          <h2 className="text-xl">Invite a friend</h2>
          <p className="text-sm text-ink/70">
            Send them your link: it opens Theo with your username ready to add.
          </p>
          <InviteLinkButton />
        </div>
      </aside>
    </div>
  );
}

export default FriendsOverviewPage;
