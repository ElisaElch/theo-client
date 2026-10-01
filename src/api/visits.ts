import { apiFetch } from "./client";
import type { Photo, Place, Visit, PlaceType } from "../types/visit";

// What the frontend sends when saving a place:
// the place facts (without _id; the API finds or creates it) + the visit details
export type CreateVisitData = {
  place: Omit<Place, "_id">;
  type?: PlaceType; // this person's own category
  status?: "visited" | "wantToGo";
  visitDate?: string; // "2025-03-12"
  rating?: number; // 1–10, or 11 for exceptional
  exceptionalReason?: string; // required by the API when rating is 11
  isFavourite?: boolean;
  whatIHad?: string;
  memory?: string;
  tags?: string[];
  photos?: Photo[];
};

// Editing: any visit field, but never the place
export type UpdateVisitData = Partial<Omit<CreateVisitData, "place">>;

// POST /api/visits
export function createVisit(data: CreateVisitData) {
  return apiFetch<{ visit: Visit }>("/visits", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// GET /api/visits
export function getMyVisits() {
  return apiFetch<{ visits: Visit[] }>("/visits");
}

// GET /api/visits/:id
export function getVisit(id: string) {
  return apiFetch<{ visit: Visit }>(`/visits/${id}`);
}

// PATCH /api/visits/:id
export function updateVisit(id: string, data: UpdateVisitData) {
  return apiFetch<{ visit: Visit }>(`/visits/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// DELETE /api/visits/:id (204, no body)
export function deleteVisit(id: string) {
  return apiFetch<null>(`/visits/${id}`, { method: "DELETE" });
}
