import { apiFetch } from "./client";

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