import React, { useState } from 'react';
import {
  CheckIcon,
  TrashIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  TagIcon,
  FolderIcon,
  CalendarIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

/**
 * Windows-styled batch actions toolbar for selected tasks
 */
const TaskBatchActions = ({ 
  selectedTasks = [], 
  onClearSelection,
  onTaskUpdate,
  onTaskDelete,
  onActionComplete
}) => {
  const { batchUpdateTasks, batchDeleteTasks } = useData();
  const [isOpen, setIsOpen] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Skip rendering if no tasks selected
  if (selectedTasks.length === 0) return null;
  
  // Handle status change for all selected tasks
  const handleUpdateStatus = async (newStatus) => {
    setActionInProgress(true);
    
    try {
      // Update each selected task
      if (onTaskUpdate) {
        for (const task of selectedTasks) {
          await onTaskUpdate(task.id, { status: newStatus });
        }
      }
      
      // Action completed
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (error) {
      console.error('Error updating tasks:', error);
    } finally {
      setActionInProgress(false);
    }
  };
  
  // Handle deleting selected tasks
  const handleDelete = async () => {
    setActionInProgress(true);
    setShowConfirmDelete(false);
    
    try {
      // Delete each selected task
      if (onTaskDelete) {
        for (const task of selectedTasks) {
          await onTaskDelete(task.id);
        }
      }
      
      // Action completed
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (error) {
      console.error('Error deleting tasks:', error);
    } finally {
      setActionInProgress(false);
    }
  };
  
  return (
    <>
      {/* Fixed toolbar at bottom of screen */}
      <div className={`fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 win-border win-shadow ${isOpen ? 'border-t' : 'border-t-0'} z-50 transition-transform duration-200 transform ${!isOpen ? 'translate-y-full' : ''}`}>
        {/* Toggle button */}
        <button
          className="absolute -top-8 right-4 bg-gray-100 dark:bg-gray-800 win-border border-b-0 px-3 py-1 text-xs text-gray-700 dark:text-gray-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Hide' : `${selectedTasks.length} tasks selected`}
        </button>
        
        {/* Toolbar header */}
        <div className="flex items-center justify-between h-8 px-3 bg-blue-600 dark:bg-blue-800 text-white">
          <div className="text-sm font-medium">
            {selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'} selected
          </div>
          <button 
            className="text-white hover:bg-blue-700 dark:hover:bg-blue-700 p-1 rounded"
            onClick={onClearSelection}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
        
        {/* Action buttons */}
        <div className="p-3 grid grid-cols-5 gap-2 sm:flex sm:flex-wrap sm:gap-4">
          {/* Mark as Done */}
          <button
            className="win-button flex flex-col items-center justify-center p-3 h-20 w-20 space-y-1 disabled:opacity-50"
            onClick={() => handleUpdateStatus('Done')}
            disabled={actionInProgress}
          >
            <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-500" />
            <span className="text-xs text-center">Mark as Done</span>
          </button>
          
          {/* Set to In Progress */}
          <button
            className="win-button flex flex-col items-center justify-center p-3 h-20 w-20 space-y-1 disabled:opacity-50"
            onClick={() => handleUpdateStatus('In Progress')}
            disabled={actionInProgress}
          >
            <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            <span className="text-xs text-center">In Progress</span>
          </button>
          
          {/* Mark as Blocked */}
          <button
            className="win-button flex flex-col items-center justify-center p-3 h-20 w-20 space-y-1 disabled:opacity-50"
            onClick={() => handleUpdateStatus('Blocked')}
            disabled={actionInProgress}
          >
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-500" />
            <span className="text-xs text-center">Blocked</span>
          </button>
          
          {/* Set Project button */}
          <button
            className="win-button flex flex-col items-center justify-center p-3 h-20 w-20 space-y-1 disabled:opacity-50"
            disabled={actionInProgress}
          >
            <FolderIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
            <span className="text-xs text-center">Set Project</span>
          </button>
          
          {/* Delete Tasks button */}
          <button
            className="win-button flex flex-col items-center justify-center p-3 h-20 w-20 space-y-1 disabled:opacity-50"
            onClick={() => setShowConfirmDelete(true)}
            disabled={actionInProgress}
          >
            <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-500" />
            <span className="text-xs text-center">Delete</span>
          </button>
        </div>
        
        {/* Status indicator */}
        {actionInProgress && (
          <div className="absolute inset-0 bg-black bg-opacity-25 dark:bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded win-border flex items-center space-x-3">
              <ArrowPathIcon className="h-5 w-5 text-blue-600 dark:text-blue-500 animate-spin" />
              <span className="text-sm">Updating tasks...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete confirmation dialog */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50 flex items-center justify-center z-50">
          <div className="win-dialog w-80">
            {/* Dialog header */}
            <div className="h-8 bg-blue-600 dark:bg-blue-800 text-white flex items-center px-3 justify-between">
              <span className="text-sm font-medium">Confirm Delete</span>
              <button 
                className="text-white hover:bg-blue-700 dark:hover:bg-blue-700 p-1 rounded"
                onClick={() => setShowConfirmDelete(false)}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            
            {/* Dialog content */}
            <div className="p-4">
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 text-red-600 dark:text-red-500">
                  <ExclamationTriangleIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete {selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'}?
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  className="win-button text-xs px-4 py-1"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button 
                  className="win-button-primary text-xs px-4 py-1 bg-red-600 border-red-700 hover:bg-red-700 dark:bg-red-700 dark:border-red-800 dark:hover:bg-red-800"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskBatchActions; 