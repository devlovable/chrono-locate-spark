
import React from 'react';
import { Clock, Globe, Calendar } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-6 bg-gradient-to-r from-primary/10 to-secondary/20">
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <Clock className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-primary">ExactTime</h1>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span>Precise world time</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date().toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
