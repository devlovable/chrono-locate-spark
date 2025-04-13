
import { format, addHours, parseISO, addMinutes } from "date-fns";

export type TimeZone = {
  name: string;
  label: string;
  offset: number;
  city: string;
};

export type GeoLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  locationName?: string;
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
  // Add more common IANA timezone cities
  { name: "Europe/Berlin", label: "Berlin", offset: 1, city: "Berlin" },
  { name: "Asia/Dubai", label: "Dubai", offset: 4, city: "Dubai" },
  { name: "Asia/Singapore", label: "Singapore", offset: 8, city: "Singapore" },
  { name: "America/Toronto", label: "Toronto", offset: -5, city: "Toronto" },
  { name: "Australia/Melbourne", label: "Melbourne", offset: 10, city: "Melbourne" },
  { name: "Pacific/Auckland", label: "Auckland", offset: 12, city: "Auckland" },
  { name: "America/Mexico_City", label: "Mexico City", offset: -6, city: "Mexico City" },
  { name: "America/Sao_Paulo", label: "São Paulo", offset: -3, city: "São Paulo" }
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

export function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error("Error getting browser timezone:", error);
    return "UTC";
  }
}

export function getTimezoneByName(name: string): TimeZone | undefined {
  return timeZones.find(tz => tz.name === name);
}

export function getTimezoneByOffset(offset: number): TimeZone | undefined {
  return timeZones.find(tz => Math.abs(tz.offset - offset) < 0.1);
}

export function getUserLocalTimezone(): TimeZone {
  try {
    // First try to get timezone by name
    const browserTz = getBrowserTimezone();
    const timezoneByName = getTimezoneByName(browserTz);
    if (timezoneByName) return timezoneByName;
    
    // Fall back to offset-based detection
    const offsetHours = -new Date().getTimezoneOffset() / 60;
    const timezoneByOffset = getTimezoneByOffset(offsetHours);
    if (timezoneByOffset) return timezoneByOffset;
    
    // Default to UTC if all else fails
    return timeZones[0];
  } catch (error) {
    console.error("Error detecting user timezone:", error);
    return timeZones[0];
  }
}

export async function getUserGeolocation(): Promise<GeoLocation | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: GeoLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        
        try {
          // Try to get a location name using reverse geocoding
          const locationName = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          if (locationName) {
            location.locationName = locationName;
          }
        } catch (error) {
          console.error("Error getting location name:", error);
        }
        
        resolve(location);
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
}

async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  try {
    // Since we can't rely on external APIs in this environment, we'll use a simple approach
    // In a real app, you would use a geocoding service like Google Maps, Mapbox, etc.
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
}
