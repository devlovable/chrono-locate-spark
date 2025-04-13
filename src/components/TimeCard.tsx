
import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TimeZone, formatTime, formatTimeWithDay } from '@/lib/timeUtils';

interface TimeCardProps {
  timezone: TimeZone;
  time: Date;
  isPrimary?: boolean;
}

const TimeCard: React.FC<TimeCardProps> = ({ timezone, time, isPrimary = false }) => {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${isPrimary ? 'border-primary/50 bg-primary/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="font-medium">{timezone.city}</h3>
          </div>
          <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
            {timezone.name} (UTC{timezone.offset >= 0 ? '+' : ''}{timezone.offset})
          </span>
        </div>
        <div className="text-2xl font-bold">{formatTime(time)}</div>
        <div className="text-xs text-muted-foreground mt-1">{formatTimeWithDay(time)}</div>
      </CardContent>
    </Card>
  );
};

export default TimeCard;
