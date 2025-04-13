
import React, { useState, useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { timeZones, TimeZone, convertTime, formatTime } from '@/lib/timeUtils';
import { ArrowRight } from 'lucide-react';

const TimeConverter: React.FC = () => {
  const [fromTimezone, setFromTimezone] = useState<TimeZone>(timeZones[0]);
  const [toTimezone, setToTimezone] = useState<TimeZone>(timeZones[1]);
  const [timeInput, setTimeInput] = useState<string>("12:00");
  const [convertedTime, setConvertedTime] = useState<Date | null>(null);

  const handleFromTimezoneChange = (value: string) => {
    const tz = timeZones.find(t => t.name === value);
    if (tz) setFromTimezone(tz);
  };

  const handleToTimezoneChange = (value: string) => {
    const tz = timeZones.find(t => t.name === value);
    if (tz) setToTimezone(tz);
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(e.target.value);
  };

  const handleConvert = () => {
    try {
      const result = convertTime(timeInput, fromTimezone, toTimezone);
      setConvertedTime(result);
    } catch (error) {
      console.error("Error converting time:", error);
    }
  };

  useEffect(() => {
    // Set default time on component mount
    const now = new Date();
    setTimeInput(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    handleConvert();
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Time Converter</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <div className="flex flex-col gap-2">
              <Select value={fromTimezone.name} onValueChange={handleFromTimezoneChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timeZones.map(tz => (
                    <SelectItem key={tz.name} value={tz.name}>
                      {tz.city} ({tz.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input 
                type="time" 
                value={timeInput} 
                onChange={handleTimeInputChange}
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={handleConvert} variant="ghost" size="icon" className="rounded-full">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <div className="flex flex-col gap-2">
              <Select value={toTimezone.name} onValueChange={handleToTimezoneChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timeZones.map(tz => (
                    <SelectItem key={tz.name} value={tz.name}>
                      {tz.city} ({tz.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="h-10 border rounded-md flex items-center px-3 bg-muted/50">
                {convertedTime ? formatTime(convertedTime) : "--:--"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeConverter;
