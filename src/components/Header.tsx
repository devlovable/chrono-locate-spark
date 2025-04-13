
import React from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="py-2 px-4 bg-blue-600 text-white">
      <div className="container max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <h1 className="text-xl font-bold">ChronoLocate</h1>
        </div>
        <nav className="flex space-x-4 text-sm">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/world-clock" className="hover:text-blue-200">World Clock</Link>
          <Link to="/about" className="hover:text-blue-200">About</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
