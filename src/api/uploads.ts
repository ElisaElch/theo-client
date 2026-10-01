import { apiFetch } from "./client";
import type { Photo } from "../types/visit";

// POST /api/uploads: sends image files and gets back [{ url, publicId }]
export function uploadPhotos(files: File[]) {
  const formData = new FormData();

  // Every file goes under the same field name, "photos",
  // which is the field parsePhotos reads on the API
  files.forEach((file) => formData.append("photos", file));

  return apiFetch<{ photos: Photo[] }>("/uploads", {
    method: "POST",
    body: formData,
  });
}
