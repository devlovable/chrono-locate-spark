
import React from 'react';
import { Clock, Globe } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b bg-primary/5 py-3 px-4">
      <div className="container max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-primary">ExactTime</h1>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Globe className="w-4 h-4 mr-1" />
          <span>Precise world time</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
