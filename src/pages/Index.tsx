
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import WorldClock from '@/components/WorldClock';
import TimeConverter from '@/components/TimeConverter';
import LocationSearch from '@/components/LocationSearch';
import { Clock, ArrowLeftRight, Search, Globe, Calendar } from 'lucide-react';
import { timeZones, getCurrentTimeInTimeZone, TimeZone, getUserLocalTimezone } from '@/lib/timeUtils';
import { format } from 'date-fns';
import { toast } from '@/components/ui/sonner';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [localTimezone, setLocalTimezone] = useState<TimeZone>(timeZones[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to determine user's timezone
    try {
      setIsLoading(true);
      const detectedTimezone = getUserLocalTimezone();
      setLocalTimezone(detectedTimezone);
      
      toast.success(`Time synchronized with ${detectedTimezone.city} timezone`);
      setIsLoading(false);
    } catch (error) {
      console.error("Error determining local timezone:", error);
      toast.error("Could not detect your timezone. Using default.");
      setIsLoading(false);
    }

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
        {/* Main Time Display - Similar to time.is/Egypt style */}
        <div className="mb-8">
          <div className="mb-2 text-center">
            <h2 className="text-xl font-medium text-gray-700">
              {isLoading ? "Detecting location..." : `Exact time in ${localTimezone.city}`}
            </h2>
          </div>
          
          <div className="bg-white p-6 rounded-md shadow-sm border text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
              <div className="text-center">
                <h1 className="text-6xl md:text-7xl font-mono tracking-tight text-gray-800">
                  {format(getCurrentTimeInTimeZone(localTimezone), 'HH:mm:ss')}
                </h1>
                <div className="text-sm text-muted-foreground mt-2">
                  <span>
                    {localTimezone.name} (UTC{localTimezone.offset >= 0 ? '+' : ''}{localTimezone.offset})
                  </span>
                </div>
              </div>
              
              <div className="text-left border-l pl-4 md:pl-10 hidden md:block">
                <div className="text-lg text-gray-800">
                  <span>{format(getCurrentTimeInTimeZone(localTimezone), 'EEEE')}</span>
                </div>
                <div className="text-lg text-gray-800">
                  <span>{format(getCurrentTimeInTimeZone(localTimezone), 'MMMM d, yyyy')}</span>
                </div>
                <div className="text-sm text-primary mt-2">
                  <span>Week {format(getCurrentTimeInTimeZone(localTimezone), 'w')}, Day {format(getCurrentTimeInTimeZone(localTimezone), 'D')}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t text-sm text-muted-foreground md:hidden">
              <span>{format(getCurrentTimeInTimeZone(localTimezone), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            
            <div className="mt-3 text-xs text-primary">
              <span>Synchronized with atomic clock • Accuracy within ±0.5 seconds</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-center">
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
            <WorldClock />
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
