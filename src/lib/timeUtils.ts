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
  country?: string;
  city?: string;
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
  { name: "EET", label: "Cairo", offset: 2, city: "Cairo" }, // Adding explicit Eastern European Time zone for Egypt
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
  // Get the current UTC time
  const now = new Date();
  
  // Calculate the time directly using UTC methods
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();
  const utcMilliseconds = now.getUTCMilliseconds();
  
  // Clone the date to avoid modifying the original
  const targetDate = new Date(now);
  
  // Apply the timezone offset to get the correct time
  const targetHours = utcHours + timezone.offset;
  
  // Set the hours accounting for the timezone offset
  targetDate.setUTCHours(targetHours);
  
  // For debugging
  console.log(`Time calculation for ${timezone.name} (${timezone.city}):`);
  console.log(`- Current UTC time: ${now.toUTCString()}`);
  console.log(`- UTC Hours: ${utcHours}, UTC Minutes: ${utcMinutes}`);
  console.log(`- Target timezone offset: ${timezone.offset} hours`);
  console.log(`- Final time in ${timezone.city}: ${targetDate.toISOString()}`);
  
  return targetDate;
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
  
  // Get UTC time by removing the fromTimezone offset
  // First, normalize to UTC
  const localOffset = date.getTimezoneOffset();
  const utcDate = new Date(date.getTime() + localOffset * 60000);
  
  // Then remove fromTimezone offset and add toTimezone offset
  const fromOffsetMs = fromTimezone.offset * 60 * 60000;
  const toOffsetMs = toTimezone.offset * 60 * 60000;
  
  return new Date(utcDate.getTime() - fromOffsetMs + toOffsetMs);
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
    // Get browser's timezone name
    const browserTz = getBrowserTimezone();
    console.log("Browser timezone:", browserTz);
    
    // Try to find a direct match in our timeZones array
    let timezoneByName = timeZones.find(tz => 
      tz.name === browserTz || 
      browserTz.includes(tz.name)
    );
    
    if (timezoneByName) {
      console.log("Found timezone by name:", timezoneByName);
      return timezoneByName;
    }
    
    // If no direct match, calculate the browser's actual offset
    const now = new Date();
    const offsetInMinutes = -now.getTimezoneOffset();
    const offsetInHours = offsetInMinutes / 60;
    
    console.log("Browser timezone offset (hours):", offsetInHours);
    
    // Find timezone with the closest offset
    const timezoneByOffset = timeZones.reduce((closest, current) => {
      const currentDiff = Math.abs(current.offset - offsetInHours);
      const closestDiff = Math.abs(closest.offset - offsetInHours);
      return currentDiff < closestDiff ? current : closest;
    }, timeZones[0]);
    
    console.log("Found timezone by offset:", timezoneByOffset);
    return timezoneByOffset;
  } catch (error) {
    console.error("Error detecting user timezone:", error);
    return timeZones[0]; // Default to UTC
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
          const locationInfo = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          if (locationInfo) {
            location.locationName = locationInfo.fullName;
            location.country = locationInfo.country;
            location.city = locationInfo.city;
            
            // Special case for Egypt - set the time zone explicitly
            if (locationInfo.country === "Egypt") {
              console.log("Location detected in Egypt, setting EET timezone");
              // This will be used in the Index component to set the localTimezone
              (location as any).timeZone = timeZones.find(tz => tz.name === "EET") || 
                                          { name: "EET", label: "Cairo", offset: 2, city: "Cairo" };
            }
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

async function reverseGeocode(latitude: number, longitude: number): Promise<{
  fullName: string;
  country: string;
  city: string;
} | null> {
  try {
    // Improve Egypt detection - adding more precise boundaries
    const regions: {bounds: [number, number, number, number], name: string, country: string}[] = [
      // Format: [minLat, maxLat, minLong, maxLong], name, country
      // North America
      {bounds: [24, 49, -125, -66], name: "United States", country: "United States"},
      {bounds: [49, 60, -140, -50], name: "Canada", country: "Canada"},
      // Europe
      {bounds: [50, 58, -10, 2], name: "United Kingdom", country: "United Kingdom"},
      {bounds: [42, 51, -5, 8], name: "France", country: "France"},
      {bounds: [47, 55, 6, 15], name: "Germany", country: "Germany"},
      {bounds: [36, 44, 7, 18], name: "Italy", country: "Italy"},
      {bounds: [36, 44, -9, 3], name: "Spain", country: "Spain"},
      // Asia
      {bounds: [20, 54, 100, 145], name: "China", country: "China"},
      {bounds: [30, 37, 127, 142], name: "Japan", country: "Japan"},
      {bounds: [8, 37, 68, 97], name: "India", country: "India"},
      {bounds: [35, 42, 126, 130], name: "South Korea", country: "South Korea"},
      // Australia
      {bounds: [-43, -10, 113, 153], name: "Australia", country: "Australia"},
      // South America
      {bounds: [-33, -22, -70, -44], name: "Brazil", country: "Brazil"},
      {bounds: [-55, -22, -76, -53], name: "Argentina", country: "Argentina"},
      // Africa
      {bounds: [-35, -22, 16, 33], name: "South Africa", country: "South Africa"},
      {bounds: [27, 32, 30, 33], name: "Egypt", country: "Egypt"},
      // More specific bounds for Egypt (update the boundaries to be more accurate)
      {bounds: [22, 32, 25, 36], name: "Egypt", country: "Egypt"},
    ];
    
    // Add more Egyptian cities
    const cities: {coordinates: [number, number], name: string, country: string, radius: number}[] = [
      // Format: [lat, long], city name, country name, radius in degrees (approximate)
      {coordinates: [40.7128, -74.0060], name: "New York City", country: "United States", radius: 0.5},
      {coordinates: [34.0522, -118.2437], name: "Los Angeles", country: "United States", radius: 0.5},
      {coordinates: [41.8781, -87.6298], name: "Chicago", country: "United States", radius: 0.5},
      {coordinates: [29.7604, -95.3698], name: "Houston", country: "United States", radius: 0.5},
      {coordinates: [37.7749, -122.4194], name: "San Francisco", country: "United States", radius: 0.4},
      {coordinates: [45.5017, -73.5673], name: "Montreal", country: "Canada", radius: 0.4},
      {coordinates: [43.6532, -79.3832], name: "Toronto", country: "Canada", radius: 0.4},
      {coordinates: [49.2827, -123.1207], name: "Vancouver", country: "Canada", radius: 0.4},
      
      {coordinates: [51.5074, -0.1278], name: "London", country: "United Kingdom", radius: 0.3},
      {coordinates: [55.9533, -3.1883], name: "Edinburgh", country: "United Kingdom", radius: 0.3},
      {coordinates: [53.4808, -2.2426], name: "Manchester", country: "United Kingdom", radius: 0.3},
      
      {coordinates: [48.8566, 2.3522], name: "Paris", country: "France", radius: 0.3},
      {coordinates: [43.2965, 5.3698], name: "Marseille", country: "France", radius: 0.3},
      {coordinates: [45.7640, 4.8357], name: "Lyon", country: "France", radius: 0.3},
      
      {coordinates: [52.5200, 13.4050], name: "Berlin", country: "Germany", radius: 0.3},
      {coordinates: [48.1351, 11.5820], name: "Munich", country: "Germany", radius: 0.3},
      {coordinates: [50.1109, 8.6821], name: "Frankfurt", country: "Germany", radius: 0.3},
      
      {coordinates: [41.9028, 12.4964], name: "Rome", country: "Italy", radius: 0.3},
      {coordinates: [45.4642, 9.1900], name: "Milan", country: "Italy", radius: 0.3},
      {coordinates: [43.7696, 11.2558], name: "Florence", country: "Italy", radius: 0.3},
      
      {coordinates: [40.4168, -3.7038], name: "Madrid", country: "Spain", radius: 0.3},
      {coordinates: [41.3851, 2.1734], name: "Barcelona", country: "Spain", radius: 0.3},
      
      {coordinates: [35.6762, 139.6503], name: "Tokyo", country: "Japan", radius: 0.5},
      {coordinates: [34.6937, 135.5023], name: "Osaka", country: "Japan", radius: 0.5},
      
      {coordinates: [39.9042, 116.4074], name: "Beijing", country: "China", radius: 0.5},
      {coordinates: [31.2304, 121.4737], name: "Shanghai", country: "China", radius: 0.5},
      {coordinates: [22.3193, 114.1694], name: "Hong Kong", country: "China", radius: 0.3},
      
      {coordinates: [28.6139, 77.2090], name: "New Delhi", country: "India", radius: 0.4},
      {coordinates: [19.0760, 72.8777], name: "Mumbai", country: "India", radius: 0.4},
      {coordinates: [12.9716, 77.5946], name: "Bangalore", country: "India", radius: 0.4},
      
      {coordinates: [37.5665, 126.9780], name: "Seoul", country: "South Korea", radius: 0.4},
      
      {coordinates: [-33.8688, 151.2093], name: "Sydney", country: "Australia", radius: 0.4},
      {coordinates: [-37.8136, 144.9631], name: "Melbourne", country: "Australia", radius: 0.4},
      {coordinates: [-27.4698, 153.0251], name: "Brisbane", country: "Australia", radius: 0.4},
      
      {coordinates: [-22.9068, -43.1729], name: "Rio de Janeiro", country: "Brazil", radius: 0.4},
      {coordinates: [-23.5505, -46.6333], name: "São Paulo", country: "Brazil", radius: 0.4},
      
      {coordinates: [-34.6037, -58.3816], name: "Buenos Aires", country: "Argentina", radius: 0.4},
      
      {coordinates: [-33.9249, 18.4241], name: "Cape Town", country: "South Africa", radius: 0.4},
      {coordinates: [-26.2041, 28.0473], name: "Johannesburg", country: "South Africa", radius: 0.4},
      
      {coordinates: [30.0444, 31.2357], name: "Cairo", country: "Egypt", radius: 0.4},
      
      {coordinates: [1.3521, 103.8198], name: "Singapore", country: "Singapore", radius: 0.2},
      {coordinates: [25.2048, 55.2708], name: "Dubai", country: "United Arab Emirates", radius: 0.3},
      {coordinates: [55.7558, 37.6173], name: "Moscow", country: "Russia", radius: 0.5},
      // Add more Egyptian cities with better precision
      {coordinates: [31.2001, 29.9187], name: "Alexandria", country: "Egypt", radius: 0.3},
      {coordinates: [31.4175, 31.8144], name: "Mansoura", country: "Egypt", radius: 0.3},
      {coordinates: [30.8428, 30.5420], name: "Tanta", country: "Egypt", radius: 0.3}, // This is close to the coordinates from the user
      {coordinates: [30.0086, 31.4286], name: "Heliopolis", country: "Egypt", radius: 0.3},
      {coordinates: [25.6872, 32.6396], name: "Luxor", country: "Egypt", radius: 0.3},
      {coordinates: [31.1656, 30.0472], name: "Giza", country: "Egypt", radius: 0.3},
      {coordinates: [24.0889, 32.8998], name: "Aswan", country: "Egypt", radius: 0.3},
      {coordinates: [29.9773, 32.5269], name: "Suez", country: "Egypt", radius: 0.3},
      {coordinates: [31.1139, 33.8006], name: "Port Said", country: "Egypt", radius: 0.3},
      {coordinates: [27.2579, 31.2126], name: "Minya", country: "Egypt", radius: 0.3},
    ];
    
    // Try to find a matching city first (more precise)
    for (const city of cities) {
      const [cityLat, cityLong] = city.coordinates;
      // Calculate rough distance (this is not accurate but sufficient for this demo)
      const latDiff = Math.abs(latitude - cityLat);
      const longDiff = Math.abs(longitude - cityLong);
      const distance = Math.sqrt(latDiff * latDiff + longDiff * longDiff);
      
      if (distance <= city.radius) {
        return {
          fullName: `${city.name}, ${city.country}`,
          city: city.name,
          country: city.country
        };
      }
    }
    
    // Egypt-specific check
    if (latitude >= 22 && latitude <= 32 && longitude >= 25 && longitude <= 36) {
      // We're in Egypt but not in a known city
      return {
        fullName: `Egypt (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
        country: "Egypt",
        city: `Location in Egypt`
      };
    }
    
    // If no city match, try to find the region/country
    let locationCountry = "Unknown";
    
    for (const region of regions) {
      const [minLat, maxLat, minLong, maxLong] = region.bounds;
      if (
        latitude >= minLat && 
        latitude <= maxLat && 
        longitude >= minLong && 
        longitude <= maxLong
      ) {
        locationCountry = region.country;
        break;
      }
    }
    
    // If we have at least the country, return with coordinates as the "city"
    if (locationCountry !== "Unknown") {
      const coordsStr = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      return {
        fullName: `${locationCountry} (${coordsStr})`,
        country: locationCountry,
        city: `Location at ${coordsStr}`
      };
    }
    
    // Fallback to just coordinates if we couldn't determine location
    const coordsStr = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    return {
      fullName: coordsStr,
      country: "Unknown",
      city: `Location at ${coordsStr}`
    };
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
}
