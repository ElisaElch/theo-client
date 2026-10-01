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

// Turns the form's photos into the final list to save on a visit:
// new photos (files) are uploaded, existing ones are kept, and the order stays the same
export async function preparePhotos(drafts: { file?: File; uploaded?: Photo }[]): Promise<Photo[]> {
  const newFiles = drafts.flatMap((draft) => (draft.file ? [draft.file] : []));

  // Upload all new files in one request (skipped if there are none)
  const justUploaded = newFiles.length > 0 ? (await uploadPhotos(newFiles)).photos : [];

  // Put each photo back in its original position
  let nextUploaded = 0;
  return drafts.map((draft) => draft.uploaded ?? justUploaded[nextUploaded++]);
}
