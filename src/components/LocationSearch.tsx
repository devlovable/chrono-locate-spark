
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TimeCard from './TimeCard';
import { TimeZone, searchTimeZones, getCurrentTimeInTimeZone } from '@/lib/timeUtils';

const LocationSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TimeZone[]>([]);
  const [showResults, setShowResults] = useState(false);

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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Find Location Time</h2>
      
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
      
      {showResults && (
        <div className="mt-4">
          {searchResults.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No locations found. Try a different search term.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map(location => (
                <TimeCard
                  key={location.name}
                  timezone={location}
                  time={getCurrentTimeInTimeZone(location)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
