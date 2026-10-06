import { useOutletContext } from "react-router";
import type { ConnectionsResponse } from "../../types/friends";

// What FriendsLayout shares with every Friends page
export type FriendsData = {
  connections: ConnectionsResponse; // friends, incoming and outgoing requests
  reload: () => Promise<void>; // call after accepting, removing, muting...
};

// Use in any page inside the Friends section:
// const { connections, reload } = useFriendsData();
export function useFriendsData() {
  return useOutletContext<FriendsData>();
}
