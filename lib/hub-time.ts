/**
 * Shared 12-hour / 24-hour time helpers for the Admin Hub Management feature.
 *
 * The UI uses a 12-hour clock (Hour 01–12 + AM/PM) while the backend expects
 * Java LocalTime as a 24-hour "HH:mm:ss" string. Every write converts to
 * 24-hour before sending, and every read converts 24-hour back to 12-hour
 * for display.
 */

export type TimePeriod = "AM" | "PM";
export const PERIODS: TimePeriod[] = ["AM", "PM"];

export const HOURS_12: string[] = Array.from(
  { length: 12 },
  (_, i) => String(i + 1).padStart(2, "0")
); // "01" .. "12"

export const MINUTES_60: string[] = Array.from(
  { length: 60 },
  (_, i) => String(i).padStart(2, "0")
); // "00" .. "59"

export const SECONDS_60: string[] = Array.from(
  { length: 60 },
  (_, i) => String(i).padStart(2, "0")
); // "00" .. "59"

export interface Time12 {
  hour: string; // "01" .. "12"
  minute: string; // "00" .. "59"
  second: string; // "00" .. "59"
  period: TimePeriod;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Convert a 12-hour form to a 24-hour "HH:mm:ss" string for the backend.
 * Examples:
 *   7:00:00 AM  -> "07:00:00"
 *   3:35:00 PM  -> "15:35:00"
 *   12:30:00 AM -> "00:30:00"  (midnight)
 *   12:30:00 PM -> "12:30:00"  (noon)
 */
export function twelveTo24String(t: Time12): string {
  const h12 = Number(t.hour) || 1; // fallback to 1 if malformed
  const isPm = t.period === "PM";
  const h24 = isPm ? (h12 % 12) + 12 : h12 % 12;
  return `${pad2(h24)}:${pad2(Number(t.minute) || 0)}:${pad2(Number(t.second) || 0)}`;
}

/**
 * Parse a backend LocalTime — either a "HH:mm:ss" string or an object
 * ({ hour, minute, second, nano }) — into a 12-hour form.
 * Returns null when there is no usable value (missing/null/malformed).
 */
export function toTwelveHour(t: unknown): Time12 | null {
  if (t == null) return null;

  let hour = 0;
  let minute = 0;
  let second = 0;

  if (typeof t === "string") {
    const parts = t.split(":");
    if (parts.length < 2) return null;
    hour = Number(parts[0]) || 0;
    minute = Number(parts[1]) || 0;
    second = Number(parts[2]) || 0;
  } else if (typeof t === "object") {
    const o = t as { hour?: unknown; minute?: unknown; second?: unknown };
    hour = Number(o.hour) || 0;
    minute = Number(o.minute) || 0;
    second = Number(o.second) || 0;
  } else {
    return null;
  }

  if (hour > 23 || minute > 59 || second > 59) return null;

  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const period: TimePeriod = hour >= 12 ? "PM" : "AM";
  return { hour: pad2(h12), minute: pad2(minute), second: pad2(second), period };
}

/**
 * Format a backend time for display, e.g. "7:35:00 PM" (or "N/A" when missing).
 */
export function formatTime12(t: unknown): string {
  const v = toTwelveHour(t);
  if (!v) return "N/A";
  return `${Number(v.hour)}:${v.minute}:${v.second} ${v.period}`;
}

/** Always-valid 12-hour default: 12:00:00 AM == "00:00:00" (24-hour midnight). */
export function defaultTime12(): Time12 {
  return { hour: "12", minute: "00", second: "00", period: "AM" };
}
