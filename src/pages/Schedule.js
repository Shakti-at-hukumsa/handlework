import React, { useState } from 'react';
import { format, startOfWeek, addDays, getDate, isSameMonth, isToday, isSameDay } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';

// Sample events data
const eventsData = [
  { 
    id: 1, 
    title: 'Client Meeting', 
    start: new Date(2023, 3, 15, 10, 0), 
    end: new Date(2023, 3, 15, 11, 30),
    type: 'meeting',
    project: 'E-commerce Website'
  },
  { 
    id: 2, 
    title: 'Project Deadline', 
    start: new Date(2023, 3, 20, 18, 0), 
    end: new Date(2023, 3, 20, 18, 0),
    type: 'deadline',
    project: 'Mobile App Development'
  },
  { 
    id: 3, 
    title: 'Team Standup', 
    start: new Date(2023, 3, 17, 9, 30), 
    end: new Date(2023, 3, 17, 10, 0),
    type: 'meeting',
    project: 'API Integration'
  },
  { 
    id: 4, 
    title: 'Code Review', 
    start: new Date(2023, 3, 18, 14, 0), 
    end: new Date(2023, 3, 18, 16, 0),
    type: 'work',
    project: 'E-commerce Website'
  },
  { 
    id: 5, 
    title: 'Planning Session', 
    start: new Date(2023, 3, 16, 11, 0), 
    end: new Date(2023, 3, 16, 12, 30),
    type: 'meeting',
    project: 'Database Migration'
  },
];

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Generate the days of the week
  const generateWeekDays = () => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start from Monday
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      weekDays.push(day);
    }
    
    return weekDays;
  };
  
  const weekDays = generateWeekDays();
  
  // Filter events for the selected day
  const dayEvents = eventsData.filter(event => 
    isSameDay(event.start, selectedDate)
  ).sort((a, b) => a.start - b.start);
  
  // Helper for styling days in calendar
  const getDayClass = (day) => {
    let classes = 'h-12 w-12 rounded-full flex items-center justify-center text-sm';
    
    if (isToday(day)) {
      classes += ' bg-primary text-white';
    } else if (isSameDay(day, selectedDate)) {
      classes += ' bg-primary-dark text-white';
    } else if (!isSameMonth(day, currentDate)) {
      classes += ' text-gray-400 dark:text-gray-600';
    } else {
      classes += ' text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-lighter';
    }
    
    return classes;
  };
  
  // Get event styles based on event type
  const getEventStyle = (eventType) => {
    switch (eventType) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700';
      case 'deadline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700';
      case 'work':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Schedule</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Manage your meetings, deadlines and work sessions
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          <span>New Event</span>
        </button>
      </div>
      
      {/* Calendar navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className="p-1.5 rounded-full bg-white dark:bg-dark-lighter text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-100 dark:hover:bg-dark-lightest"
          >
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-md bg-white dark:bg-dark-lighter text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-100 dark:hover:bg-dark-lightest text-sm"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className="p-1.5 rounded-full bg-white dark:bg-dark-lighter text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-100 dark:hover:bg-dark-lightest"
          >
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      
      {/* Weekly calendar */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-dark-lightest border-b border-gray-200 dark:border-dark-lighter">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-white dark:bg-dark-lighter">
          {weekDays.map(day => (
            <div 
              key={day.toString()} 
              className="p-2 h-36 bg-white dark:bg-dark-DEFAULT border-b border-gray-200 dark:border-dark-lighter"
            >
              <button
                type="button"
                onClick={() => setSelectedDate(day)}
                className={getDayClass(day)}
              >
                {getDate(day)}
              </button>
              
              <div className="mt-2 space-y-1 overflow-y-auto max-h-24">
                {eventsData
                  .filter(event => isSameDay(event.start, day))
                  .slice(0, 3)
                  .map(event => (
                    <div 
                      key={event.id}
                      className={`px-2 py-1 text-xs truncate rounded border-l-4 ${getEventStyle(event.type)}`}
                    >
                      {format(event.start, 'HH:mm')} - {event.title}
                    </div>
                  ))
                }
                {eventsData.filter(event => isSameDay(event.start, day)).length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                    +{eventsData.filter(event => isSameDay(event.start, day)).length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Day detail view */}
      <div className="card overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Events for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
        </div>
        
        <div className="border-t border-gray-200 dark:border-dark-lighter">
          {dayEvents.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-dark-lighter">
              {dayEvents.map(event => (
                <li key={event.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-dark-lighter">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-10 rounded-full mr-4 ${
                        event.type === 'meeting' ? 'bg-blue-500' : 
                        event.type === 'deadline' ? 'bg-red-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-dark-lighter text-gray-600 dark:text-gray-300">
                            {event.project}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="text-primary text-sm hover:text-primary-dark">
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
              No events scheduled for this day
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule; 