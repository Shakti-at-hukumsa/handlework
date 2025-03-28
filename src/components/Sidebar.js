import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  FolderIcon, 
  CalendarIcon, 
  CheckBadgeIcon, 
  CreditCardIcon, 
  CogIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';

// Navigation items
const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Schedule', href: '/schedule', icon: CalendarIcon },
  { name: 'Tasks', href: '/tasks', icon: CheckBadgeIcon },
  { name: 'Payments', href: '/payments', icon: CreditCardIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-52 bg-gray-100 dark:bg-gray-800 transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:inset-auto border-r border-gray-200 dark:border-gray-700 ${open ? 'translate-x-0 shadow-lg' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-8 px-3 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700">
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-xs font-semibold text-gray-800 dark:text-white">DevSpace</div>
            </div>
            <button
              type="button"
              className="lg:hidden p-0.5 rounded text-gray-500 hover:text-gray-600 hover:bg-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-600"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-1 py-1 space-y-0.5 overflow-y-auto scrollbar-none">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => 
                  `group flex items-center px-2 py-1 text-xs font-normal rounded ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                      : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <item.icon 
                  className="mr-1.5 flex-shrink-0 h-3 w-3 text-gray-500 group-hover:text-gray-600 dark:text-gray-400"
                  aria-hidden="true" 
                />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Divider with title */}
          <div className="px-2 py-1">
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              <span className="mx-2 text-[10px] font-medium text-gray-500 dark:text-gray-400">Recent Projects</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            </div>
          </div>

          {/* Recent projects list */}
          <div className="px-2 py-1">
            <ul className="space-y-0.5">
              {['Marketing Website', 'Mobile App', 'Dashboard Redesign'].map((project, index) => (
                <li key={index}>
                  <a href="#" className="flex items-center px-2 py-1 text-xs rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                    {project}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* User profile and quick actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-2 py-1.5 mt-auto">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center">
                <img 
                  className="h-4 w-4 rounded-full border border-gray-200 dark:border-gray-700" 
                  src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="User profile"
                />
                <div className="ml-1.5">
                  <p className="text-[10px] font-medium text-gray-800 dark:text-white">Sarah Johnson</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Developer</p>
                </div>
              </div>
              <button className="p-0.5 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
                <ArrowUpTrayIcon className="h-2.5 w-2.5" aria-hidden="true" />
              </button>
            </div>
            
            {/* System status */}
            <div className="rounded bg-gray-200 p-1.5 dark:bg-gray-700">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[9px] font-medium text-gray-500 dark:text-gray-400">Storage</p>
                <p className="text-[9px] font-medium text-gray-700 dark:text-gray-300">65%</p>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-0.5">
                <div className="bg-primary-600 h-0.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 