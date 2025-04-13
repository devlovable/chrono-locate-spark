
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import Header from '@/components/Header';
import WorldClock from '@/components/WorldClock';
import TimeConverter from '@/components/TimeConverter';
import LocationSearch from '@/components/LocationSearch';
import { Clock, ArrowLeftRight, Search, Globe, Calendar as CalendarIcon, MapPin, Sun, Sunset } from 'lucide-react';
import { timeZones, getCurrentTimeInTimeZone, TimeZone, getUserLocalTimezone, getUserGeolocation, GeoLocation } from '@/lib/timeUtils';
import { format } from 'date-fns';
import { toast } from '@/components/ui/sonner';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [localTimezone, setLocalTimezone] = useState<TimeZone>(timeZones[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<GeoLocation | null>(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    // Initialize time and location
    async function initializeTimeAndLocation() {
      try {
        setIsLoading(true);
        
        // Detect user's timezone
        const detectedTimezone = getUserLocalTimezone();
        console.log("Index - Detected timezone:", detectedTimezone);
        setLocalTimezone(detectedTimezone);
        
        // Try to get user's geolocation
        const geoLocation = await getUserGeolocation();
        if (geoLocation) {
          setUserLocation(geoLocation);
          setGpsEnabled(true);
          console.log("Detected location:", geoLocation);
          toast.success(`Location detected: ${geoLocation.city || geoLocation.locationName || 'Unknown'}`);
        }
        
        // Update time immediately
        const now = getCurrentTimeInTimeZone(detectedTimezone);
        setCurrentTime(now);
        
        toast.success(`Time synchronized with ${detectedTimezone.city} timezone`);
        setIsLoading(false);
      } catch (error) {
        console.error("Error determining local timezone or location:", error);
        toast.error("Could not detect your timezone. Using default.");
        setIsLoading(false);
      }
    }
    
    initializeTimeAndLocation();
  }, []); // Only run once on component mount

  // Separate effect for time updates with a faster refresh rate
  useEffect(() => {
    if (!localTimezone) return;
    
    console.log("Setting up time interval with timezone:", localTimezone);
    
    // Update time immediately
    const updateTime = () => {
      const now = getCurrentTimeInTimeZone(localTimezone);
      console.log("Updated current time:", now.toISOString());
      setCurrentTime(now);
    };
    
    // Call once
    updateTime();
    
    // Then set up interval (update more frequently - every 500ms)
    const interval = setInterval(updateTime, 500);
    
    return () => clearInterval(interval);
  }, [localTimezone]); // Re-run only if localTimezone changes

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-8">
        {/* Main Title and Location */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exact Time Now
          </h1>
          
          {userLocation && (
            <div className="flex items-center justify-center gap-1 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>
                {userLocation.city}{userLocation.country ? `, ${userLocation.country}` : ''}
              </span>
            </div>
          )}
          
          <div className="text-gray-600 mt-1">
            {format(currentTime, 'EEEE, MMMM d, yyyy')}
          </div>
        </div>
        
        {/* Main Time Display */}
        <div className="bg-white p-8 rounded-lg shadow-sm border mb-6 mx-auto max-w-lg">
          <h2 className="text-6xl font-semibold tracking-wider text-blue-600 text-center font-mono">
            <span>{format(currentTime, 'HH')}</span>
            <span>:</span>
            <span>{format(currentTime, 'mm')}</span>
            <span>:</span>
            <span>{format(currentTime, 'ss')}</span>
          </h2>
        </div>
        
        {/* Two-column layout for sun info and time zone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Sun Information */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center mb-2">
              <MapPin className="h-4 w-4 mr-1 text-gray-600" />
              <h3 className="font-medium">Ad Dilinjat</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-amber-500 mb-1">
                  <Sun className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Sunrise</span>
                </div>
                <div className="text-xl font-medium text-blue-600">05:30 AM</div>
              </div>
              
              <div>
                <div className="flex items-center text-orange-500 mb-1">
                  <Sunset className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Sunset</span>
                </div>
                <div className="text-xl font-medium text-blue-600">06:25 PM</div>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-gray-500">
              <span>Coordinate: 30.42°N, 31.15°E</span>
            </div>
          </div>
          
          {/* Time Zone Information */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <Globe className="h-4 w-4 mr-1 text-gray-600" />
              <h3 className="font-medium">Time Zone Information</h3>
            </div>
            
            <div className="text-gray-500 text-sm">
              Unable to retrieve time zone data
            </div>
          </div>
        </div>
        
        {/* Calendar Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex items-center mb-4">
            <CalendarIcon className="h-4 w-4 mr-1 text-gray-600" />
            <h3 className="font-medium">Calendar</h3>
          </div>
          
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md border"
            />
          </div>
        </div>
        
        {/* Popular world clocks section removed to make space for the calendar */}
        
        {/* Tabs section moved to after calendar */}
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
          <p className="mb-2">ChronoLocate - Track and convert time around the world with precision</p>
          <p className="text-xs">
            Time displayed is synchronized with atomic clock time. Precision may vary depending on your internet connection.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
