import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { findBrokenReferences, compressData, decompressData } from '../utils/devTools';

// App version for data migration purposes
export const APP_VERSION = '1.0.2';
export const DATA_VERSION = '1.0.0';

// Initial empty states
const initialState = {
  projects: [],
  tasks: [],
  schedules: [],
  payments: [],
  metadata: {
    version: DATA_VERSION,
    lastBackup: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

// Create context
export const DataContext = createContext();

// Create provider
export const DataProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [data, setData] = useState(() => {
    try {
      // Check if localStorage is available
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn("localStorage is not available in this environment");
        return initialState;
      }
      
      const savedData = localStorage.getItem('app-data');
      // Check if data is compressed (starts with eyJ is the beginning of base64-encoded JSON)
      let parsedData;
      if (savedData && savedData.startsWith('eyJ')) {
        // Data is compressed
        parsedData = decompressData(savedData);
      } else {
        // Data is not compressed
        parsedData = savedData ? JSON.parse(savedData) : initialState;
      }
      
      // Ensure metadata exists
      if (!parsedData.metadata) {
        parsedData.metadata = {
          version: DATA_VERSION,
          lastBackup: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      return parsedData;
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      return initialState;
    }
  });
  
  // Data compression setting
  const [useCompression, setUseCompression] = useState(() => {
    try {
      // Check if localStorage is available
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      return localStorage.getItem('use-compression') === 'true';
    } catch (error) {
      console.error("Error accessing localStorage for compression setting:", error);
      return false;
    }
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      // Check if localStorage is available
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn("Cannot save data - localStorage is not available");
        return;
      }
      
      // Update metadata
      const updatedData = {
        ...data,
        metadata: {
          ...data.metadata,
          updatedAt: new Date().toISOString()
        }
      };
      
      // Save with or without compression
      if (useCompression) {
        const compressedData = compressData(updatedData);
        if (compressedData) {
          localStorage.setItem('app-data', compressedData);
        }
      } else {
        localStorage.setItem('app-data', JSON.stringify(updatedData));
      }
      
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [data, useCompression]);

  // Save compression setting
  useEffect(() => {
    try {
      // Check if localStorage is available
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn("Cannot save compression setting - localStorage is not available");
        return;
      }
      localStorage.setItem('use-compression', useCompression.toString());
    } catch (error) {
      console.error("Error saving compression setting:", error);
    }
  }, [useCompression]);

  // Projects CRUD operations
  const addProject = (project) => {
    const newProject = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...project
    };
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
    return newProject;
  };

  const updateProject = (id, updates) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, ...updates, updatedAt: new Date().toISOString() } : project
      )
    }));
  };

  const deleteProject = (id) => {
    // Also delete related tasks, schedules, and payments
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id),
      tasks: prev.tasks.filter(task => task.projectId !== id),
      schedules: prev.schedules.filter(schedule => schedule.projectId !== id),
      payments: prev.payments.filter(payment => payment.projectId !== id)
    }));
  };

  const getProject = (id) => {
    return data.projects.find(project => project.id === id);
  };

  // Tasks CRUD operations
  const addTask = (task) => {
    const newTask = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'Todo', // Default status
      ...task
    };
    setData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
    return newTask;
  };

  const updateTask = (id, updates) => {
    // If status is changing to Done, add completedAt timestamp
    const isCompletingTask = updates.status === 'Done';
    
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => {
        if (task.id === id) {
          const updatedTask = { 
            ...task, 
            ...updates, 
            updatedAt: new Date().toISOString() 
          };
          
          // Add completedAt timestamp if task is being marked as Done
          if (isCompletingTask && !updatedTask.completedAt) {
            updatedTask.completedAt = new Date().toISOString();
          }
          
          // Remove completedAt if task is being unmarked as Done
          if (updates.status && updates.status !== 'Done' && updatedTask.completedAt) {
            delete updatedTask.completedAt;
          }
          
          return updatedTask;
        }
        return task;
      })
    }));
  };

  const deleteTask = (id) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id)
    }));
  };

  const getTask = (id) => {
    return data.tasks.find(task => task.id === id);
  };

  // Schedules CRUD operations
  const addSchedule = (schedule) => {
    const newSchedule = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...schedule
    };
    setData(prev => ({
      ...prev,
      schedules: [...prev.schedules, newSchedule]
    }));
    return newSchedule;
  };

  const updateSchedule = (id, updates) => {
    setData(prev => ({
      ...prev,
      schedules: prev.schedules.map(schedule => 
        schedule.id === id ? { ...schedule, ...updates, updatedAt: new Date().toISOString() } : schedule
      )
    }));
  };

  const deleteSchedule = (id) => {
    setData(prev => ({
      ...prev,
      schedules: prev.schedules.filter(schedule => schedule.id !== id)
    }));
  };

  const getSchedule = (id) => {
    return data.schedules.find(schedule => schedule.id === id);
  };

  // Payments CRUD operations
  const addPayment = (payment) => {
    const newPayment = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'Pending', // Default status
      ...payment
    };
    setData(prev => ({
      ...prev,
      payments: [...prev.payments, newPayment]
    }));
    return newPayment;
  };

  const updatePayment = (id, updates) => {
    // If status is changing to Paid, add paidAt timestamp
    const isCompletingPayment = updates.status === 'Paid';
    
    setData(prev => ({
      ...prev,
      payments: prev.payments.map(payment => {
        if (payment.id === id) {
          const updatedPayment = { 
            ...payment, 
            ...updates, 
            updatedAt: new Date().toISOString() 
          };
          
          // Add paidAt timestamp if payment is being marked as Paid
          if (isCompletingPayment && !updatedPayment.paidAt) {
            updatedPayment.paidAt = new Date().toISOString();
          }
          
          // Remove paidAt if payment is being unmarked as Paid
          if (updates.status && updates.status !== 'Paid' && updatedPayment.paidAt) {
            delete updatedPayment.paidAt;
          }
          
          return updatedPayment;
        }
        return payment;
      })
    }));
  };

  const deletePayment = (id) => {
    setData(prev => ({
      ...prev,
      payments: prev.payments.filter(payment => payment.id !== id)
    }));
  };

  const getPayment = (id) => {
    return data.payments.find(payment => payment.id === id);
  };

  // Batch operations
  const batchUpdateTasks = (taskIds, updates) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        taskIds.includes(task.id) 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() } 
          : task
      )
    }));
  };

  const batchDeleteTasks = (taskIds) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => !taskIds.includes(task.id))
    }));
  };

  // Data export and import functions
  const exportData = () => {
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData) => {
    try {
      const parsedData = JSON.parse(jsonData);
      // Validate required structure
      if (
        Array.isArray(parsedData.projects) &&
        Array.isArray(parsedData.tasks) &&
        Array.isArray(parsedData.schedules) &&
        Array.isArray(parsedData.payments)
      ) {
        // Ensure metadata
        if (!parsedData.metadata) {
          parsedData.metadata = {
            version: DATA_VERSION,
            lastBackup: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
        
        setData(parsedData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  };

  // Enhanced backup and restore functions
  const backupDataToFile = () => {
    try {
      const updatedData = {
        ...data,
        metadata: {
          ...data.metadata,
          lastBackup: new Date().toISOString()
        }
      };
      
      // Update state with backup timestamp
      setData(updatedData);
      
      const dataStr = JSON.stringify(updatedData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `devspace-backup-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return true;
    } catch (error) {
      console.error("Error backing up data:", error);
      return false;
    }
  };

  const restoreDataFromFile = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      
      fileReader.onload = (event) => {
        try {
          const jsonData = event.target.result;
          const success = importData(jsonData);
          
          if (success) {
            resolve(true);
          } else {
            reject(new Error("Invalid data format"));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      fileReader.onerror = (error) => {
        reject(error);
      };
      
      fileReader.readAsText(file);
    });
  };

  // Toggle data compression
  const toggleCompression = () => {
    setUseCompression(prev => !prev);
    return !useCompression;
  };

  // Add data validation helper
  const validateData = () => {
    const issues = [];
    
    // Check for orphaned tasks (referring to deleted projects)
    const orphanedTasks = findBrokenReferences(
      data.projects, 
      data.tasks, 
      'id', 
      'projectId'
    );
    
    if (orphanedTasks.length > 0) {
      issues.push({
        type: 'orphanedTasks',
        count: orphanedTasks.length,
        items: orphanedTasks
      });
    }
    
    // Check for orphaned schedules
    const orphanedSchedules = findBrokenReferences(
      data.projects, 
      data.schedules, 
      'id', 
      'projectId'
    );
    
    if (orphanedSchedules.length > 0) {
      issues.push({
        type: 'orphanedSchedules',
        count: orphanedSchedules.length,
        items: orphanedSchedules
      });
    }
    
    // Check for orphaned payments
    const orphanedPayments = findBrokenReferences(
      data.projects, 
      data.payments, 
      'id', 
      'projectId'
    );
    
    if (orphanedPayments.length > 0) {
      issues.push({
        type: 'orphanedPayments',
        count: orphanedPayments.length,
        items: orphanedPayments
      });
    }
    
    // Check for missing required fields in projects
    const invalidProjects = data.projects.filter(project => 
      !project.name || !project.client
    );
    
    if (invalidProjects.length > 0) {
      issues.push({
        type: 'invalidProjects',
        count: invalidProjects.length,
        items: invalidProjects
      });
    }
    
    // Check for invalid dates
    const invalidDateTasks = data.tasks.filter(task => 
      (task.dueDate && isNaN(new Date(task.dueDate).getTime()))
    );
    
    if (invalidDateTasks.length > 0) {
      issues.push({
        type: 'invalidDateTasks',
        count: invalidDateTasks.length,
        items: invalidDateTasks
      });
    }

    return {
      valid: issues.length === 0,
      issues
    };
  };

  // Get statistics
  const getStatistics = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Total counts
    const totalProjects = data.projects.length;
    const totalTasks = data.tasks.length;
    const totalSchedules = data.schedules.length;
    const totalPayments = data.payments.length;
    
    // Active projects
    const activeProjects = data.projects.filter(p => 
      p.status !== 'Completed' && p.status !== 'Cancelled'
    ).length;
    
    // Completed tasks
    const completedTasks = data.tasks.filter(t => t.status === 'Done').length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // This week's tasks
    const tasksThisWeek = data.tasks.filter(t => {
      const createdAt = new Date(t.createdAt);
      return createdAt >= startOfWeek;
    }).length;
    
    // This week's completed tasks
    const completedTasksThisWeek = data.tasks.filter(t => {
      if (t.status !== 'Done') return false;
      const completedAt = new Date(t.completedAt || t.updatedAt);
      return completedAt >= startOfWeek;
    }).length;
    
    // This month's payments
    const paymentsThisMonth = data.payments.filter(p => {
      const createdAt = new Date(p.createdAt);
      return createdAt >= startOfMonth;
    });
    
    // Total earnings
    const totalEarnings = data.payments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    
    // This month's earnings
    const earningsThisMonth = paymentsThisMonth
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    
    return {
      counts: {
        totalProjects,
        activeProjects,
        totalTasks,
        completedTasks,
        tasksThisWeek,
        completedTasksThisWeek,
        totalSchedules,
        totalPayments
      },
      rates: {
        completionRate: completionRate.toFixed(1),
        activeProjectsRate: totalProjects > 0 ? (activeProjects / totalProjects) * 100 : 0
      },
      financial: {
        totalEarnings,
        earningsThisMonth,
        pendingPayments: data.payments
          .filter(p => p.status === 'Pending')
          .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
      },
      timestamps: {
        firstCreated: data.metadata.createdAt,
        lastUpdated: data.metadata.updatedAt,
        lastBackup: data.metadata.lastBackup
      }
    };
  };

  // Fix orphaned records
  const fixOrphanedRecords = () => {
    // Get validation results
    const validation = validateData();
    
    if (validation.valid) {
      return { fixed: 0, validation };
    }
    
    // Get orphaned item IDs
    const orphanedTaskIds = validation.issues
      .find(issue => issue.type === 'orphanedTasks')?.items
      .map(item => item.id) || [];
      
    const orphanedScheduleIds = validation.issues
      .find(issue => issue.type === 'orphanedSchedules')?.items
      .map(item => item.id) || [];
      
    const orphanedPaymentIds = validation.issues
      .find(issue => issue.type === 'orphanedPayments')?.items
      .map(item => item.id) || [];
    
    // Update data to remove projectId from orphaned items
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        orphanedTaskIds.includes(task.id) 
          ? { ...task, projectId: null, updatedAt: new Date().toISOString() } 
          : task
      ),
      schedules: prev.schedules.map(schedule => 
        orphanedScheduleIds.includes(schedule.id) 
          ? { ...schedule, projectId: null, updatedAt: new Date().toISOString() } 
          : schedule
      ),
      payments: prev.payments.map(payment => 
        orphanedPaymentIds.includes(payment.id) 
          ? { ...payment, projectId: null, updatedAt: new Date().toISOString() } 
          : payment
      )
    }));
    
    // Return the count of fixed items
    const fixedCount = orphanedTaskIds.length + orphanedScheduleIds.length + orphanedPaymentIds.length;
    
    return { 
      fixed: fixedCount,
      validation: validateData() // Re-validate
    };
  };

  // Reset all data
  const resetData = () => {
    setData({
      ...initialState,
      metadata: {
        ...initialState.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  };

  // Context value
  const value = {
    data,
    addProject,
    updateProject,
    deleteProject,
    getProject,
    addTask,
    updateTask,
    deleteTask,
    getTask,
    batchUpdateTasks,
    batchDeleteTasks,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedule,
    addPayment,
    updatePayment,
    deletePayment,
    getPayment,
    exportData,
    importData,
    resetData,
    backupDataToFile,
    restoreDataFromFile,
    validateData,
    getStatistics,
    fixOrphanedRecords,
    useCompression,
    toggleCompression,
    APP_VERSION,
    DATA_VERSION
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook for using the context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}; 