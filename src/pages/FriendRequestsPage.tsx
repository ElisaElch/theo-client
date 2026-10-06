import { useState } from "react";
import { Link } from "react-router";
import { acceptFriendRequest, removeConnection } from "../api/friends";
import FriendRequests from "../components/friends/FriendRequests";
import { useFriendsData } from "../components/friends/friendsData";

// Requests sent to you (Accept / Decline) and by you (Cancel)
function FriendRequestsPage() {
  const { connections, reload } = useFriendsData();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Runs an action on one request, then reloads (which also updates the sidebar badge)
  async function runAction(connectionId: string, action: () => Promise<unknown>) {
    setBusyId(connectionId);
    setError("");
    try {
      await action();
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusyId(null);
    }
  }

  const hasRequests = connections.incoming.length > 0 || connections.outgoing.length > 0;

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <header>
        <h1 className="text-5xl">Requests</h1>
        <p className="mt-2 text-lg text-ink/70">
          Friendships need both people to agree. Declining is private: they're never told.
        </p>
      </header>

      {error && (
        <div role="alert" className="alert alert-error">
          {error}
        </div>
      )}

      {hasRequests ? (
        <FriendRequests
          incoming={connections.incoming}
          outgoing={connections.outgoing}
          busyId={busyId}
          onAccept={(id) => runAction(id, () => acceptFriendRequest(id))}
          onRemove={(id) => runAction(id, () => removeConnection(id))}
        />
      ) : (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-ink/70">No requests at the moment.</p>
          <Link to="/friends/find" className="btn btn-primary">
            Find friends
          </Link>
        </div>
      )}
    </div>
  );
}

export default FriendRequestsPage;
