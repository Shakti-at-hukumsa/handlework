import React from 'react';
import { 
  MagnifyingGlassIcon, 
  SunIcon,
  MoonIcon, 
  BellIcon,
  Bars3Icon 
} from '@heroicons/react/24/outline';

const Navbar = ({ sidebarOpen, setSidebarOpen, darkMode, toggleTheme }) => {
  return (
    <header className="flex-shrink-0 relative h-16 bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        <div className="flex items-center">
          <button
            type="button"
            className="text-gray-500 dark:text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="flex-1 flex justify-end px-4 sm:px-6">
          <div className="flex items-center">
            {/* Search */}
            <div className="flex-1 flex justify-end">
              <div className="w-full max-w-lg lg:max-w-xs">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative text-gray-400 dark:text-gray-500 focus-within:text-gray-600">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="search"
                    className="block w-full bg-white dark:bg-gray-700 py-2 pl-10 pr-3 border border-gray-300 dark:border-gray-600 rounded-md leading-5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="ml-4 p-1 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800"
            >
              <span className="sr-only">Toggle dark mode</span>
              {darkMode ? (
                <SunIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <MoonIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>

            {/* Notifications */}
            <button
              className="ml-4 p-1 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <div className="ml-4 relative flex-shrink-0">
              <div>
                <button
                  className="bg-white dark:bg-gray-700 rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 