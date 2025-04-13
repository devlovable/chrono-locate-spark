
import React from 'react';
import { Clock } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b py-3 px-4 bg-white">
      <div className="container max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-primary">ExactTime</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
