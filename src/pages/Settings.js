import React, { useState } from 'react';
import { 
  UserCircleIcon, 
  BellIcon, 
  PaintBrushIcon, 
  KeyIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

const settingsSections = [
  { id: 'profile', name: 'Profile', icon: UserCircleIcon },
  { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  { id: 'backup', name: 'Backup & Sync', icon: CloudArrowUpIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  
  // Toggle theme handler
  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
    
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="card overflow-hidden">
            <nav className="space-y-1" aria-label="Settings">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={classNames(
                    section.id === activeSection
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-lighter',
                    'group flex items-center px-4 py-3 text-sm font-medium w-full text-left'
                  )}
                >
                  <section.icon 
                    className={classNames(
                      section.id === activeSection
                        ? 'text-white'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {section.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Settings content */}
        <div className="flex-1">
          <div className="card">
            {/* Profile Settings */}
            {activeSection === 'profile' && (
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Profile Settings</h2>
                
                <div className="flex items-center space-x-6">
                  <div className="h-24 w-24 rounded-full bg-gray-300 dark:bg-dark-lighter flex items-center justify-center text-3xl text-white font-bold">
                    D
                  </div>
                  <div>
                    <button className="btn btn-primary">
                      Change Avatar
                    </button>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      JPG, GIF or PNG. Max size 2MB.
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-dark-lighter pt-6">
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                    <div>
                      <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        First name
                      </label>
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        defaultValue="John"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-lighter shadow-sm focus:border-primary focus:ring-primary bg-white dark:bg-dark-lighter text-gray-900 dark:text-white sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        defaultValue="Doe"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-lighter shadow-sm focus:border-primary focus:ring-primary bg-white dark:bg-dark-lighter text-gray-900 dark:text-white sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        defaultValue="johndoe@example.com"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-lighter shadow-sm focus:border-primary focus:ring-primary bg-white dark:bg-dark-lighter text-gray-900 dark:text-white sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        defaultValue="+1 (555) 123-4567"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-lighter shadow-sm focus:border-primary focus:ring-primary bg-white dark:bg-dark-lighter text-gray-900 dark:text-white sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-dark-lighter pt-6">
                  <div>
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-lighter shadow-sm focus:border-primary focus:ring-primary bg-white dark:bg-dark-lighter text-gray-900 dark:text-white sm:text-sm"
                        placeholder="Brief description about yourself"
                        defaultValue={'Full stack developer with expertise in React and Node.js.'}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="btn bg-white dark:bg-dark-lighter text-gray-700 dark:text-gray-300 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            
            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Appearance Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enable dark mode for a better experience in low light environments.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleTheme}
                      className={classNames(
                        darkMode ? 'bg-primary' : 'bg-gray-200 dark:bg-dark-lighter',
                        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
                      )}
                    >
                      <span className="sr-only">Toggle dark mode</span>
                      <span
                        className={classNames(
                          darkMode ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white dark:bg-gray-200 shadow transform ring-0 transition ease-in-out duration-200'
                        )}
                      />
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-dark-lighter pt-4">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">Theme Colors</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Choose a different accent color for the application.
                    </p>
                    
                    <div className="flex gap-3">
                      {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'].map((color, index) => (
                        <button
                          key={index}
                          className={`h-8 w-8 rounded-full ${color} cursor-pointer ring-2 ring-offset-2 ring-offset-white dark:ring-offset-dark-DEFAULT ${index === 0 ? 'ring-blue-600' : 'ring-transparent'}`}
                          aria-label={`Select ${color.split('-')[1]} theme`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-dark-lighter pt-4">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">Font Size</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Adjust the application font size.
                    </p>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">A</span>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        defaultValue="2"
                        className="w-full h-2 bg-gray-200 dark:bg-dark-lighter rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-lg text-gray-500 dark:text-gray-400 ml-2">A</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="btn bg-white dark:bg-dark-lighter text-gray-700 dark:text-gray-300 mr-3"
                  >
                    Reset to Default
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            
            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">Enable Notifications</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications about project updates, deadlines and reminders.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                      className={classNames(
                        notificationsEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-dark-lighter',
                        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
                      )}
                    >
                      <span className="sr-only">Toggle notifications</span>
                      <span
                        className={classNames(
                          notificationsEnabled ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white dark:bg-gray-200 shadow transform ring-0 transition ease-in-out duration-200'
                        )}
                      />
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-dark-lighter pt-4">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Choose which notifications you'd like to receive via email.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email-notifications"
                            name="email-notifications"
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={() => setEmailNotifications(!emailNotifications)}
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="email-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                            Send email notifications
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">Get emails about project updates and deadline reminders.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="summary"
                            name="summary"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="summary" className="font-medium text-gray-700 dark:text-gray-300">
                            Weekly summary
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">Receive a weekly summary of your projects and tasks.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="deadline"
                            name="deadline"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="deadline" className="font-medium text-gray-700 dark:text-gray-300">
                            Deadline reminders
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">Get notified about upcoming deadlines.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="btn bg-white dark:bg-dark-lighter text-gray-700 dark:text-gray-300 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            
            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">Change Password</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Update your password to maintain account security.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="current-password"
                          id="current-password"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-lighter shadow-sm focus:border-primary focus:ring-primary bg-white dark:bg-dark-lighter text-gray-900 dark:text-white sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="new-password"
                          id="new-password"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-lighter shadow-sm focus:border-primary focus:ring-primary bg-white dark:bg-dark-lighter text-gray-900 dark:text-white sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirm-password"
                          id="confirm-password"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-lighter shadow-sm focus:border-primary focus:ring-primary bg-white dark:bg-dark-lighter text-gray-900 dark:text-white sm:text-sm"
                        />
                      </div>
                      <div>
                        <button type="button" className="btn btn-primary">
                          <KeyIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-dark-lighter pt-6">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Add an extra layer of security to your account.
                    </p>
                    
                    <button type="button" className="btn bg-white dark:bg-dark-lighter text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-dark-lightest">
                      <ShieldCheckIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                      Enable Two-Factor Authentication
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-dark-lighter pt-6">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Sessions</h3>
                    
                    <div className="bg-gray-50 dark:bg-dark-lighter rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Current Session</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Windows 10 · Chrome · Your IP: 192.168.1.1</p>
                        </div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active
                        </span>
                      </div>
                    </div>
                    
                    <button type="button" className="btn bg-white dark:bg-dark-lighter text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-dark-lightest">
                      <ArrowPathIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                      Log Out of All Other Sessions
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Backup & Sync Settings */}
            {activeSection === 'backup' && (
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Backup & Sync Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">Automatic Backup</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enable automatic backup of your projects and data to the cloud.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoBackup(!autoBackup)}
                      className={classNames(
                        autoBackup ? 'bg-primary' : 'bg-gray-200 dark:bg-dark-lighter',
                        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
                      )}
                    >
                      <span className="sr-only">Toggle automatic backup</span>
                      <span
                        className={classNames(
                          autoBackup ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white dark:bg-gray-200 shadow transform ring-0 transition ease-in-out duration-200'
                        )}
                      />
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-dark-lighter pt-4">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">Backup Frequency</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Choose how often your data should be backed up.
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="daily"
                          name="backup-frequency"
                          type="radio"
                          defaultChecked
                          className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <label htmlFor="daily" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Daily
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="weekly"
                          name="backup-frequency"
                          type="radio"
                          className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <label htmlFor="weekly" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Weekly
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="monthly"
                          name="backup-frequency"
                          type="radio"
                          className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <label htmlFor="monthly" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Monthly
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-dark-lighter pt-4">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Manual Backup</h3>
                    
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="btn bg-white dark:bg-dark-lighter text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-dark-lightest"
                      >
                        <CloudArrowUpIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                        Backup Now
                      </button>
                      <button
                        type="button"
                        className="btn bg-white dark:bg-dark-lighter text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-dark-lightest"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                        Export Data
                      </button>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 dark:bg-dark-lighter rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Last Backup</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">April 15, 2023 at 10:30 AM</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="btn bg-white dark:bg-dark-lighter text-gray-700 dark:text-gray-300 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 