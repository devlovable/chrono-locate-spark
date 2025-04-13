
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import TimeCard from './TimeCard';
import { timeZones, TimeZone, getCurrentTimeInTimeZone, getUserLocalTimezone } from '@/lib/timeUtils';
import { toast } from '@/components/ui/sonner';

const WorldClock: React.FC = () => {
  const [selectedTimezones, setSelectedTimezones] = useState<TimeZone[]>([]);
  const [times, setTimes] = useState<Date[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [showExtendedInfo, setShowExtendedInfo] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initialize with user's detected timezone and some popular ones
    try {
      setIsLoading(true);
      const detectedTimezone = getUserLocalTimezone();
      
      // Use the detected timezone as primary and add some popular ones
      const initialTimezones = [
        detectedTimezone,
        ...timeZones.filter(tz => 
          tz.name !== detectedTimezone.name && 
          ['EST', 'GMT', 'JST'].includes(tz.name)
        ).slice(0, 2)
      ];
      
      setSelectedTimezones(initialTimezones);
      toast.success(`World clock synchronized with ${detectedTimezone.city} timezone`);
      setIsLoading(false);
    } catch (error) {
      console.error("Error determining local timezone:", error);
      // Fallback to default timezones
      setSelectedTimezones([
        timeZones[0], // UTC
        timeZones[1], // EST
        timeZones[2], // PST
      ]);
      toast.error("Could not detect your timezone. Using default timezones.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const updateTimes = () => {
      const newTimes = selectedTimezones.map(tz => getCurrentTimeInTimeZone(tz));
      setTimes(newTimes);
      setLastSync(new Date());
    };
    
    if (selectedTimezones.length > 0) {
      updateTimes();
      const intervalId = setInterval(updateTimes, 1000);
      return () => clearInterval(intervalId);
    }
  }, [selectedTimezones]);

  const handleAddTimezone = () => {
    if (!selectedTimezone) return;
    
    const timezoneToAdd = timeZones.find(tz => tz.name === selectedTimezone);
    if (timezoneToAdd && !selectedTimezones.some(tz => tz.name === timezoneToAdd.name)) {
      setSelectedTimezones([...selectedTimezones, timezoneToAdd]);
      setSelectedTimezone("");
    }
  };

  const handleRemoveTimezone = (index: number) => {
    if (selectedTimezones.length <= 1) return;
    const newTimezones = [...selectedTimezones];
    newTimezones.splice(index, 1);
    setSelectedTimezones(newTimezones);
  };

  const handleSync = () => {
    const newTimes = selectedTimezones.map(tz => getCurrentTimeInTimeZone(tz));
    setTimes(newTimes);
    setLastSync(new Date());
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p>Detecting your location...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">World Clock</h2>
          <p className="text-xs text-muted-foreground">
            Last synchronized: {lastSync.toLocaleTimeString()}
            <Button variant="ghost" size="sm" className="ml-1 h-6 w-6 p-0" onClick={handleSync}>
              <RefreshCw className="h-3 w-3" />
            </Button>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Add timezone" />
            </SelectTrigger>
            <SelectContent>
              {timeZones
                .filter(tz => !selectedTimezones.some(selectedTz => selectedTz.name === tz.name))
                .map(tz => (
                  <SelectItem key={tz.name} value={tz.name}>
                    {tz.city} ({tz.name})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddTimezone} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowExtendedInfo(!showExtendedInfo)}
          className="text-xs"
        >
          {showExtendedInfo ? "Hide details" : "Show details"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedTimezones.map((timezone, index) => (
          <div key={timezone.name} className="relative group">
            <TimeCard 
              timezone={timezone} 
              time={times[index] || new Date()} 
              isPrimary={index === 0}
              showDetails={showExtendedInfo}
            />
            {selectedTimezones.length > 1 && (
              <button
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs"
                onClick={() => handleRemoveTimezone(index)}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-muted rounded-lg text-xs text-muted-foreground">
        <p className="font-medium mb-2">ExactTime Precision</p>
        <p>The displayed time is synchronized with an atomic clock - the most accurate time source in the world. The precision depends on your internet connection and how busy your computer is.</p>
      </div>
    </div>
  );
};

export default WorldClock;
