import { Bell, LayoutDashboardIcon, ListCheckIcon, Settings, User } from 'lucide-react';
import React, { useState } from 'react';


const approveItem = async (itemId) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, itemId };
};

const approveAllItems = async (itemIds) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  return { success: true, approvedCount: itemIds.length };
};


const ApprovalItem = ({ item, onApprove }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [status, setStatus] = useState('pending');

  const handleApprove = async () => {

    setIsApproving(true);
    setStatus('approving');

    try {
      await onApprove(item.id);
      setStatus('approved');
    } catch (error) {
      setStatus('error');
    } finally {
      setIsApproving(false);
    }
  };

  const getStatusBadge = () => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      approving: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Approving...' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      error: { bg: 'bg-red-100', text: 'text-red-800', label: 'Error' }
    };
    
    const badge = badges[status];
    return (
      <span 
        data-testid={`status-${item.id}`}
        className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  const getIcon = () => {
    if (item.title.includes('Registration')) return '👤';
    if (item.title.includes('Content')) return '📄';
    if (item.title.includes('Profile')) return '✏️';
    return '📋';
  };

  return (
    <div 
      data-testid={`approval-item-${item.id}`}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-xl">{getIcon()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">ID: {item.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-shrink-0">
          {getStatusBadge()}
          <button
            onClick={handleApprove}
            data-testid={`approve-btn-${item.id}`}
            disabled={isApproving || status === 'approved'}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isApproving || status === 'approved'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {isApproving ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Approving...
              </span>
            ) : status === 'approved' ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Approved
              </span>
            ) : (
              'Approve'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


export const PendingApprovals = () => {
  const [items, setItems] = useState([
    { id: 1, title: 'User Registration: john@example.com', status: 'pending' },
    { id: 2, title: 'Content Submission: Blog Post', status: 'pending' },
    { id: 3, title: 'Profile Update: Jane Smith', status: 'pending' }
  ]);
  
  const [isApprovingAll, setIsApprovingAll] = useState(false);
  const [approveAllStatus, setApproveAllStatus] = useState('');
  const [apiCallCount, setApiCallCount] = useState(0);

  const handleApproveItem = async (itemId) => {
 
    setApiCallCount(prev => prev + 1);
    
    await approveItem(itemId);
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, status: 'approved' } : item
      )
    );
  };

  const handleApproveAll = async () => {

    setIsApprovingAll(true);
    setApproveAllStatus('approving');

    const pendingItems = items.filter(item => item.status === 'pending');
    const pendingIds = pendingItems.map(item => item.id);

    try {

      setApiCallCount(prev => prev + 1);
      
      await approveAllItems(pendingIds);
      
      setItems(prevItems =>
        prevItems.map(item => ({ ...item, status: 'approved' }))
      );
      
      setApproveAllStatus('success');
    } catch (error) {
      setApproveAllStatus('error');
    } finally {
      setIsApprovingAll(false);
    }
  };

  const pendingCount = items.filter(item => item.status === 'pending').length;

  return (
    <div data-testid="pending-approvals" className="space-y-6">
      {/* Header with Approve All Button */}
      <div data-testid="header" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Pending Approvals</h3>
            <p className="text-sm text-gray-600 mt-1">
              {pendingCount > 0 ? (
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  {pendingCount} item{pendingCount !== 1 ? 's' : ''} awaiting approval
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  All items approved
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleApproveAll}
            data-testid="approve-all-btn"
            disabled={isApprovingAll || pendingCount === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isApprovingAll || pendingCount === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-sm'
            }`}
          >
            {isApprovingAll ? (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Approving All...
              </span>
            ) : (
              'Approve All'
            )}
          </button>
        </div>
      </div>

      {/* Approve All Status Message */}
      {approveAllStatus && (
        <div data-testid="approve-all-status">
          {approveAllStatus === 'approving' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-5 h-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-blue-800 font-medium">Processing all approvals...</span>
            </div>
          )}
          {approveAllStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">All items approved successfully!</span>
            </div>
          )}
          {approveAllStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">Error approving items. Please try again.</span>
            </div>
          )}
        </div>
      )}

      {/* Hidden API Call Counter */}
      <div data-testid="api-call-count" style={{ display: 'none' }}>
        {apiCallCount}
      </div>

      {/* Items List */}
      <div data-testid="items-list" className="space-y-3">
        {items.map(item => (
          <ApprovalItem
            key={item.id}
            item={item}
            onApprove={handleApproveItem}
          />
        ))}
      </div>
    </div>
  );
};


const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Approvals');
  
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboardIcon size={22} />  },
    { name: 'Approvals', icon: <ListCheckIcon size={22} />  },
    { name: 'Settings', icon: <Settings size={22} /> }
  ];

  return (
    <div data-testid="sidebar" className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Debug Challenge #3</p>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.name}>
              <button
                onClick={() => setActiveItem(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeItem === item.name
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};


const TopBar = () => {
  return (
    <div data-testid="topbar" className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input 
              type="search" 
              placeholder="Search approvals..." 
              data-testid="search-bar"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-6">
           <button 
            data-testid="notifications"
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-xl"><Bell size={22} /></span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button 
            data-testid="user-profile"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-xl"><User size={22} /></span>
          </button>
        </div>
      </div>
    </div>
  );
};


const MainPanel = () => {
  return (
    <div data-testid="main-panel" className="flex-1 p-6">
      <PendingApprovals />
    </div>
  );
};


export const AdminDashboardB = () => {
  return (
    <div data-testid="admin-dashboard" className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto">
          <MainPanel />
        </div>
      </div>
    </div>
  );
};