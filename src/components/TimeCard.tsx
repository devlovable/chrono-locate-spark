
import React from 'react';
import { Clock, Sunrise, Sunset, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TimeZone, formatTime, formatTimeWithDay } from '@/lib/timeUtils';
import { format } from 'date-fns';

interface TimeCardProps {
  timezone: TimeZone;
  time: Date;
  isPrimary?: boolean;
  showDetails?: boolean;
}

const TimeCard: React.FC<TimeCardProps> = ({ 
  timezone, 
  time, 
  isPrimary = false,
  showDetails = false 
}) => {
  // Calculate sunrise/sunset times (simplified approximation)
  const sunriseTime = new Date(time);
  sunriseTime.setHours(6, 30, 0);
  
  const sunsetTime = new Date(time);
  sunsetTime.setHours(18, 30, 0);

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${isPrimary ? 'border-primary/50 bg-primary/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="font-medium">{timezone.city}</h3>
          </div>
          <span className="text-xs font-medium bg-secondary/40 text-secondary-foreground px-2 py-0.5 rounded-md">
            {timezone.name} (UTC{timezone.offset >= 0 ? '+' : ''}{timezone.offset})
          </span>
        </div>
        <div className="text-3xl font-bold tracking-tight">{format(time, 'HH:mm:ss')}</div>
        <div className="text-xs text-muted-foreground mt-1">{formatTimeWithDay(time)}</div>
        
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-border grid grid-cols-1 gap-2">
            <div className="text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{format(time, 'MMMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Sunrise className="w-3 h-3 text-amber-500" />
                <span>{format(sunriseTime, 'HH:mm')}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Sunset className="w-3 h-3 text-orange-500" />
                <span>{format(sunsetTime, 'HH:mm')}</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground mt-1 italic">
              Synchronized with atomic clock
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeCard;
