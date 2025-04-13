
import React from 'react';
import { Clock } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b py-2 px-4 bg-white sticky top-0 z-10">
      <div className="container max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-primary">ExactTime</h1>
        </div>
        <nav className="hidden md:flex space-x-4 text-sm">
          <a href="#" className="hover:text-primary">World Clock</a>
          <a href="#" className="hover:text-primary">Time Converter</a>
          <a href="#" className="hover:text-primary">Meeting Planner</a>
          <a href="#" className="hover:text-primary">Time Zones</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
