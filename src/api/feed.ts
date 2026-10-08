import { apiFetch } from "./client";
import type { ActivityGroup, FeedItem } from "../types/friends";

// GET /api/feed: places your friends have saved recently (muted friends left out)
export function getFeed() {
  return apiFetch<{ items: FeedItem[] }>("/feed");
}

// GET /api/feed/groups: friends' places from the last 7 days, grouped by friend and day
export function getActivityGroups() {
  return apiFetch<{ groups: ActivityGroup[] }>("/feed/groups");
}