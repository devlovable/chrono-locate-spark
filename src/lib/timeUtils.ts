
import { format, addHours, parseISO, addMinutes } from "date-fns";

export type TimeZone = {
  name: string;
  label: string;
  offset: number;
  city: string;
};

export const timeZones: TimeZone[] = [
  { name: "UTC", label: "UTC", offset: 0, city: "Universal Time Coordinated" },
  { name: "EST", label: "New York", offset: -5, city: "New York" },
  { name: "PST", label: "Los Angeles", offset: -8, city: "Los Angeles" },
  { name: "JST", label: "Tokyo", offset: 9, city: "Tokyo" },
  { name: "CET", label: "Paris", offset: 1, city: "Paris" },
  { name: "IST", label: "New Delhi", offset: 5.5, city: "New Delhi" },
  { name: "AEST", label: "Sydney", offset: 10, city: "Sydney" },
  { name: "GMT", label: "London", offset: 0, city: "London" },
];

export function getCurrentTimeInTimeZone(timezone: TimeZone): Date {
  const now = new Date();
  const utcDate = addMinutes(now, now.getTimezoneOffset());
  return addHours(utcDate, timezone.offset);
}

export function formatTime(date: Date, formatString: string = "h:mm a"): string {
  return format(date, formatString);
}

export function formatTimeWithDay(date: Date): string {
  return format(date, "EEE, MMM d, h:mm a");
}

export function convertTime(time: string, fromTimezone: TimeZone, toTimezone: TimeZone): Date {
  // Parse the time string as a date in the from timezone
  const date = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  
  // Set the hours and minutes
  date.setHours(hours);
  date.setMinutes(minutes);
  
  // Convert to UTC
  const utcDate = addMinutes(date, date.getTimezoneOffset());
  
  // Adjust for the from timezone
  const sourceDate = addHours(utcDate, -fromTimezone.offset);
  
  // Convert to the destination timezone
  return addHours(sourceDate, toTimezone.offset);
}

export function searchTimeZones(query: string): TimeZone[] {
  if (!query) return timeZones;
  
  const lowerQuery = query.toLowerCase();
  return timeZones.filter(
    tz => 
      tz.name.toLowerCase().includes(lowerQuery) || 
      tz.city.toLowerCase().includes(lowerQuery) ||
      tz.label.toLowerCase().includes(lowerQuery)
  );
}
