import React from "react";
import { Menu, X } from "lucide-react";

const Navbar = ({ onLogout, user, onMenuToggle, isMenuOpen }) => {
  return (
    <header className="sticky top-0 z-40 bg-white backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        {/* Left section */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-md"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              ⚡
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
