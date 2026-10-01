// Returns a resized version of a Cloudinary image, by adding instructions to its URL.
// e.g. .../image/upload/v123/photo.jpg → .../image/upload/w_800,c_limit,q_auto,f_auto/v123/photo.jpg
export function cloudinaryImage(url: string, width: number): string {
  return url.replace("/upload/", `/upload/w_${width},c_limit,q_auto,f_auto/`);
}
