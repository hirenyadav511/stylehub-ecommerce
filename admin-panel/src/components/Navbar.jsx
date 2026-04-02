import React from 'react';

const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="font-semibold text-gray-700">Admin Dashboard</div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Logged in as Admin</span>
      </div>
    </header>
  );
};

export default Navbar;
