import { apiFetch } from "./client";
import type { FeedItem } from "../types/friends";

// GET /api/feed: places your friends have saved recently (muted friends left out)
export function getFeed() {
  return apiFetch<{ items: FeedItem[] }>("/feed");
}
