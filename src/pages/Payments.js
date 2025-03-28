import React, { useState } from 'react';
import { 
  PlusIcon, 
  ArrowDownTrayIcon, 
  ArrowUpTrayIcon, 
  DocumentTextIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

// Sample data
const paymentsData = [
  { 
    id: 1, 
    project: 'E-commerce Website',
    client: 'Client A',
    amount: 2500,
    status: 'Paid',
    date: '2023-04-02',
    invoiceNumber: 'INV-2023-001',
    type: 'Income'
  },
  { 
    id: 2, 
    project: 'Mobile App Development',
    client: 'Client B',
    amount: 3500,
    status: 'Pending',
    date: '2023-04-15',
    invoiceNumber: 'INV-2023-002',
    type: 'Income'
  },
  { 
    id: 3, 
    project: 'API Integration',
    client: 'Client C',
    amount: 1200,
    status: 'Paid',
    date: '2023-03-25',
    invoiceNumber: 'INV-2023-003',
    type: 'Income'
  },
  { 
    id: 4, 
    project: 'Website Redesign',
    client: 'Client D',
    amount: 1800,
    status: 'Overdue',
    date: '2023-03-15',
    invoiceNumber: 'INV-2023-004',
    type: 'Income'
  },
  { 
    id: 5, 
    project: 'Database Migration',
    client: 'Client E',
    amount: 2200,
    status: 'Draft',
    date: '2023-04-25',
    invoiceNumber: 'INV-2023-005',
    type: 'Income'
  },
  { 
    id: 6, 
    project: 'Server Costs',
    client: 'Hosting Provider',
    amount: 150,
    status: 'Paid',
    date: '2023-04-01',
    invoiceNumber: 'EXP-2023-001',
    type: 'Expense'
  },
  { 
    id: 7, 
    project: 'Software Licenses',
    client: 'Software Vendor',
    amount: 350,
    status: 'Paid',
    date: '2023-03-28',
    invoiceNumber: 'EXP-2023-002',
    type: 'Expense'
  },
];

// Helper for conditional class names
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Payments = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Calculate totals
  const totalIncome = paymentsData
    .filter(payment => payment.type === 'Income' && payment.status === 'Paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
    
  const totalPending = paymentsData
    .filter(payment => payment.type === 'Income' && payment.status === 'Pending')
    .reduce((sum, payment) => sum + payment.amount, 0);
    
  const totalExpenses = paymentsData
    .filter(payment => payment.type === 'Expense' && payment.status === 'Paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
    
  const profit = totalIncome - totalExpenses;
  
  // Filter payments based on active tab
  const filteredPayments = paymentsData.filter(payment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'income') return payment.type === 'Income';
    if (activeTab === 'expenses') return payment.type === 'Expense';
    if (activeTab === 'pending') return payment.status === 'Pending' || payment.status === 'Overdue';
    return true;
  });
  
  // Sort payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'date') {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortBy === 'project') {
      comparison = a.project.localeCompare(b.project);
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
  
  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Payments</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Track income, expenses, and manage invoices
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          <span>New Invoice</span>
        </button>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-green-500">
                <ArrowDownTrayIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Income</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalIncome)}</div>
                </dd>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-yellow-500">
                <BanknotesIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Pending</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalPending)}</div>
                </dd>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-red-500">
                <ArrowUpTrayIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Expenses</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalExpenses)}</div>
                </dd>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-blue-500">
                <CurrencyDollarIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Net Profit</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(profit)}</div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-dark-lighter">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {[
            { name: 'All', key: 'all' },
            { name: 'Income', key: 'income' },
            { name: 'Expenses', key: 'expenses' },
            { name: 'Pending', key: 'pending' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={classNames(
                tab.key === activeTab
                  ? 'border-primary text-primary dark:text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              )}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Payments table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-lighter">
            <thead className="bg-gray-50 dark:bg-dark-lighter">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center">
                    <span>Date</span>
                    {sortBy === 'date' && (
                      <span className="ml-1">
                        {sortOrder === 'desc' ? '↓' : '↑'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('project')}
                >
                  <div className="flex items-center">
                    <span>Project / Description</span>
                    {sortBy === 'project' && (
                      <span className="ml-1">
                        {sortOrder === 'desc' ? '↓' : '↑'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Client
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('status')}
                >
                  <div className="flex items-center">
                    <span>Status</span>
                    {sortBy === 'status' && (
                      <span className="ml-1">
                        {sortOrder === 'desc' ? '↓' : '↑'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('amount')}
                >
                  <div className="flex items-center justify-end">
                    <span>Amount</span>
                    {sortBy === 'amount' && (
                      <span className="ml-1">
                        {sortOrder === 'desc' ? '↓' : '↑'}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-DEFAULT divide-y divide-gray-200 dark:divide-dark-lighter">
              {sortedPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-dark-lighter transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                      {new Date(payment.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{payment.project}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{payment.invoiceNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {payment.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                    payment.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {payment.type === 'Income' ? '+' : '-'}{formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button type="button" className="text-primary hover:text-primary-dark mr-3">
                      <DocumentTextIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button type="button" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                      {payment.status === 'Paid' ? <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" /> : <BanknotesIcon className="h-5 w-5" aria-hidden="true" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty state */}
        {sortedPayments.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No payments found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments; 