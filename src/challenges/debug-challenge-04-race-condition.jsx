import { Bell, LayoutDashboardIcon, Settings, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';

// Mock API functions
const fetchUserStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    totalUsers: 1250,
    activeUsers: 890,
    newSignups: 45
  };
};

const fetchPendingApprovals = async () => {
  await new Promise(resolve => setTimeout(resolve, 80));
  return [
    { id: 1, type: 'user_registration', name: 'Alice Johnson' },
    { id: 2, type: 'user_registration', name: 'Bob Smith' },
    { id: 3, type: 'user_registration', name: 'Charlie Brown' }
  ];
};

const approveUser = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return { success: true, userId };
};

// UserStats Component - Updates totalUsers
const UserStats = ({ totalUsers, onUpdateTotalUsers }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      
      try {
        const data = await fetchUserStats();
        setStats(data);
        
        // BUG: Direct state update without considering concurrent updates
        onUpdateTotalUsers(data.totalUsers);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [onUpdateTotalUsers]);

  if (loading) {
    return (
      <div data-testid="user-stats-loading" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading statistics...</span>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="user-stats" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div data-testid="total-users" className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-sm font-medium text-indigo-600">Total Users</span>
          </div>
          <p className="text-3xl font-bold text-indigo-900">{totalUsers.toLocaleString()}</p>
        </div>
        
        <div data-testid="active-users" className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-600">Active Users</span>
          </div>
          <p className="text-3xl font-bold text-green-900">{stats?.activeUsers || 0}</p>
        </div>
        
        <div data-testid="new-signups" className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            <span className="text-sm font-medium text-blue-600">New Signups</span>
          </div>
          <p className="text-3xl font-bold text-blue-900">{stats?.newSignups || 0}</p>
        </div>
      </div>
    </div>
  );
};

// PendingApprovals Component - Also updates totalUsers when approving
const PendingApprovals = ({ totalUsers, onUpdateTotalUsers }) => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingIds, setApprovingIds] = useState(new Set());

  useEffect(() => {
    const loadApprovals = async () => {
      setLoading(true);
      
      try {
        const data = await fetchPendingApprovals();
        setApprovals(data);
      } catch (error) {
        console.error('Failed to load approvals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApprovals();
  }, []);

  const handleApprove = async (approvalId) => {
    if (approvingIds.has(approvalId)) return;

    setApprovingIds(prev => new Set(prev).add(approvalId));

    try {
      await approveUser(approvalId);
      
      // Remove from pending list
      setApprovals(prev => prev.filter(a => a.id !== approvalId));
      
      // BUG: Race condition - reading stale totalUsers and incrementing
      // If UserStats is still loading or updates at the same time, this will overwrite
      const newTotal = totalUsers + 1;
      onUpdateTotalUsers(newTotal);
      
    } catch (error) {
      console.error('Failed to approve:', error);
    } finally {
      setApprovingIds(prev => {
        const next = new Set(prev);
        next.delete(approvalId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div data-testid="approvals-loading" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading approvals...</span>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="pending-approvals" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
          <p className="text-sm text-gray-600 mt-1">
            {approvals.length > 0 ? (
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                {approvals.length} pending approval{approvals.length !== 1 ? 's' : ''}
              </span>
            ) : (
              <span className="text-green-600">No pending approvals</span>
            )}
          </p>
        </div>
        <div data-testid="approvals-total-users" className="bg-gray-50 px-4 py-2 rounded-lg">
          <span className="text-xs text-gray-500 block">Total Users</span>
          <span className="text-lg font-bold text-gray-900">{totalUsers}</span>
        </div>
      </div>

      <div data-testid="approvals-list" className="space-y-3">
        {approvals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>All approvals processed</p>
          </div>
        ) : (
          approvals.map(approval => (
            <div 
              key={approval.id} 
              data-testid={`approval-${approval.id}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">
                    {approval.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{approval.name}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {approval.type.replace('_', ' ')}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleApprove(approval.id)}
                disabled={approvingIds.has(approval.id)}
                data-testid={`approve-btn-${approval.id}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  approvingIds.has(approval.id)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                }`}
              >
                {approvingIds.has(approval.id) ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Approving...
                  </span>
                ) : (
                  'Approve'
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// MainPanel - Manages shared state with race condition bugs
const MainPanel = () => {
  // BUG: Both components update this shared state, causing race conditions
  const [totalUsers, setTotalUsers] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);

  // Track how many times the state was updated (for testing)
  const handleUpdateTotalUsers = (newTotal) => {
    setTotalUsers(newTotal);
    setUpdateCount(prev => prev + 1);
  };

  return (
    <div data-testid="main-panel" className="flex-1 p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
        <p className="text-gray-600">Monitor statistics and approve pending registrations</p>
      </div>
      
      <div data-testid="update-count" style={{ display: 'none' }}>
        {updateCount}
      </div>
      
      <UserStats 
        totalUsers={totalUsers} 
        onUpdateTotalUsers={handleUpdateTotalUsers} 
      />
      <PendingApprovals 
        totalUsers={totalUsers} 
        onUpdateTotalUsers={handleUpdateTotalUsers} 
      />
    </div>
  );
};

// Sidebar Component
const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Users');
  
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboardIcon size={22} />  },
    { name: 'Users', icon: <User size={22} /> },
    { name: 'Settings', icon: <Settings size={22} /> }
  ];

  return (
    <div data-testid="sidebar" className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Debug Challenge #4</p>
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

// TopBar Component
const TopBar = () => {
  return (
    <div data-testid="topbar" className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input 
              type="search" 
              placeholder="Search users..." 
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

// Main AdminDashboard Component
export const AdminDashboardC = () => {
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

// Export for testing
export { UserStats, PendingApprovals, MainPanel };