import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { getFriendsWhoVisited } from "../../api/visits";
import type { FriendWhoVisited } from "../../types/friends";
import Avatar from "../Avatar";

const MAX_AVATARS = 4; // more than this shows a "+2" bubble instead

// "Lena", "Lena and Tom", "Lena, Tom and Sam", "Lena, Tom and 2 others"
// (first names only, to keep the line short)
function namesText(friends: FriendWhoVisited[]): string {
  const names = friends.map(({ friend }) => friend.name.split(" ")[0]);

  if (names.length <= 3) {
    // en-GB: "Lena, Tom and Sam" (no comma before "and")
    return new Intl.ListFormat("en-GB", { type: "conjunction" }).format(names);
  }
  return `${names.slice(0, 2).join(", ")} and ${names.length - 2} others`;
}

type Props = {
  visitId: string; // your visit on this Place page
};

// "(●)(●)(●) Lena, Tom and 2 others also visited" on the Place page.
// Shows nothing at all if no friends have been here (or if loading fails:
// it's extra information, so the page shouldn't show an error for it).
function FriendsWhoVisited({ visitId }: Props) {
  const [friends, setFriends] = useState<FriendWhoVisited[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let ignore = false;

    getFriendsWhoVisited(visitId)
      .then(({ friends }) => {
        if (!ignore) setFriends(friends);
      })
      .catch(() => {
        if (!ignore) setFriends([]);
      });

    return () => {
      ignore = true;
    };
  }, [visitId]);

  if (friends.length === 0) return null;

  const extraCount = friends.length - MAX_AVATARS;

  // The avatars and the line of text (used inside the link or the button below)
  const summary = (
    <>
      <span className="flex -space-x-2">
        {friends.slice(0, MAX_AVATARS).map(({ friend }) => (
          <Avatar
            key={friend.id}
            name={friend.name}
            url={friend.avatarUrl}
            size="sm"
            className="ring-2 ring-cream"
          />
        ))}
        {extraCount > 0 && (
          <span className="flex aspect-square w-8 items-center justify-center rounded-full bg-forest text-xs text-cream ring-2 ring-cream">
            +{extraCount}
          </span>
        )}
      </span>
      <span className="text-sm text-ink/70 group-hover:underline">
        <span className="font-medium text-ink">{namesText(friends)}</span> also visited
      </span>
    </>
  );

  const rowClasses = "group flex items-center gap-3 self-start text-left";

  // Just one friend: go straight to their visit, no pop-up needed
  if (friends.length === 1) {
    const { friend, visitId: friendVisitId } = friends[0];
    return (
      <Link to={`/friends/${friend.id}/places/${friendVisitId}`} className={rowClasses}>
        {summary}
      </Link>
    );
  }

  // Several friends: open a pop-up with the full list
  return (
    <>
      <button type="button" className={rowClasses} onClick={() => dialogRef.current?.showModal()}>
        {summary}
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box bg-soft-white">
          <h2 className="mb-4 text-2xl">Friends who visited</h2>

          <ul className="flex flex-col gap-1">
            {friends.map(({ friend, visitId: friendVisitId }) => (
              <li key={friend.id}>
                <Link
                  to={`/friends/${friend.id}/places/${friendVisitId}`}
                  className="flex items-center gap-3 rounded-box p-2 hover:bg-base-200"
                >
                  <Avatar name={friend.name} url={friend.avatarUrl} size="md" />
                  <span className="flex flex-col">
                    <span className="font-medium">{friend.name}</span>
                    <span className="text-sm text-ink/60">@{friend.username}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Close</button>
            </form>
          </div>
        </div>

        {/* Clicking outside the box closes it too */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default FriendsWhoVisited;
