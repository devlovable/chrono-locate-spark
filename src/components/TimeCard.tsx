
import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TimeZone, formatTime, formatTimeWithDay, GeoLocation } from '@/lib/timeUtils';
import { format } from 'date-fns';

interface TimeCardProps {
  timezone: TimeZone;
  time: Date;
  isPrimary?: boolean;
  showDetails?: boolean;
  userLocation?: GeoLocation | null;
}

const TimeCard: React.FC<TimeCardProps> = ({ 
  timezone, 
  time, 
  isPrimary = false,
  showDetails = false,
  userLocation = null
}) => {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${isPrimary ? 'border-primary/50 bg-white' : 'bg-white'}`}>
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
        
        {userLocation && isPrimary && (
          <div className="text-xs text-primary mb-2 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            <span>
              {userLocation.locationName || `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`}
              {userLocation.accuracy ? ` (±${Math.round(userLocation.accuracy)}m)` : ''}
            </span>
          </div>
        )}
        
        <div className="text-3xl font-mono tracking-tight">{format(time, 'HH:mm:ss')}</div>
        <div className="text-xs text-muted-foreground mt-1">{formatTimeWithDay(time)}</div>
        
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-border grid grid-cols-1 gap-2">
            <div className="text-xs text-muted-foreground">
              <span>{format(time, 'MMMM d, yyyy')}</span>
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
