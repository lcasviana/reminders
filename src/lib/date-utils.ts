function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function dayDiff(a: Date, b: Date): number {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86_400_000);
}

const SHORT_WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SHORT_MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LONG_MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function getTimeOfDay(iso: string): "Morning" | "Afternoon" | "Tonight" {
  const h = new Date(iso).getHours();
  if (h < 12) return "Morning";
  if (h < 18) return "Afternoon";
  return "Tonight";
}

export function getScheduledGroup(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = dayDiff(d, now);

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";

  // Within this calendar week (up to and including Saturday)
  const daysUntilSaturday = 6 - now.getDay(); // Sun=0 → 6, Mon=1 → 5, …, Sat=6 → 0
  if (diff > 1 && diff <= daysUntilSaturday) {
    return `${SHORT_WEEKDAY[d.getDay()]} ${d.getDate()} ${SHORT_MONTH[d.getMonth()]}`;
  }

  // Rest of current month (after this week)
  if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
    return `Rest of ${LONG_MONTH[now.getMonth()]}`;
  }

  return LONG_MONTH[d.getMonth()];
}

export function getRelativeDateLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = dayDiff(now, d); // positive = d is in the past

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${SHORT_WEEKDAY[d.getDay()]} ${d.getDate()} ${SHORT_MONTH[d.getMonth()]}`;
  return LONG_MONTH[d.getMonth()];
}

export function formatDueTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = dayDiff(d, now);

  if (diff === 0) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  if (diff === 1) return "Tomorrow";
  return `${SHORT_WEEKDAY[d.getDay()]} ${d.getDate()} ${SHORT_MONTH[d.getMonth()]}`;
}
