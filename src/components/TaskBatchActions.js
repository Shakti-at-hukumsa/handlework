import React, { useState } from 'react';
import { 
  CheckIcon, 
  TrashIcon, 
  XMarkIcon, 
  ClockIcon, 
  TagIcon,

  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

/**
 * Component for batch actions on selected tasks
 */
const TaskBatchActions = ({ selectedTasks = [], onClearSelection, onActionComplete }) => {
  const { batchUpdateTasks, batchDeleteTasks } = useData();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [actionParams, setActionParams] = useState({});
  
  // If no tasks selected, don't show the component
  if (!selectedTasks.length) return null;
  
  // Handle batch update status
  const handleBatchUpdateStatus = (status) => {
    setActiveAction('status');
    setActionParams({ status });
  };
  
  // Handle batch update priority
  const handleBatchUpdatePriority = (priority) => {
    setActiveAction('priority');
    setActionParams({ priority });
  };
  
  // Handle batch delete
  const handleBatchDelete = () => {
    setActiveAction('delete');
  };
  
  // Cancel current action
  const handleCancel = () => {
    setActiveAction(null);
    setActionParams({});
  };
  
  // Confirm current action
  const handleConfirm = async () => {
    setIsProcessing(true);
    
    try {
      const taskIds = selectedTasks.map(task => task.id);
      
      if (activeAction === 'delete') {
        await batchDeleteTasks(taskIds);
      } else {
        await batchUpdateTasks(taskIds, actionParams);
      }
      
      // Clear selection and notify parent
      if (onClearSelection) onClearSelection();
      if (onActionComplete) onActionComplete();
      
    } catch (error) {
      console.error('Error performing batch action:', error);
    } finally {
      setIsProcessing(false);
      setActiveAction(null);
      setActionParams({});
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-20 p-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            {selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'} selected
          </span>
          <button 
            onClick={onClearSelection}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear
          </button>
        </div>
        
        {!activeAction ? (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setActiveAction('status')}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
              >
                <CheckIcon className="h-3.5 w-3.5 mr-1.5" />
                Set Status
              </button>
              
              {activeAction === 'status' && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-1">
                    {['Todo', 'In Progress', 'Blocked', 'Done'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleBatchUpdateStatus(status)}
                        className="block w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setActiveAction('priority')}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
              >
                <TagIcon className="h-3.5 w-3.5 mr-1.5" />
                Set Priority
              </button>
              
              {activeAction === 'priority' && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-1">
                    {['Low', 'Medium', 'High'].map(priority => (
                      <button
                        key={priority}
                        onClick={() => handleBatchUpdatePriority(priority)}
                        className="block w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleBatchDelete}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-700 rounded-md shadow-sm text-xs font-medium text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none"
            >
              <TrashIcon className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {activeAction === 'status' && (
              <div className="text-xs text-gray-700 dark:text-gray-300">
                Change status to <span className="font-medium">{actionParams.status}</span>
              </div>
            )}
            
            {activeAction === 'priority' && (
              <div className="text-xs text-gray-700 dark:text-gray-300">
                Change priority to <span className="font-medium">{actionParams.priority}</span>
              </div>
            )}
            
            {activeAction === 'delete' && (
              <div className="text-xs text-red-500 dark:text-red-400">
                Delete {selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'}?
              </div>
            )}
            
            <div className="flex space-x-2 ml-4">
              <button
                onClick={handleCancel}
                disabled={isProcessing}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none disabled:opacity-50"
              >
                <XMarkIcon className="h-3.5 w-3.5 mr-1.5" />
                Cancel
              </button>
              
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className={`inline-flex items-center px-3 py-1.5 border rounded-md shadow-sm text-xs font-medium focus:outline-none disabled:opacity-50 ${
                  activeAction === 'delete'
                    ? 'border-red-500 text-white bg-red-500 hover:bg-red-600 dark:border-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                    : 'border-primary-500 text-white bg-primary-500 hover:bg-primary-600 dark:border-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700'
                }`}
              >
                {isProcessing ? (
                  <>
                    <ArrowPathIcon className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 mr-1.5" />
                    Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskBatchActions; 