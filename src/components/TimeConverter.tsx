
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
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

const TimeConverter: React.FC = () => {
  const [fromTimezone, setFromTimezone] = useState<TimeZone>(timeZones[0]);
  const [toTimezone, setToTimezone] = useState<TimeZone>(timeZones[1]);
  const [timeInput, setTimeInput] = useState<string>("12:00");
  const [dateInput, setDateInput] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
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

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInput(e.target.value);
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
    <Card className="border-primary/10">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-primary" />
          Time Converter
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <div className="space-y-3">
            <label className="text-sm font-medium">From</label>
            <div className="flex flex-col gap-3">
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs">Date</label>
                  <Input
                    type="date"
                    value={dateInput}
                    onChange={handleDateInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs">Time</label>
                  <Input 
                    type="time" 
                    value={timeInput} 
                    onChange={handleTimeInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center my-4 md:my-0">
            <Button onClick={handleConvert} variant="ghost" size="icon" className="rounded-full">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">To</label>
            <div className="flex flex-col gap-3">
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
              
              <div className="space-y-1">
                <div className="h-10 border rounded-md flex items-center px-3 bg-muted/50">
                  {convertedTime ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{format(convertedTime, 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{formatTime(convertedTime)}</span>
                      </div>
                    </div>
                  ) : "--:--"}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-xs text-muted-foreground">
          <p>Time difference: {fromTimezone.offset > toTimezone.offset ? 
            `${Math.abs(fromTimezone.offset - toTimezone.offset)} hours behind` : 
            fromTimezone.offset < toTimezone.offset ? 
            `${Math.abs(toTimezone.offset - fromTimezone.offset)} hours ahead` : 
            'Same time'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeConverter;
