// Today's date as "YYYY-MM-DD" in the user's OWN time zone.
// (toISOString() would give the UTC date, which is "yesterday" just after midnight in Europe.)
export function todayLocal(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // months count from 0
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}