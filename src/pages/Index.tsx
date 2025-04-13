
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import WorldClock from '@/components/WorldClock';
import TimeConverter from '@/components/TimeConverter';
import LocationSearch from '@/components/LocationSearch';
import { Clock, ArrowLeftRight, Search } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="world-clock" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="world-clock" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
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
      
      <footer className="py-4 px-6 text-center text-sm text-muted-foreground border-t">
        <p>ChronoLocate - Track time around the world with ease</p>
      </footer>
    </div>
  );
};

export default Index;
