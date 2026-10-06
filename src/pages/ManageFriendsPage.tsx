import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { removeConnection, setFriendMuted } from "../api/friends";
import ConfirmDialog from "../components/ConfirmDialog";
import FriendsList from "../components/friends/FriendsList";
import { useFriendsData } from "../components/friends/friendsData";
import type { Friend } from "../types/friends";

// All your friends, with Mute / Unmute and Remove
function ManageFriendsPage() {
  const { connections, reload } = useFriendsData();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [friendToRemove, setFriendToRemove] = useState<Friend | null>(null);

  // Runs an action on one friend, then reloads
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

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <Link to="/friends" className="flex items-center gap-1 text-sm hover:text-forest">
        <ArrowLeft className="h-4 w-4" />
        Back to Friends
      </Link>

      <header>
        <h1 className="text-5xl">Manage friends</h1>
        <p className="mt-2 text-lg text-ink/70">
          Muting someone keeps you friends, but hides their places from your activity feed. They're
          never told.
        </p>
      </header>

      {error && (
        <div role="alert" className="alert alert-error">
          {error}
        </div>
      )}

      <FriendsList
        friends={connections.friends}
        busyId={busyId}
        onToggleMute={(friend) =>
          runAction(friend.connectionId, () => setFriendMuted(friend.connectionId, !friend.isMuted))
        }
        onRemove={setFriendToRemove}
      />

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

export default ManageFriendsPage;
