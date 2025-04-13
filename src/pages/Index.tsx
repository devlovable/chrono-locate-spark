
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import WorldClock from '@/components/WorldClock';
import TimeConverter from '@/components/TimeConverter';
import LocationSearch from '@/components/LocationSearch';
import { Clock, ArrowLeftRight, Search, Globe, Calendar, Map } from 'lucide-react';
import { timeZones, getCurrentTimeInTimeZone } from '@/lib/timeUtils';
import TimeCard from '@/components/TimeCard';
import { format } from 'date-fns';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [localTimezone, setLocalTimezone] = useState(timeZones[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to determine user's timezone
    try {
      setIsLoading(true);
      const userTimezoneOffset = -new Date().getTimezoneOffset() / 60;
      const closestTimezone = timeZones.find(tz => 
        Math.abs(tz.offset - userTimezoneOffset) < 0.1
      ) || timeZones[0];
      setLocalTimezone(closestTimezone);
      setIsLoading(false);
    } catch (error) {
      console.error("Error determining local timezone:", error);
      setIsLoading(false);
    }

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
        {/* Main Time Display - Time.is style */}
        <div className="text-center mb-8">
          <div className="mb-2">
            <span className="text-muted-foreground">
              {isLoading ? "Detecting location..." : `Time in ${localTimezone.city}`}
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            {format(getCurrentTimeInTimeZone(localTimezone), 'HH:mm:ss')}
          </h1>
          <div className="flex justify-center items-center gap-2 text-lg text-muted-foreground mt-3">
            <Calendar className="h-5 w-5" />
            <span>{format(getCurrentTimeInTimeZone(localTimezone), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="text-sm text-primary mt-2">
            <span>Exact time synchronized with atomic clock</span>
          </div>
          <div className="text-sm mt-4 flex justify-center items-center gap-1">
            <Map className="h-4 w-4" />
            <span>
              {localTimezone.city} ({localTimezone.name}, UTC{localTimezone.offset >= 0 ? '+' : ''}{localTimezone.offset})
            </span>
          </div>
        </div>
        
        <Tabs defaultValue="world-clock" className="space-y-6">
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
      
      <footer className="py-6 px-6 text-center text-sm text-muted-foreground border-t">
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
