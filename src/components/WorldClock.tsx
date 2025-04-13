
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import TimeCard from './TimeCard';
import { timeZones, TimeZone, getCurrentTimeInTimeZone } from '@/lib/timeUtils';

const WorldClock: React.FC = () => {
  const [selectedTimezones, setSelectedTimezones] = useState<TimeZone[]>([
    timeZones[0], // UTC
    timeZones[1], // EST
    timeZones[2], // PST
  ]);
  const [times, setTimes] = useState<Date[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");

  useEffect(() => {
    const updateTimes = () => {
      const newTimes = selectedTimezones.map(tz => getCurrentTimeInTimeZone(tz));
      setTimes(newTimes);
    };
    
    updateTimes();
    const intervalId = setInterval(updateTimes, 1000);
    
    return () => clearInterval(intervalId);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">World Clock</h2>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedTimezones.map((timezone, index) => (
          <div key={timezone.name} className="relative group">
            <TimeCard 
              timezone={timezone} 
              time={times[index] || new Date()} 
              isPrimary={index === 0}
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
    </div>
  );
};

export default WorldClock;
