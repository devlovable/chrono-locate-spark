
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import WorldClock from '@/components/WorldClock';
import TimeConverter from '@/components/TimeConverter';
import LocationSearch from '@/components/LocationSearch';
import { Clock, ArrowLeftRight, Search, Globe } from 'lucide-react';
import { timeZones, getCurrentTimeInTimeZone } from '@/lib/timeUtils';
import TimeCard from '@/components/TimeCard';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [localTimezone, setLocalTimezone] = useState(timeZones[0]);

  useEffect(() => {
    // Try to determine user's timezone
    try {
      const userTimezoneOffset = -new Date().getTimezoneOffset() / 60;
      const closestTimezone = timeZones.find(tz => 
        Math.abs(tz.offset - userTimezoneOffset) < 0.1
      ) || timeZones[0];
      setLocalTimezone(closestTimezone);
    } catch (error) {
      console.error("Error determining local timezone:", error);
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
      
      <div className="bg-primary/5 py-4 px-6 border-y">
        <div className="container max-w-7xl mx-auto">
          <TimeCard 
            timezone={localTimezone} 
            time={getCurrentTimeInTimeZone(localTimezone)} 
            isPrimary={true} 
            showDetails={true}
          />
        </div>
      </div>
      
      <main className="flex-1 container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">ExactTime</h1>
          <p className="text-muted-foreground">
            The most precise time source synchronized with atomic clock time
          </p>
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
