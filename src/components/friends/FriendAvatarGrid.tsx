import { Link } from "react-router";
import type { Friend } from "../../types/friends";
import Avatar from "../Avatar";

type Props = {
  friends: Friend[];
};

// Grid of round avatars with first name and number of places.
// Each one opens that friend's profile.
function FriendAvatarGrid({ friends }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
      {friends.map((friend) => (
        <Link
          key={friend.connectionId}
          to={`/friends/${friend.user.id}`}
          className="group flex flex-col items-center gap-1 text-center"
        >
          {/* Photo Avatar */}
                  <Avatar
            name={friend.user.name}
            url={friend.user.avatarUrl}
            size="lg"
            className="transition group-hover:ring-2 group-hover:ring-forest"
          />
          <span className="font-medium group-hover:text-forest">
            {friend.user.name.split(" ")[0]}
          </span>
          <span className="text-xs text-ink/60">
            {friend.placeCount} {friend.placeCount === 1 ? "place" : "places"}
          </span>
        </Link>
      ))}
    </div>
  );
}

export default FriendAvatarGrid;
