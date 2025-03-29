import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useData } from '../../contexts/DataContext';

const ScheduleForm = ({ schedule, projectId, onSave, onCancel }) => {
  const { data } = useData();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: projectId || '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'Work',
    isRecurring: false,
    recurringPattern: 'weekly'
  });

  useEffect(() => {
    if (schedule) {
      setFormData({
        title: schedule.title || '',
        description: schedule.description || '',
        projectId: schedule.projectId || projectId || '',
        date: schedule.date || '',
        startTime: schedule.startTime || '',
        endTime: schedule.endTime || '',
        type: schedule.type || 'Work',
        isRecurring: schedule.isRecurring || false,
        recurringPattern: schedule.recurringPattern || 'weekly'
      });
    } else if (projectId) {
      setFormData(prev => ({
        ...prev,
        projectId
      }));
    }
  }, [schedule, projectId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.date) {
      alert('Title and date are required fields.');
      return;
    }

    // If start time is set, end time must also be set
    if (formData.startTime && !formData.endTime) {
      alert('If start time is set, end time is required.');
      return;
    }

    // Validate that end time is after start time
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      alert('End time must be after start time.');
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {schedule ? 'Edit Schedule' : 'New Schedule'}
        </h2>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          onClick={onCancel}
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            required
          />
        </div>
        
        {!projectId && (
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project
            </label>
            <select
              name="projectId"
              id="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            >
              <option value="">Not project-specific</option>
              {data.projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date *
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              id="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              id="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            >
              <option value="Work">Work</option>
              <option value="Meeting">Meeting</option>
              <option value="Break">Break</option>
              <option value="Personal">Personal</option>
              <option value="Deadline">Deadline</option>
            </select>
          </div>
          
          <div className="flex items-center h-full pt-6">
            <input
              type="checkbox"
              name="isRecurring"
              id="isRecurring"
              checked={formData.isRecurring}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
              Recurring event
            </label>
          </div>
        </div>
        
        {formData.isRecurring && (
          <div>
            <label htmlFor="recurringPattern" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Recurring Pattern
            </label>
            <select
              name="recurringPattern"
              id="recurringPattern"
              value={formData.recurringPattern}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}
        
        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {schedule ? 'Update Schedule' : 'Create Schedule'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm; 