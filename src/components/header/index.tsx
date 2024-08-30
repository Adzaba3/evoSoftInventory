import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          EvoSoft Inventory
        </h1>
      </div>
    </header>
  );
};

export default Header;