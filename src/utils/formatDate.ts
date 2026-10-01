// Turns "2025-03-12" (or a full ISO date from the API) into "12 Mar 2025"
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC", // dates are stored as midnight UTC, so read them in UTC too
  });
}
