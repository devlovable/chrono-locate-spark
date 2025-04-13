
import React from 'react';
import { Clock, MapPin, Globe } from 'lucide-react';
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
            <MapPin className="w-4 h-4 text-gray-600" />
            <h3 className="font-medium">{timezone.city}</h3>
          </div>
          <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
            {timezone.name} (UTC{timezone.offset >= 0 ? '+' : ''}{timezone.offset})
          </span>
        </div>
        
        {userLocation && isPrimary && (
          <div className="text-xs text-gray-600 mb-2">
            <div className="flex items-center mb-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="font-medium">
                {userLocation.city || "Unknown location"}{userLocation.country ? `, ${userLocation.country}` : ''}
              </span>
            </div>
          </div>
        )}
        
        <div className="text-3xl font-mono tracking-tight text-blue-600">{format(time, 'HH:mm:ss')}</div>
        <div className="text-xs text-gray-500 mt-1">{formatTimeWithDay(time)}</div>
        
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 gap-2">
            <div className="text-xs text-gray-500">
              <span>{format(time, 'MMMM d, yyyy')}</span>
            </div>
            
            <div className="text-xs text-gray-400 mt-1 italic">
              Synchronized with atomic clock
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeCard;
