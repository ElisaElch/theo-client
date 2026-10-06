import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import { Activity, Inbox, UserSearch, Users } from "lucide-react";
import { getConnections } from "../../api/friends";
import type { ConnectionsResponse } from "../../types/friends";
import type { FriendsData } from "./friendsData";

// Sidebar style: highlighted background for the page you're on
const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex shrink-0 items-center gap-3 rounded-box px-4 py-2 font-medium ${
    isActive ? "bg-base-200 text-forest" : "hover:bg-base-200"
  }`;

// The Friends section: sidebar on the left, the chosen page on the right.
// Loads friends + requests once and shares them with every page.
function FriendsLayout() {
  const [connections, setConnections] = useState<ConnectionsResponse | null>(null);
  const [error, setError] = useState("");

  // First load. State is only set in .then(), once the answer has arrived.
  useEffect(() => {
    let ignore = false;

    getConnections()
      .then((data) => {
        if (!ignore) setConnections(data);
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err.message : "Couldn't load your friends");
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Pages call this after a change (accept, remove, mute...)
  async function reload() {
    try {
      setConnections(await getConnections());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load your friends");
    }
  }

  const requestCount = connections?.incoming.length ?? 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
      {/* Sidebar: a column on desktop, a row of tabs you can swipe on phones */}
      <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Friends">
        <NavLink to="/friends" end className={sidebarLinkClass}>
          <Users className="h-5 w-5" />
          Friends
        </NavLink>
        <NavLink to="/friends/activity" className={sidebarLinkClass}>
          <Activity className="h-5 w-5" />
          Activity
        </NavLink>
        <NavLink to="/friends/find" className={sidebarLinkClass}>
          <UserSearch className="h-5 w-5" />
          Find friends
        </NavLink>
        <NavLink to="/friends/requests" className={sidebarLinkClass}>
          <Inbox className="h-5 w-5" />
          Requests
          {requestCount > 0 && <span className="badge badge-sm badge-primary">{requestCount}</span>}
        </NavLink>
      </nav>

      {/* The chosen page */}
      <div>
        {error && (
          <div role="alert" className="alert alert-error mb-6">
            {error}
          </div>
        )}

        {connections ? (
          <Outlet context={{ connections, reload } satisfies FriendsData} />
        ) : (
          !error && (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg text-forest" />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default FriendsLayout;
