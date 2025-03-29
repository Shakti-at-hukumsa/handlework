import React, { useState } from 'react';
import { 
  CheckIcon, 
  CheckCircleIcon,
  ChevronDoubleUpIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { formatDateRelative } from '../utils/devTools';
import TaskBatchActions from './TaskBatchActions';

/**
 * A component that provides enhanced selection capabilities for tasks
 * with batch operations and keyboard shortcuts
 */
const TaskMultiSelect = ({ tasks, onTaskUpdate, onTaskDelete, onRefresh }) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  
  // Get full task objects for selected IDs
  const selectedTasks = tasks.filter(task => selectedTaskIds.includes(task.id));
  
  // Toggle task selection
  const toggleTaskSelection = (taskId, index, isShiftKey = false) => {
    // If this is the first selection, enter select mode
    if (selectedTaskIds.length === 0 && !selectMode) {
      setSelectMode(true);
    }
    
    // Handle shift+click selection (range select)
    if (isShiftKey && lastSelectedIndex !== null && selectMode) {
      const rangeStart = Math.min(lastSelectedIndex, index);
      const rangeEnd = Math.max(lastSelectedIndex, index);
      const tasksInRange = tasks.slice(rangeStart, rangeEnd + 1);
      const taskIdsInRange = tasksInRange.map(t => t.id);
      
      // Add all tasks in range to selection if not already selected
      setSelectedTaskIds(prev => {
        const updatedSelection = [...prev];
        taskIdsInRange.forEach(id => {
          if (!updatedSelection.includes(id)) {
            updatedSelection.push(id);
          }
        });
        return updatedSelection;
      });
    } else {
      // Normal selection toggle
      setSelectedTaskIds(prev => {
        if (prev.includes(taskId)) {
          return prev.filter(id => id !== taskId);
        } else {
          return [...prev, taskId];
        }
      });
    }
    
    // Update last selected index
    setLastSelectedIndex(index);
  };
  
  // Select all tasks
  const selectAllTasks = () => {
    setSelectMode(true);
    setSelectedTaskIds(tasks.map(task => task.id));
  };
  
  // Clear selection
  const clearSelection = () => {
    setSelectedTaskIds([]);
    setSelectMode(false);
    setLastSelectedIndex(null);
  };
  
  // Toggle select mode
  const toggleSelectMode = () => {
    if (selectMode) {
      clearSelection();
    } else {
      setSelectMode(true);
    }
  };
  
  // After batch action complete
  const handleActionComplete = () => {
    // Clear selection
    clearSelection();
    
    // Refresh data
    if (onRefresh) {
      onRefresh();
    }
  };
  
  // Get priority details for display
  const getPriorityDisplay = (priority) => {
    switch (priority) {
      case 'High':
        return {
          icon: <ChevronDoubleUpIcon className="h-4 w-4" />,
          className: 'text-red-600 dark:text-red-400'
        };
      case 'Medium':
        return {
          icon: <ChevronUpIcon className="h-4 w-4" />,
          className: 'text-yellow-600 dark:text-yellow-400'
        };
      case 'Low':
      default:
        return {
          icon: <ChevronDownIcon className="h-4 w-4" />,
          className: 'text-green-600 dark:text-green-400'
        };
    }
  };
  
  // Get status color for the checkbox border
  const getStatusColor = (status) => {
    switch (status) {
      case 'Done':
        return 'border-green-500 dark:border-green-700';
      case 'In Progress':
        return 'border-blue-500 dark:border-blue-700';
      case 'Blocked':
        return 'border-red-500 dark:border-red-700';
      default:
        return 'border-gray-300 dark:border-gray-600';
    }
  };
  
  return (
    <div className="relative">
      {/* Task Selection Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSelectMode}
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              selectMode 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {selectMode ? 'Cancel Selection' : 'Select Tasks'}
          </button>
          
          {selectMode && (
            <button
              onClick={selectAllTasks}
              className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              Select All
            </button>
          )}
        </div>
        
        {selectMode && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {selectedTaskIds.length} of {tasks.length} selected
          </div>
        )}
      </div>
      
      {/* Tasks List with Selection */}
      <div className="space-y-2">
        {tasks.map((task, index) => {
          const isSelected = selectedTaskIds.includes(task.id);
          const priorityDisplay = getPriorityDisplay(task.priority || 'Low');
          const statusColor = getStatusColor(task.status);
          
          return (
            <div 
              key={task.id}
              className={`p-3 rounded-md border ${
                isSelected 
                  ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              } transition-colors duration-150 hover:border-primary-200 dark:hover:border-primary-800`}
              onClick={(e) => selectMode && toggleTaskSelection(task.id, index, e.shiftKey)}
            >
              <div className="flex items-center">
                {/* Selection Checkbox */}
                {selectMode && (
                  <div className="flex-shrink-0 mr-3">
                    <div 
                      className={`w-5 h-5 rounded border-2 ${statusColor} flex items-center justify-center ${
                        isSelected ? 'bg-primary-500 dark:bg-primary-700 border-primary-500 dark:border-primary-700' : ''
                      }`}
                    >
                      {isSelected && <CheckIcon className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                )}
                
                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className={`text-sm font-medium ${
                      task.status === 'Done' ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'
                    }`}>
                      {task.title}
                    </p>
                    
                    {/* Priority Indicator */}
                    <div className={`ml-2 flex-shrink-0 flex items-center ${priorityDisplay.className}`}>
                      {priorityDisplay.icon}
                      <span className="text-xs ml-1">{task.priority || 'Low'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-1 flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-x-3">
                    {/* Status */}
                    <div className="flex items-center">
                      <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                        task.status === 'Done' ? 'bg-green-500' :
                        task.status === 'In Progress' ? 'bg-blue-500' :
                        task.status === 'Blocked' ? 'bg-red-500' : 'bg-gray-400'
                      }`}></span>
                      <span>{task.status || 'Todo'}</span>
                    </div>
                    
                    {/* Due Date */}
                    {task.dueDate && (
                      <div className="flex items-center">
                        <span>Due: {formatDateRelative(task.dueDate)}</span>
                      </div>
                    )}
                    
                    {/* Project */}
                    {task.projectName && (
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
                        {task.projectName}
                      </div>
                    )}
                    
                    {/* Completed At */}
                    {task.status === 'Done' && task.completedAt && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                        <span>Completed: {formatDateRelative(task.completedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {tasks.length === 0 && (
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
          </div>
        )}
      </div>
      
      {/* Batch Actions Bar (fixed at bottom) */}
      <TaskBatchActions 
        selectedTasks={selectedTasks}
        onClearSelection={clearSelection}
        onActionComplete={handleActionComplete}
      />
      
      {/* Keyboard shortcuts info */}
      {selectMode && (
        <div className="fixed bottom-16 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 text-xs border border-gray-200 dark:border-gray-700">
          <div className="text-gray-700 dark:text-gray-300 font-medium mb-1">Selection Shortcuts:</div>
          <div className="text-gray-600 dark:text-gray-400">
            <div>- Shift+Click: Select range</div>
            <div>- Ctrl/Cmd+A: Select all</div>
            <div>- Esc: Cancel selection</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskMultiSelect; 