import React, { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

// Sample project data
const projectsData = [
  { 
    id: 1, 
    name: 'E-commerce Website', 
    client: 'Client A', 
    status: 'In Progress', 
    deadline: '15 Apr 2023', 
    progress: 75,
    description: 'A fully featured e-commerce platform with payment integration and inventory management.',
    team: ['John D.', 'Sarah M.', 'Alex K.'],
    budget: '$8,500'
  },
  { 
    id: 2, 
    name: 'Mobile App Development', 
    client: 'Client B', 
    status: 'Planning', 
    deadline: '30 Apr 2023', 
    progress: 25,
    description: 'Cross-platform mobile application for iOS and Android with offline capabilities.',
    team: ['Mike L.', 'Laura S.'],
    budget: '$12,000'
  },
  { 
    id: 3, 
    name: 'API Integration', 
    client: 'Client C', 
    status: 'In Progress', 
    deadline: '22 Apr 2023', 
    progress: 40,
    description: 'Integration with third-party payment and shipping APIs for the client platform.',
    team: ['Robert J.', 'Emma P.', 'David C.'],
    budget: '$5,200'
  },
  { 
    id: 4, 
    name: 'Website Redesign', 
    client: 'Client D', 
    status: 'Completed', 
    deadline: '10 Apr 2023', 
    progress: 100,
    description: 'Complete redesign of corporate website with focus on modern UI and performance.',
    team: ['Nina T.', 'Mark B.'],
    budget: '$6,800'
  },
  { 
    id: 5, 
    name: 'Database Migration', 
    client: 'Client E', 
    status: 'Planning', 
    deadline: '5 May 2023', 
    progress: 10,
    description: 'Migration from legacy database system to a modern cloud-based solution.',
    team: ['Chris S.', 'Amanda L.'],
    budget: '$9,500'
  },
];

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Filter projects based on search and status filter
  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Projects</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Manage and track all your development projects
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 bg-white dark:bg-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary sm:text-sm"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="relative inline-block">
          <div className="flex items-center">
            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
            <select
              className="block w-full rounded-md border-0 py-1.5 px-3 bg-white dark:bg-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div key={project.id} className="card overflow-hidden flex flex-col">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{project.name}</h3>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  project.status === 'In Progress' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' 
                    : project.status === 'Planning'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
                    : 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">{project.client}</p>
            </div>
            
            <div className="border-t border-gray-200 dark:border-dark-lighter px-4 py-5 sm:px-6 flex-grow">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                {project.description}
              </p>
              
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="text-gray-700 dark:text-gray-300">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-lightest rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      project.status === 'Completed' 
                        ? 'bg-green-500' 
                        : 'bg-primary'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block">Deadline</span>
                  <span className="text-gray-800 dark:text-gray-200">{project.deadline}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block">Budget</span>
                  <span className="text-gray-800 dark:text-gray-200">{project.budget}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-dark-lighter px-4 py-3 sm:px-6">
              <div className="flex justify-between items-center">
                <div className="flex -space-x-2 overflow-hidden">
                  {project.team.map((member, index) => (
                    <div 
                      key={index}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-xs text-white ring-2 ring-white dark:ring-dark-DEFAULT"
                      title={member}
                    >
                      {member.charAt(0)}
                    </div>
                  ))}
                </div>
                <button className="text-primary text-sm font-medium hover:text-primary-dark">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Show when no results */}
      {filteredProjects.length === 0 && (
        <div className="bg-white dark:bg-dark-lighter rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No projects found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default Projects; 