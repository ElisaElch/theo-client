import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Check, Link2 } from "lucide-react";
import {
  acceptFriendRequest,
  getConnections,
  removeConnection,
  setFriendMuted,
} from "../api/friends";
import ConfirmDialog from "../components/ConfirmDialog";
import FindFriend from "../components/friends/FindFriend";
import FriendRequests from "../components/friends/FriendRequests";
import FriendsList from "../components/friends/FriendsList";
import { useAuth } from "../context/useAuth";
import type { ConnectionsResponse, Friend } from "../types/friends";

// Find friends, answer requests, and manage your friends
function FriendsPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const inviteUsername = searchParams.get("add") ?? ""; // from an invite link: /friends?add=username

  const [data, setData] = useState<ConnectionsResponse | null>(null); // null = loading
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [friendToRemove, setFriendToRemove] = useState<Friend | null>(null);
  const [copied, setCopied] = useState(false);

  // Load friends and requests when the page opens.
  // State is only set in .then(), once the answer has arrived.
  useEffect(() => {
    let ignore = false;

    getConnections()
      .then((connections) => {
        if (!ignore) setData(connections);
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err.message : "Couldn't load your friends");
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Reload the lists after an action (accept, mute, remove...)
  async function loadConnections() {
    try {
      setData(await getConnections());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load your friends");
    }
  }

  // Runs an action on one connection, then reloads the lists
  async function runAction(connectionId: string, action: () => Promise<unknown>) {
    setBusyId(connectionId);
    setError("");
    try {
      await action();
      await loadConnections();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusyId(null);
    }
  }

  // Copies a link like https://theo-client.vercel.app/friends?add=sophietest
  async function copyInviteLink() {
    if (!user) return;
    const link = `${window.location.origin}/friends?add=${user.username}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // "Copied!" for 2 seconds
  }

  if (!data && !error) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-forest" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl">Friends</h1>
          <p className="mt-2 text-lg text-ink/70">Discover places through people you trust.</p>
        </div>

        <button type="button" className="btn btn-secondary" onClick={copyInviteLink}>
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy my invite link"}
        </button>
      </header>

      {error && (
        <div role="alert" className="alert alert-error">
          {error}
        </div>
      )}

      {data && (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: find people, and requests */}
          <div className="flex flex-col gap-8">
            <FindFriend initialUsername={inviteUsername} onChanged={loadConnections} />
            <FriendRequests
              incoming={data.incoming}
              outgoing={data.outgoing}
              busyId={busyId}
              onAccept={(id) => runAction(id, () => acceptFriendRequest(id))}
              onRemove={(id) => runAction(id, () => removeConnection(id))}
            />
          </div>

          {/* Right: your friends */}
          <FriendsList
            friends={data.friends}
            busyId={busyId}
            onToggleMute={(friend) =>
              runAction(friend.connectionId, () =>
                setFriendMuted(friend.connectionId, !friend.isMuted),
              )
            }
            onRemove={setFriendToRemove}
          />
        </div>
      )}

      {/* "Are you sure?" before removing a friend */}
      <ConfirmDialog
        open={friendToRemove !== null}
        title="Remove this friend?"
        message={`You and ${friendToRemove?.user.name ?? "this friend"} will no longer see each other's places. They won't be notified.`}
        confirmLabel="Remove friend"
        busyLabel="Removing..."
        isBusy={busyId === friendToRemove?.connectionId}
        onConfirm={async () => {
          if (!friendToRemove) return;
          await runAction(friendToRemove.connectionId, () =>
            removeConnection(friendToRemove.connectionId),
          );
          setFriendToRemove(null);
        }}
        onCancel={() => setFriendToRemove(null)}
      />
    </div>
  );
}

export default FriendsPage;
