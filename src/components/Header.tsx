
import React from 'react';
import { Clock } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/10 to-secondary/20">
      <div className="flex items-center gap-2">
        <Clock className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-primary">ChronoLocate</h1>
      </div>
      <div className="text-sm text-muted-foreground">
        {new Date().toLocaleDateString(undefined, { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </header>
  );
};

export default Header;
