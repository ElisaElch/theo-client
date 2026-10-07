import type { Visit } from "./visit";

// A person you're allowed to see in full: friends, and people who sent you a request
export type FriendUser = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null; // null = no profile photo
};

// Matches the API's /api/users/search and /api/connections responses

// GET /api/users/search: searchers only see the username and first name
export type SearchResult = {
  user: { id: string; username: string; firstName: string };
  isYou: boolean;
  connection: {
    id: string;
    status: "pending" | "accepted";
    sentByMe: boolean;
  } | null;
};

// A friend: full name, how many places they've saved, and whether *I* have muted them
export type Friend = {
  connectionId: string;
  user: FriendUser;
  placeCount: number;
  isMuted: boolean;
};

// A request sent to me: full name, so I can be sure who it is
export type IncomingRequest = {
  connectionId: string;
  user: FriendUser;
};

// A request I sent: first name only, as in search
export type OutgoingRequest = {
  connectionId: string;
  user: { id: string; firstName: string; username: string };
};

// GET /api/connections
export type ConnectionsResponse = {
  friends: Friend[];
  incoming: IncomingRequest[];
  outgoing: OutgoingRequest[];
};

// A friend's visit: the same as your own visits, minus the private parts.
// No dates (visitDate, createdAt, updatedAt), as friends never see WHEN you were somewhere.
export type FriendVisit = Omit<
  Visit,
  "user" | "status" | "visitDate" | "sourceUrl" | "createdAt" | "updatedAt"
>;

// GET /api/users/:id/visits
export type FriendProfileResponse = {
  friend: FriendUser;
  visits: FriendVisit[];
};

// GET /api/users/:id/visits/:visitId
export type FriendVisitResponse = {
  friend: FriendUser;
  visit: FriendVisit;
};

// GET /api/feed: friends' recent places, newest first (no timestamps)
export type FeedItem = {
  friend: FriendUser;
  visit: FriendVisit;
};
