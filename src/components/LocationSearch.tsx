
import React, { useState } from 'react';
import { Search, MapPin, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TimeCard from './TimeCard';
import { TimeZone, searchTimeZones, getCurrentTimeInTimeZone, timeZones } from '@/lib/timeUtils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const LocationSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TimeZone[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<TimeZone | null>(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    const results = searchTimeZones(searchQuery);
    setSearchResults(results);
    setShowResults(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value) {
      setShowResults(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLocationSelect = (location: TimeZone) => {
    setSelectedLocation(location);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center mb-2">
          <MapPin className="w-5 h-5 mr-2 text-primary" />
          Find Location Time
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Find exact time for any location around the world
        </p>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search for a city or timezone..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">Or select from common locations:</span>
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedLocation ? selectedLocation.city : "Select a location"}
            <MapPin className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search location..." />
            <CommandList>
              <CommandEmpty>No locations found.</CommandEmpty>
              <CommandGroup>
                {timeZones.map(location => (
                  <CommandItem
                    key={location.name}
                    value={location.city}
                    onSelect={() => handleLocationSelect(location)}
                  >
                    {location.city} ({location.name})
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedLocation && (
        <div className="mt-4">
          <TimeCard
            timezone={selectedLocation}
            time={getCurrentTimeInTimeZone(selectedLocation)}
            isPrimary={true}
            showDetails={true}
          />
        </div>
      )}
      
      {showResults && (
        <div className="mt-4">
          {searchResults.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No locations found. Try a different search term.
            </p>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Search Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map(location => (
                  <TimeCard
                    key={location.name}
                    timezone={location}
                    time={getCurrentTimeInTimeZone(location)}
                    showDetails={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-muted rounded-lg text-xs">
        <h3 className="font-medium mb-2">About ExactTime</h3>
        <p className="text-muted-foreground">
          ExactTime provides accurate time information synchronized with atomic clock time. Our service aims to be the most accurate, reliable, and user-friendly source of time-related information.
        </p>
      </div>
    </div>
  );
};

export default LocationSearch;
