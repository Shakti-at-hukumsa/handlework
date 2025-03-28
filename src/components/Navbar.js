import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  SunIcon,
  MoonIcon, 
  BellIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAppSettings } from '../contexts/AppContext';

const Navbar = ({ sidebarOpen, setSidebarOpen, darkMode, toggleTheme }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { settings } = useAppSettings();

  return (
    <header className="flex-shrink-0 h-8 bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 z-20 flex items-center">
      <div className="flex items-center justify-between w-full h-full px-1">
        {/* Left side - Hamburger menu for mobile */}
        <div className="flex items-center">
          <button
            type="button"
            className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 lg:hidden rounded"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Bars3Icon className="icon-app-sm" aria-hidden="true" />
          </button>
          
          {/* Application menu - Windows-like */}
          <div className="hidden md:flex space-x-1 ml-1 text-app-xs">
            <button className="px-2 py-0.5 hover:bg-gray-300 dark:hover:bg-gray-600 rounded">File</button>
            <button className="px-2 py-0.5 hover:bg-gray-300 dark:hover:bg-gray-600 rounded">Edit</button>
            <button className="px-2 py-0.5 hover:bg-gray-300 dark:hover:bg-gray-600 rounded">View</button>
            <button className="px-2 py-0.5 hover:bg-gray-300 dark:hover:bg-gray-600 rounded">Help</button>
          </div>
        </div>
        
        {/* Right side section */}
        <div className="flex items-center space-x-0.5">
          {/* Search - Expandable on mobile, always visible on larger screens */}
          <div className={`${searchOpen ? 'flex absolute left-0 right-0 top-0 bottom-0 bg-gray-200 dark:bg-gray-700 px-2 items-center' : 'hidden'} md:relative md:flex md:w-32 lg:w-48`}>
            {searchOpen && (
              <button 
                className="mr-1 md:hidden" 
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <XMarkIcon className="icon-app-sm" aria-hidden="true" />
              </button>
            )}
            
            <div className="w-full">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative text-gray-400 dark:text-gray-500">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-1 flex items-center">
                  <MagnifyingGlassIcon className="icon-app-xs" aria-hidden="true" />
                </div>
                <input
                  id="search"
                  className="block w-full bg-white dark:bg-gray-600 py-0.5 pl-6 pr-1 border border-gray-300 dark:border-gray-500 rounded text-app-xs text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Search..."
                  type="search"
                />
              </div>
            </div>
          </div>
          
          {/* Search button - mobile only */}
          {!searchOpen && (
            <button
              className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 md:hidden rounded"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <MagnifyingGlassIcon className="icon-app-sm" aria-hidden="true" />
            </button>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <SunIcon className="icon-app-sm" aria-hidden="true" />
            ) : (
              <MoonIcon className="icon-app-sm" aria-hidden="true" />
            )}
          </button>

          {/* Notifications */}
          <button
            className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 rounded relative"
            aria-label="View notifications"
          >
            <BellIcon className="icon-app-sm" aria-hidden="true" />
            {/* Notification dot/badge */}
            <span className="absolute top-0.5 right-0.5 block h-1 w-1 rounded-full bg-red-500"></span>
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              className="flex rounded focus:outline-none"
              aria-label="Open user menu"
            >
              <img
                className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600"
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