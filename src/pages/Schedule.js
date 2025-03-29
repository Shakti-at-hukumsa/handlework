import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import ScheduleForm from '../components/modals/ScheduleForm';

// Helper function to group events by date
const groupEventsByDate = (events) => {
  const grouped = {};
  events.forEach(event => {
    const date = event.date;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(event);
  });
  return grouped;
};

// Helper to format time from 24h to 12h format
const formatTime = (timeString) => {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Helper to get event type color
const getEventTypeColor = (type) => {
  switch (type) {
    case 'Meeting':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'Deadline':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'Work Session':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'Break':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

// Get day of week
const getDayOfWeek = (dateString) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(dateString);
  return days[date.getDay()];
};

// Format date to display format
const formatDate = (dateString) => {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Schedule = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectIdFromUrl = queryParams.get('projectId');
  
  const { 
    data: { schedules, projects }, 
    addSchedule,
    updateSchedule,
    deleteSchedule
  } = useData();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activeFilter, setActiveFilter] = useState({
    projectId: projectIdFromUrl || 'all',
    type: 'all',
    view: 'upcoming' // can be 'upcoming', 'day', 'week', 'month'
  });
  
  // Set current date for calendar navigation
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Reset project filter when projectId from URL changes
  useEffect(() => {
    if (projectIdFromUrl) {
      setActiveFilter(prev => ({
        ...prev,
        projectId: projectIdFromUrl
      }));
    }
  }, [projectIdFromUrl]);

  // Open form for creating a new schedule event
  const handleAddSchedule = () => {
    setCurrentSchedule(null);
    setIsFormOpen(true);
  };

  // Open form for editing an existing schedule
  const handleEditSchedule = (schedule) => {
    setCurrentSchedule(schedule);
    setIsFormOpen(true);
  };

  // Handle saving schedule (create or update)
  const handleSaveSchedule = (formData) => {
    if (currentSchedule) {
      updateSchedule(currentSchedule.id, formData);
    } else {
      addSchedule(formData);
    }
    setIsFormOpen(false);
  };

  // Open delete confirmation
  const handleDeleteClick = (scheduleId) => {
    setConfirmDelete(scheduleId);
  };

  // Confirm and execute schedule deletion
  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteSchedule(confirmDelete);
      setConfirmDelete(null);
    }
  };

  // Update filters
  const handleFilterChange = (filterType, value) => {
    setActiveFilter(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Navigate through dates based on view
  const navigateDate = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      
      if (activeFilter.view === 'day') {
        newDate.setDate(newDate.getDate() + direction);
      } else if (activeFilter.view === 'week') {
        newDate.setDate(newDate.getDate() + (7 * direction));
      } else if (activeFilter.view === 'month') {
        newDate.setMonth(newDate.getMonth() + direction);
      }
      
      return newDate;
    });
  };

  // Get date range based on view
  const getDateRange = () => {
    const today = new Date();
    
    if (activeFilter.view === 'upcoming') {
      return 'Upcoming Events';
    } else if (activeFilter.view === 'day') {
      return formatDate(currentDate);
    } else if (activeFilter.view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
    } else if (activeFilter.view === 'month') {
      const options = { month: 'long', year: 'numeric' };
      return currentDate.toLocaleDateString(undefined, options);
    }
    
    return '';
  };

  // Filter schedules based on active filters and view
  const getFilteredSchedules = () => {
    let filtered = schedules.filter(schedule => {
      const projectMatch = activeFilter.projectId === 'all' || schedule.projectId === activeFilter.projectId;
      const typeMatch = activeFilter.type === 'all' || schedule.type === activeFilter.type;
      
      return projectMatch && typeMatch;
    });
    
    // Additional filtering based on view
    if (activeFilter.view === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= today;
      }).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Limit to next 10 events
      filtered = filtered.slice(0, 10);
    } else if (activeFilter.view === 'day') {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= dayStart && scheduleDate <= dayEnd;
      });
    } else if (activeFilter.view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= startOfWeek && scheduleDate <= endOfWeek;
      });
    } else if (activeFilter.view === 'month') {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
      
      filtered = filtered.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= startOfMonth && scheduleDate <= endOfMonth;
      });
    }
    
    return filtered;
  };

  // Get project name for a given project ID
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const filteredSchedules = getFilteredSchedules();
  const groupedSchedules = groupEventsByDate(filteredSchedules);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Schedule</h1>
        <button
          type="button"
          onClick={handleAddSchedule}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-4 w-4 mr-1" aria-hidden="true" />
          New Event
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={activeFilter.projectId}
          onChange={(e) => handleFilterChange('projectId', e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
        
        <select
          value={activeFilter.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Types</option>
          <option value="Meeting">Meeting</option>
          <option value="Deadline">Deadline</option>
          <option value="Work Session">Work Session</option>
          <option value="Break">Break</option>
          <option value="Other">Other</option>
        </select>
        
        <select
          value={activeFilter.view}
          onChange={(e) => handleFilterChange('view', e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="upcoming">Upcoming</option>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>
      
      {/* Schedule Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <ScheduleForm
                schedule={currentSchedule}
                onSave={handleSaveSchedule}
                onCancel={() => setIsFormOpen(false)}
                projectId={currentSchedule ? currentSchedule.projectId : activeFilter.projectId !== 'all' ? activeFilter.projectId : undefined}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Delete Event
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete this scheduled event? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Date Navigation (except for Upcoming view) */}
      {activeFilter.view !== 'upcoming' && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateDate(-1)}
            className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {getDateRange()}
          </h2>
          
          <button
            type="button"
            onClick={() => navigateDate(1)}
            className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
      
      {/* Schedule Events List */}
      {Object.keys(groupedSchedules).length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No events</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {activeFilter.view === 'upcoming' 
              ? 'No upcoming events. Get started by scheduling something.' 
              : 'No events scheduled for this time period.'}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleAddSchedule}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Event
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedSchedules).sort((a, b) => new Date(a) - new Date(b)).map(date => (
            <div key={date} className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(date)}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getDayOfWeek(date)}
                  </p>
                </div>
                <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {groupedSchedules[date].sort((a, b) => {
                  if (a.startTime && b.startTime) {
                    return a.startTime.localeCompare(b.startTime);
                  }
                  return 0;
                }).map(event => (
                  <li key={event.id} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEventTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                          <h4 className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                            {event.title}
                          </h4>
                        </div>
                        {event.description && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center mr-4">
                            <ClockIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                            <span>
                              {event.startTime && event.endTime 
                                ? `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
                                : 'All Day'}
                            </span>
                          </div>
                          {event.projectId && (
                            <div>
                              <span>Project: {getProjectName(event.projectId)}</span>
                            </div>
                          )}
                        </div>
                        {event.recurrence && event.recurrence !== 'none' && (
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>Recurring: {event.recurrence}</span>
                            {event.recurrencePattern && (
                              <span> ({event.recurrencePattern})</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditSchedule(event)}
                          className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <PencilIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(event.id)}
                          className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <TrashIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule; 