import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  ExclamationCircleIcon, 
  CheckCircleIcon, 
  WrenchScrewdriverIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import devTools from '../utils/devTools';

/**
 * A component that checks data integrity and offers tools to fix issues
 */
const DataIntegrityChecker = () => {
  const { 
    validateData, 
    fixOrphanedRecords, 
    getStatistics, 
    useCompression, 
    toggleCompression, 
    DATA_VERSION 
  } = useData();
  
  const [validationResult, setValidationResult] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [storageDetails, setStorageDetails] = useState(null);
  const [fixResult, setFixResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Validate data when component mounts
  useEffect(() => {
    checkDataIntegrity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Run integrity check
  const checkDataIntegrity = () => {
    setLoading(true);
    
    // Use setTimeout to prevent UI freeze on large datasets
    setTimeout(() => {
      try {
        const result = validateData();
        setValidationResult(result);
        
        // Get statistics
        setStatistics(getStatistics());
        
        // Get localStorage details
        setStorageDetails(devTools.debugLocalStorage());
        
        setFixResult(null);
      } catch (error) {
        console.error("Error validating data:", error);
      } finally {
        setLoading(false);
      }
    }, 0);
  };
  
  // Fix orphaned records
  const handleFixOrphanedRecords = () => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        const result = fixOrphanedRecords();
        setFixResult(result);
        setValidationResult(result.validation);
        
        // Refresh statistics
        setStatistics(getStatistics());
      } catch (error) {
        console.error("Error fixing orphaned records:", error);
      } finally {
        setLoading(false);
      }
    }, 0);
  };
  
  // Toggle data compression
  const handleToggleCompression = () => {
    toggleCompression();
  };
  
  // Render issue count badge
  const renderIssueBadge = (count = 0) => {
    if (count === 0) {
      return (
        <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-0.5 rounded-full flex items-center">
          <CheckCircleIcon className="h-3 w-3 mr-1" />
          No issues
        </span>
      );
    }
    
    return (
      <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2 py-0.5 rounded-full flex items-center">
        <ExclamationCircleIcon className="h-3 w-3 mr-1" />
        {count} {count === 1 ? 'issue' : 'issues'}
      </span>
    );
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-4 py-5 sm:p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md p-1.5 bg-indigo-500 mr-2">
              <WrenchScrewdriverIcon className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Data Integrity Tools</h3>
          </div>
          
          {validationResult && renderIssueBadge(validationResult.issues.length)}
        </div>
        
        <div className="flex items-center justify-between mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div>
            <div className="flex items-center">
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Data Version:</span>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{DATA_VERSION}</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Data Compression:</span>
              <div className="ml-2 flex items-center">
                <span className={`text-sm ${useCompression ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {useCompression ? 'Enabled' : 'Disabled'}
                </span>
                <button
                  onClick={handleToggleCompression}
                  className="ml-2 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {useCompression ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={checkDataIntegrity}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Checking...' : 'Check Integrity'}
          </button>
        </div>
        
        {validationResult && !validationResult.valid && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md p-3 mt-4">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Data integrity issues detected ({validationResult.issues.length})
                </h3>
                
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <ul className="list-disc pl-5 space-y-1">
                    {validationResult.issues.map((issue, index) => (
                      <li key={index}>
                        {issue.type === 'orphanedTasks' && (
                          <>
                            {issue.count} task{issue.count !== 1 ? 's' : ''} referencing non-existent projects
                          </>
                        )}
                        {issue.type === 'orphanedSchedules' && (
                          <>
                            {issue.count} schedule{issue.count !== 1 ? 's' : ''} referencing non-existent projects
                          </>
                        )}
                        {issue.type === 'orphanedPayments' && (
                          <>
                            {issue.count} payment{issue.count !== 1 ? 's' : ''} referencing non-existent projects
                          </>
                        )}
                        {issue.type === 'invalidProjects' && (
                          <>
                            {issue.count} project{issue.count !== 1 ? 's' : ''} missing required fields
                          </>
                        )}
                        {issue.type === 'invalidDateTasks' && (
                          <>
                            {issue.count} task{issue.count !== 1 ? 's' : ''} with invalid dates
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-3">
                  <button
                    onClick={handleFixOrphanedRecords}
                    disabled={loading || !(validationResult.issues.some(i => 
                      i.type === 'orphanedTasks' || i.type === 'orphanedSchedules' || i.type === 'orphanedPayments'
                    ))}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 dark:text-yellow-100 bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/75 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Fix Orphaned Records
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {fixResult && (
          <div className={`mt-4 p-3 rounded-md border ${
            fixResult.fixed > 0 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200' 
              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
          }`}>
            {fixResult.fixed > 0 ? (
              <>Fixed {fixResult.fixed} orphaned record{fixResult.fixed !== 1 && 's'}</>
            ) : (
              <>No issues to fix</>
            )}
          </div>
        )}
        
        <div className="mt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          
          {showDetails && statistics && (
            <div className="mt-3 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Statistics</h4>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Projects: </span>
                    <span className="text-gray-700 dark:text-gray-300">{statistics.counts.totalProjects} ({statistics.counts.activeProjects} active)</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Tasks: </span>
                    <span className="text-gray-700 dark:text-gray-300">{statistics.counts.totalTasks} ({statistics.counts.completedTasks} completed)</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Schedules: </span>
                    <span className="text-gray-700 dark:text-gray-300">{statistics.counts.totalSchedules}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Payments: </span>
                    <span className="text-gray-700 dark:text-gray-300">{statistics.counts.totalPayments}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Task Completion Rate: </span>
                    <span className="text-gray-700 dark:text-gray-300">{statistics.rates.completionRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Last Backup: </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {statistics.timestamps.lastBackup 
                        ? new Date(statistics.timestamps.lastBackup).toLocaleDateString() 
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
              
              {storageDetails && (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Storage Details</h4>
                  
                  <div className="text-xs">
                    <div className="mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Total Storage Used: </span>
                      <span className="text-gray-700 dark:text-gray-300">{storageDetails.totalSize}</span>
                    </div>
                    
                    {storageDetails.items.length > 0 && (
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Storage by Key:</div>
                        <ul className="space-y-1 pl-4">
                          {storageDetails.items.map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span className="text-gray-700 dark:text-gray-300 font-mono">{item.key}</span>
                              <span className="text-gray-500 dark:text-gray-400">{item.size}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataIntegrityChecker; 