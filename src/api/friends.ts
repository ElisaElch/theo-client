import { apiFetch } from "./client";
import type {
  ConnectionsResponse,
  SearchResult,
  FriendProfileResponse,
  FriendVisitResponse,
} from "../types/friends";

// GET /api/users/search?username=...
export function searchUser(username: string) {
  const params = new URLSearchParams({ username });
  return apiFetch<SearchResult>(`/users/search?${params}`);
}

// GET /api/connections: friends, incoming and outgoing requests
export function getConnections() {
  return apiFetch<ConnectionsResponse>("/connections");
}

// POST /api/connections: send a friend request
export function sendFriendRequest(userId: string) {
  return apiFetch<{ autoAccepted?: boolean }>("/connections", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

// PATCH /api/connections/:id/accept
export function acceptFriendRequest(connectionId: string) {
  return apiFetch<unknown>(`/connections/${connectionId}/accept`, { method: "PATCH" });
}

// PATCH /api/connections/:id/mute
export function setFriendMuted(connectionId: string, muted: boolean) {
  return apiFetch<{ isMuted: boolean }>(`/connections/${connectionId}/mute`, {
    method: "PATCH",
    body: JSON.stringify({ muted }),
  });
}

// DELETE /api/connections/:id: decline, cancel or remove a friend
export function removeConnection(connectionId: string) {
  return apiFetch<null>(`/connections/${connectionId}`, { method: "DELETE" });
}

// GET /api/users/:id/visits: a friend's places (404 if not friends)
export function getFriendVisits(userId: string) {
  return apiFetch<FriendProfileResponse>(`/users/${userId}/visits`);
}

// GET /api/users/:id/visits/:visitId: one of a friend's places, in full
export function getFriendVisit(userId: string, visitId: string) {
  return apiFetch<FriendVisitResponse>(`/users/${userId}/visits/${visitId}`);
}
