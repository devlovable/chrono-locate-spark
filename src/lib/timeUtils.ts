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
    // Since we can't rely on external APIs in this environment, we'll use a basic mapping approach
    // This is a simplified approach to demonstrate the concept
    
    // Define some geographical regions based on latitude/longitude (very approximate)
    const regions: {bounds: [number, number, number, number], name: string}[] = [
      // Format: [minLat, maxLat, minLong, maxLong], name
      // North America
      {bounds: [24, 49, -125, -66], name: "United States"},
      {bounds: [49, 60, -140, -50], name: "Canada"},
      // Europe
      {bounds: [36, 71, -9, 30], name: "Europe"},
      {bounds: [50, 58, -10, 2], name: "United Kingdom"},
      {bounds: [42, 51, -5, 8], name: "France"},
      {bounds: [47, 55, 6, 15], name: "Germany"},
      // Asia
      {bounds: [20, 54, 100, 145], name: "China"},
      {bounds: [30, 37, 127, 142], name: "Japan"},
      {bounds: [8, 37, 68, 97], name: "India"},
      // Australia
      {bounds: [-43, -10, 113, 153], name: "Australia"},
      // South America
      {bounds: [-55, 12, -81, -35], name: "South America"},
      {bounds: [-33, -22, -70, -44], name: "Brazil"},
      // Africa
      {bounds: [-35, 37, -17, 51], name: "Africa"},
    ];
    
    // Find the matching region
    let locationName = "Unknown location";
    
    for (const region of regions) {
      const [minLat, maxLat, minLong, maxLong] = region.bounds;
      if (
        latitude >= minLat && 
        latitude <= maxLat && 
        longitude >= minLong && 
        longitude <= maxLong
      ) {
        locationName = region.name;
        break;
      }
    }
    
    // Add more specific cities if coordinates are close to known locations
    const cities: {coordinates: [number, number], name: string, radius: number}[] = [
      // Format: [lat, long], name, radius in degrees (approximate)
      {coordinates: [40.7128, -74.0060], name: "New York City, USA", radius: 0.5},
      {coordinates: [34.0522, -118.2437], name: "Los Angeles, USA", radius: 0.5},
      {coordinates: [51.5074, -0.1278], name: "London, UK", radius: 0.3},
      {coordinates: [48.8566, 2.3522], name: "Paris, France", radius: 0.3},
      {coordinates: [35.6762, 139.6503], name: "Tokyo, Japan", radius: 0.5},
      {coordinates: [22.3193, 114.1694], name: "Hong Kong", radius: 0.2},
      {coordinates: [19.0760, 72.8777], name: "Mumbai, India", radius: 0.4},
      {coordinates: [-33.8688, 151.2093], name: "Sydney, Australia", radius: 0.4},
      {coordinates: [55.7558, 37.6173], name: "Moscow, Russia", radius: 0.5},
      {coordinates: [-22.9068, -43.1729], name: "Rio de Janeiro, Brazil", radius: 0.4},
      {coordinates: [52.5200, 13.4050], name: "Berlin, Germany", radius: 0.3},
      {coordinates: [41.9028, 12.4964], name: "Rome, Italy", radius: 0.2},
      {coordinates: [37.7749, -122.4194], name: "San Francisco, USA", radius: 0.3},
      {coordinates: [1.3521, 103.8198], name: "Singapore", radius: 0.2},
      {coordinates: [25.2048, 55.2708], name: "Dubai, UAE", radius: 0.3},
    ];
    
    for (const city of cities) {
      const [cityLat, cityLong] = city.coordinates;
      // Calculate rough distance (this is not accurate but sufficient for this demo)
      const latDiff = Math.abs(latitude - cityLat);
      const longDiff = Math.abs(longitude - cityLong);
      const distance = Math.sqrt(latDiff * latDiff + longDiff * longDiff);
      
      if (distance <= city.radius) {
        return city.name;
      }
    }
    
    // If no specific city is found, return the region
    return locationName !== "Unknown location" 
      ? `${locationName} (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`
      : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
}
