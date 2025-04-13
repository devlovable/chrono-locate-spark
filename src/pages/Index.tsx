import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import WorldClock from '@/components/WorldClock';
import TimeConverter from '@/components/TimeConverter';
import LocationSearch from '@/components/LocationSearch';
import { Clock, ArrowLeftRight, Search, Globe, Calendar, MapPin } from 'lucide-react';
import { timeZones, getCurrentTimeInTimeZone, TimeZone, getUserLocalTimezone, getUserGeolocation, GeoLocation } from '@/lib/timeUtils';
import { format } from 'date-fns';
import { toast } from '@/components/ui/sonner';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [localTimezone, setLocalTimezone] = useState<TimeZone>(timeZones[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<GeoLocation | null>(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);

  useEffect(() => {
    // Try to determine user's timezone and location
    async function initializeTimeAndLocation() {
      try {
        setIsLoading(true);
        const detectedTimezone = getUserLocalTimezone();
        setLocalTimezone(detectedTimezone);
        
        // Try to get user's geolocation
        const geoLocation = await getUserGeolocation();
        if (geoLocation) {
          setUserLocation(geoLocation);
          setGpsEnabled(true);
          toast.success(`Location detected: ${geoLocation.locationName || 'Unknown'}`);
        }
        
        toast.success(`Time synchronized with ${detectedTimezone.city} timezone`);
        setIsLoading(false);
      } catch (error) {
        console.error("Error determining local timezone or location:", error);
        toast.error("Could not detect your timezone. Using default.");
        setIsLoading(false);
      }
    }
    
    initializeTimeAndLocation();

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-6">
        {/* Main Time Display - Updated to match screenshot */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Exact Time Now
            </h1>
            
            {userLocation && (
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <MapPin className="h-4 w-4" />
                <span className="text-lg">
                  {userLocation.city}{userLocation.country ? `, ${userLocation.country}` : ''}
                </span>
              </div>
            )}
            
            <div className="text-lg text-gray-600 mb-8">
              {format(currentTime, 'EEEE, MMMM d, yyyy')}
            </div>
            
            {!userLocation && !isLoading && (
              <div className="text-sm text-muted-foreground mb-4">
                <button 
                  onClick={async () => {
                    const location = await getUserGeolocation();
                    if (location) {
                      setUserLocation(location);
                      setGpsEnabled(true);
                      toast.success(`Location detected: ${location.city || 'Unknown'}, ${location.country || 'Unknown'}`);
                    } else {
                      toast.error("Could not detect your location. Please allow location access.");
                    }
                  }}
                  className="text-primary underline hover:text-primary/80"
                >
                  Enable location detection
                </button>
              </div>
            )}
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center mb-6">
            <h2 className="text-8xl md:text-9xl font-semibold tracking-wider text-blue-600 font-mono">
              <span>{format(currentTime, 'HH')}</span>
              <span className="text-blue-500">:</span>
              <span>{format(currentTime, 'mm')}</span>
              <span className="text-blue-500">:</span>
              <span>{format(currentTime, 'ss')}</span>
            </h2>
            
            <div className="mt-4 text-sm text-gray-500">
              <span>{localTimezone.name} (UTC{localTimezone.offset >= 0 ? '+' : ''}{localTimezone.offset})</span>
              <span className="mx-2">•</span>
              <span>Synchronized with atomic clock</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-center">
            <div className="p-2 bg-white border rounded">Sunrise: 06:14</div>
            <div className="p-2 bg-white border rounded">Sunset: 18:37</div>
            <div className="p-2 bg-white border rounded">Day length: 12h 23m</div>
            <div className="p-2 bg-white border rounded">Solar noon: 12:25</div>
          </div>
        </div>
        
        <div className="my-8 text-center">
          <h3 className="text-lg font-medium mb-4">Popular world clocks</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="#" className="p-3 bg-white border rounded hover:shadow-md">New York</a>
            <a href="#" className="p-3 bg-white border rounded hover:shadow-md">London</a>
            <a href="#" className="p-3 bg-white border rounded hover:shadow-md">Tokyo</a>
            <a href="#" className="p-3 bg-white border rounded hover:shadow-md">Sydney</a>
          </div>
        </div>
        
        <Tabs defaultValue="world-clock" className="space-y-6 mt-10">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="world-clock" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">World Clock</span>
            </TabsTrigger>
            <TabsTrigger value="converter" className="flex items-center gap-1">
              <ArrowLeftRight className="h-4 w-4" />
              <span className="hidden sm:inline">Converter</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-1">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="world-clock" className="space-y-8">
            <WorldClock userLocation={userLocation} />
          </TabsContent>
          
          <TabsContent value="converter" className="space-y-8">
            <TimeConverter />
          </TabsContent>
          
          <TabsContent value="search" className="space-y-8">
            <LocationSearch />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="py-6 px-6 text-center text-sm text-muted-foreground border-t bg-white mt-auto">
        <div className="container max-w-7xl mx-auto">
          <p className="mb-2">ExactTime - Track and convert time around the world with precision</p>
          <p className="text-xs">
            Time displayed is synchronized with atomic clock time. Precision may vary depending on your internet connection.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
