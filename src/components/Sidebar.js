import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  FolderIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  CreditCardIcon, 
  CogIcon, 
  XMarkIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Schedule', href: '/schedule', icon: CalendarIcon },
  { name: 'Tasks', href: '/tasks', icon: CheckCircleIcon },
  { name: 'Payments', href: '/payments', icon: CreditCardIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 z-20 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setOpen(false)}
      />

      {/* Sidebar component */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-auto ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200 dark:border-dark-lighter">
            <div className="text-xl font-semibold text-gray-800 dark:text-white">DevSpace</div>
            <button
              type="button"
              className="lg:hidden text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => 
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-lighter'
                  }`
                }
              >
                <item.icon 
                  className="mr-3 flex-shrink-0 h-5 w-5" 
                  aria-hidden="true" 
                />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* User profile */}
          <div className="flex items-center px-4 py-3 mt-auto border-t border-gray-200 dark:border-dark-lighter">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                D
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800 dark:text-white">Developer</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">View Profile</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 