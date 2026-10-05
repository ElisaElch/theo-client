import { BellOff, Bell, UserMinus } from "lucide-react";
import type { Friend } from "../../types/friends";
import { Link } from "react-router";

type Props = {
  friends: Friend[];
  busyId: string | null;
  onToggleMute: (friend: Friend) => void;
  onRemove: (friend: Friend) => void; // the page asks "are you sure?" first
};

// Your friends, with Mute / Unmute and Remove
function FriendsList({ friends, busyId, onToggleMute, onRemove }: Props) {
  return (
    <section className="card flex flex-col gap-3 bg-soft-white p-6">
      <h2 className="text-2xl">Your friends ({friends.length})</h2>

      {friends.length === 0 ? (
        <p className="text-ink/70">
          No friends yet. Find someone by their username, or share your invite link.
        </p>
      ) : (
        friends.map((friend) => (
          <div
            key={friend.connectionId}
            className="flex flex-wrap items-center justify-between gap-3 rounded-box bg-base-200 p-4"
          >
            <div>
              <p className="flex items-center gap-2 font-medium">
                <Link
                  to={`/friends/${friend.user.id}`}
                  className="hover:text-forest hover:underline"
                >
                  {friend.user.name}
                </Link>
                {friend.isMuted && <span className="badge badge-sm">Muted</span>}
              </p>
            </div>

            <div className="flex gap-1">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busyId === friend.connectionId}
                onClick={() => onToggleMute(friend)}
                title={
                  friend.isMuted
                    ? "Show their places in your feed and map again"
                    : "Stay friends, but hide their places from your feed and map"
                }
              >
                {friend.isMuted ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                {friend.isMuted ? "Unmute" : "Mute"}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm text-error"
                disabled={busyId === friend.connectionId}
                onClick={() => onRemove(friend)}
              >
                <UserMinus className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default FriendsList;
