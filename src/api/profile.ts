import { apiFetch } from "./client";
import type { User } from "../types/user";

// What can be changed on the Edit profile page. Every field is optional:
// only the ones sent are changed, and "" clears a field (except the first name).
export type UpdateProfileData = {
  firstName?: string;
  lastName?: string;
  location?: string;
  bio?: string;
};

// PATCH /api/users/me: saves name, home city and bio. Returns the updated user.
export function updateProfile(data: UpdateProfileData) {
  return apiFetch<{ user: User }>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// PUT /api/users/me/avatar: uploads or replaces MY profile photo.
// Returns the new photo's address.
export function updateAvatar(file: File) {
  const formData = new FormData();

  // "photos" is the field name parsePhotos reads on the API
  formData.append("photos", file);

  return apiFetch<{ avatarUrl: string }>("/users/me/avatar", {
    method: "PUT",
    body: formData,
  });
}

// DELETE /api/users/me/avatar: removes MY profile photo (back to the letter circle)
export function removeAvatar() {
  return apiFetch<{ avatarUrl: null }>("/users/me/avatar", { method: "DELETE" });
}