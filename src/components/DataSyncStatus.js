import React, { useState, useEffect } from 'react';
import { 
  CloudArrowUpIcon, 
  CloudIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { formatDateRelative } from '../utils/devTools';

/**
 * Component to display data synchronization status
 */
const DataSyncStatus = ({ 
  lastSaved, 
  isSyncing = false, 
  syncError = null, 
  saveData = () => {}, 
  autoSaveEnabled = true,
  autoSaveInterval = 60, // seconds
  onToggleAutoSave = () => {} 
}) => {
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [lastSyncTime, setLastSyncTime] = useState(lastSaved || null);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [timeAgo, setTimeAgo] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  
  // Update sync status when props change
  useEffect(() => {
    if (syncError) {
      setSyncStatus('error');
    } else if (isSyncing) {
      setSyncStatus('syncing');
    } else if (lastSaved && lastSaved !== lastSyncTime) {
      setSyncStatus('success');
      setLastSyncTime(lastSaved);
      
      // Reset status after 3 seconds
      const timer = setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isSyncing, syncError, lastSaved, lastSyncTime]);
  
  // Format the "time ago" text
  useEffect(() => {
    if (!lastSyncTime) return;
    
    const updateTimeAgo = () => {
      setTimeAgo(formatDateRelative(lastSyncTime));
    };
    
    // Update initially
    updateTimeAgo();
    
    // Update every minute
    const interval = setInterval(updateTimeAgo, 60000);
    
    return () => clearInterval(interval);
  }, [lastSyncTime]);
  
  // Handle auto-save
  useEffect(() => {
    if (autoSaveEnabled) {
      const timer = setInterval(() => {
        saveData();
      }, autoSaveInterval * 1000);
      
      setAutoSaveTimer(timer);
      
      return () => clearInterval(timer);
    } else if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
      setAutoSaveTimer(null);
    }
  }, [autoSaveEnabled, autoSaveInterval, saveData]);
  
  // Get icon based on sync status
  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <CloudArrowUpIcon className="h-4 w-4 text-blue-500 dark:text-blue-400 animate-pulse" />;
      case 'success':
        return <CheckCircleIcon className="h-4 w-4 text-green-500 dark:text-green-400" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500 dark:text-red-400" />;
      default:
        return <CloudIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />;
    }
  };
  
  // Get status text
  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Saving...';
      case 'success':
        return 'Saved!';
      case 'error':
        return 'Error saving';
      default:
        return lastSyncTime ? `Last saved ${timeAgo}` : 'Not saved yet';
    }
  };
  
  // Toggle auto-save
  const handleToggleAutoSave = () => {
    onToggleAutoSave(!autoSaveEnabled);
  };
  
  // Manual save
  const handleManualSave = () => {
    saveData();
  };
  
  return (
    <div className="relative">
      <div 
        className="flex items-center text-xs cursor-pointer select-none"
        onClick={() => setShowDetails(!showDetails)}
      >
        <span className="mr-1.5">{getStatusIcon()}</span>
        <span className={`${
          syncStatus === 'error' 
            ? 'text-red-600 dark:text-red-400' 
            : 'text-gray-600 dark:text-gray-400'
        }`}>
          {getStatusText()}
        </span>
      </div>
      
      {/* Details Popover */}
      {showDetails && (
        <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-md w-72 border border-gray-200 dark:border-gray-700 p-3 z-10">
          <div className="text-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">Data Synchronization</span>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-400">Auto-save:</span>
                <div className="relative inline-block w-10 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="toggle-autosave" 
                    className="sr-only"
                    checked={autoSaveEnabled}
                    onChange={handleToggleAutoSave}
                  />
                  <label 
                    htmlFor="toggle-autosave"
                    className={`block overflow-hidden h-4 rounded-full cursor-pointer ${
                      autoSaveEnabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span 
                      className={`block h-4 w-4 rounded-full bg-white transform transition-transform ${
                        autoSaveEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`} 
                    />
                  </label>
                </div>
              </div>
              
              {autoSaveEnabled && (
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Auto-save interval:</span>
                  <span className="text-gray-700 dark:text-gray-300">{autoSaveInterval} seconds</span>
                </div>
              )}
              
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-400">Last saved:</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {lastSyncTime ? formatDateRelative(lastSyncTime) : 'Never'}
                </span>
              </div>
              
              {syncError && (
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded">
                  <div className="font-medium">Error saving data:</div>
                  <div className="text-xs mt-1">{syncError.message || 'Unknown error'}</div>
                </div>
              )}
              
              <div className="mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManualSave();
                  }}
                  className="w-full py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded hover:bg-primary-200 dark:hover:bg-primary-900/50 focus:outline-none"
                >
                  Save Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSyncStatus; 