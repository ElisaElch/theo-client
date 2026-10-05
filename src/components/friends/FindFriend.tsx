import { useEffect, useState, type KeyboardEvent } from "react";
import { Search, UserPlus } from "lucide-react";
import { acceptFriendRequest, searchUser, sendFriendRequest } from "../../api/friends";
import type { SearchResult } from "../../types/friends";

type Props = {
  initialUsername?: string; // filled in from an invite link
  onChanged: () => void; // tells the page to reload its lists
};

// Find someone by their EXACT username (privacy: no browsing, no partial matches)
function FindFriend({ initialUsername = "", onChanged }: Props) {
  const [username, setUsername] = useState(initialUsername);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  async function runSearch(name: string) {
    if (!name.trim()) return;

    setIsBusy(true);
    setError("");
    setResult(null);

    try {
      setResult(await searchUser(name.trim()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsBusy(false);
    }
  }

  // Opened from an invite link: search for that username straight away.
  // State is only set in .then(), once the answer has arrived.
  useEffect(() => {
    if (!initialUsername) return;
    let ignore = false;

    searchUser(initialUsername.trim())
      .then((found) => {
        if (!ignore) setResult(found);
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err.message : "Search failed");
      });

    return () => {
      ignore = true;
    };
  }, [initialUsername]);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch(username);
    }
  }

  // Add friend, or accept their request; then refresh this result and the page's lists
  async function handleAction(action: () => Promise<unknown>) {
    setIsBusy(true);
    setError("");
    try {
      await action();
      onChanged();
      await runSearch(username);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsBusy(false);
    }
  }

  // What to show next to the person, depending on any existing connection
  function renderAction(found: SearchResult) {
    if (found.isYou) {
      return <span className="text-sm text-ink/60">That's you!</span>;
    }
    if (!found.connection) {
      return (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={isBusy}
          onClick={() => handleAction(() => sendFriendRequest(found.user.id))}
        >
          <UserPlus className="h-4 w-4" />
          Add friend
        </button>
      );
    }
    if (found.connection.status === "accepted") {
      return <span className="badge badge-secondary">Friends</span>;
    }
    if (found.connection.sentByMe) {
      return <span className="text-sm text-ink/60">Request sent</span>;
    }
    return (
      <button
        type="button"
        className="btn btn-primary btn-sm"
        disabled={isBusy}
        onClick={() => handleAction(() => acceptFriendRequest(found.connection!.id))}
      >
        Accept request
      </button>
    );
  }

  return (
    <section className="card flex flex-col gap-3 bg-soft-white p-6">
      <h2 className="text-2xl">Find a friend</h2>
      <p className="text-sm text-ink/70">
        Search by their exact username. Ask them for it, or share your invite link.
      </p>

      <div className="flex gap-2">
        <label className="input w-full">
          <Search className="h-4 w-4 text-ink/50" />
          <input
            placeholder="e.g. theotravels"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </label>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => runSearch(username)}
          disabled={isBusy}
        >
          Search
        </button>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      {/* The person found: first name and username only */}
      {result && (
        <div className="flex items-center justify-between gap-3 rounded-box bg-base-200 p-4">
          <div>
            <p className="font-medium">{result.user.firstName}</p>
            <p className="text-sm text-ink/60">@{result.user.username}</p>
          </div>
          {renderAction(result)}
        </div>
      )}
    </section>
  );
}

export default FindFriend;
