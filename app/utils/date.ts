// Post dates are bare `YYYY-MM-DD`, which `Date` parses as UTC midnight.
// Formatting without a fixed `timeZone` then uses the runtime's zone, so the
// server (UTC) and a browser west of UTC disagree about the calendar day —
// a wrong date, and a hydration mismatch wherever this runs client-side.
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

