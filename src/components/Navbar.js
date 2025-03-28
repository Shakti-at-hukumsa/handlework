import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  SunIcon,
  MoonIcon, 
  BellIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = ({ sidebarOpen, setSidebarOpen, darkMode, toggleTheme }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="flex-shrink-0 sticky top-0 h-12 bg-white dark:bg-gray-800 shadow-sm z-20 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-full px-1 sm:px-2">
        {/* Left side - Hamburger menu for mobile */}
        <div className="flex items-center">
          <button
            type="button"
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Bars3Icon className="h-4 w-4" aria-hidden="true" />
          </button>
          
          {/* Logo/Title - visible on medium screens and up */}
          <div className="hidden md:flex ml-2 text-base font-semibold text-gray-800 dark:text-white">
            DevSpace
          </div>
        </div>
        
        {/* Right side section */}
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Search - Expandable on mobile, always visible on larger screens */}
          <div className={`${searchOpen ? 'flex absolute left-0 right-0 top-0 bottom-0 bg-white dark:bg-gray-800 px-4 items-center' : 'hidden'} md:relative md:flex md:w-full md:max-w-md`}>
            {searchOpen && (
              <button 
                className="mr-2 md:hidden" 
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <XMarkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            )}
            
            <div className="w-full">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative text-gray-400 dark:text-gray-500 focus-within:text-gray-600">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-2 flex items-center">
                  <MagnifyingGlassIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <input
                  id="search"
                  className="block w-full bg-white dark:bg-gray-700 py-1 pl-8 pr-2 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Search projects, tasks..."
                  type="search"
                />
              </div>
            </div>
          </div>
          
          {/* Search button - mobile only */}
          {!searchOpen && (
            <button
              className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <MagnifyingGlassIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <SunIcon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <MoonIcon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          {/* Notifications */}
          <button
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary transition-colors relative"
            aria-label="View notifications"
          >
            <BellIcon className="h-4 w-4" aria-hidden="true" />
            {/* Notification dot/badge */}
            <span className="absolute top-1 right-1 block h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-white dark:ring-gray-800"></span>
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              className="flex text-xs rounded-full focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary dark:focus:ring-offset-gray-800 hover:ring-1 transition-all"
              aria-label="Open user menu"
            >
              <img
                className="h-6 w-6 rounded-full border-2 border-transparent hover:border-primary"
                src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User profile"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 