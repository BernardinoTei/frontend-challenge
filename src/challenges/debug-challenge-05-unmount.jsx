import { BarChart, Bell, LayoutDashboardIcon, ListCheckIcon, Settings, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';


const fetchRecentActivities = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [
    { id: 1, user: 'Alice', action: 'Logged in', time: '2 mins ago', type: 'login' },
    { id: 2, user: 'Bob', action: 'Updated profile', time: '5 mins ago', type: 'update' },
    { id: 3, user: 'Charlie', action: 'Created post', time: '10 mins ago', type: 'create' },
    { id: 4, user: 'David', action: 'Deleted comment', time: '15 mins ago', type: 'delete' },
    { id: 5, user: 'Eve', action: 'Shared content', time: '20 mins ago', type: 'share' }
  ];
};

const fetchPendingApprovals = async () => {
  await new Promise(resolve => setTimeout(resolve, 180));
  return [
    { id: 1, title: 'User Registration: john@example.com', type: 'registration', status: 'pending' },
    { id: 2, title: 'Content Submission: Blog Post', type: 'content', status: 'pending' },
    { id: 3, title: 'Profile Update: Jane Smith', type: 'profile', status: 'pending' }
  ];
};

const fetchUserStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 150));
  return {
    totalUsers: 1250,
    activeUsers: 890,
    newSignups: 45
  };
};


const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchRecentActivities();

        setActivities(data);
        setError(null);
      } catch (err) {

        setError(err.message);
      } finally {

        setLoading(false);
      }
    };

    loadActivities();
    

  }, []);

  const getActivityIcon = (type) => {
    const icons = {
      login: '🔐',
      update: '✏️',
      create: '➕',
      delete: '🗑️',
      share: '🔗'
    };
    return icons[type] || '📋';
  };

  const getActivityColor = (type) => {
    const colors = {
      login: 'bg-blue-50 border-blue-200',
      update: 'bg-yellow-50 border-yellow-200',
      create: 'bg-green-50 border-green-200',
      delete: 'bg-red-50 border-red-200',
      share: 'bg-purple-50 border-purple-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  if (loading) {
    return (
      <div data-testid="activities-loading" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600 font-medium">Loading activities...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="activities-error" className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-medium text-red-800">Error Loading Activities</h4>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="recent-activities" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Recent Activities</h3>
          <p className="text-sm text-gray-600 mt-1">Latest user actions and events</p>
        </div>
        <div data-testid="activities-count" className="bg-indigo-50 px-4 py-2 rounded-lg">
          <span className="text-xs text-indigo-600 block">Total</span>
          <span className="text-2xl font-bold text-indigo-900">{activities.length}</span>
        </div>
      </div>
      
      <div data-testid="activities-list" className="space-y-3">
        {activities.map(activity => (
          <div 
            key={activity.id} 
            data-testid={`activity-${activity.id}`}
            className={`flex items-center gap-4 p-4 rounded-lg border ${getActivityColor(activity.type)} hover:shadow-md transition-all`}
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">
                <span className="user">{activity.user}</span>
                <span className="action text-gray-600"> - {activity.action}</span>
              </p>
              <p className="text-sm time text-gray-500">{activity.time}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
              activity.type === 'login' ? 'bg-blue-100 text-blue-700' :
              activity.type === 'update' ? 'bg-yellow-100 text-yellow-700' :
              activity.type === 'create' ? 'bg-green-100 text-green-700' :
              activity.type === 'delete' ? 'bg-red-100 text-red-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {activity.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


const PendingApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadApprovals = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchPendingApprovals();

        setApprovals(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadApprovals();
    

  }, []);

  const getApprovalIcon = (type) => {
    const icons = {
      registration: '👤',
      content: '📄',
      profile: '✏️'
    };
    return icons[type] || '📋';
  };

  if (loading) {
    return (
      <div data-testid="approvals-loading" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600 font-medium">Loading approvals...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="approvals-error" className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-medium text-red-800">Error Loading Approvals</h4>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="pending-approvals" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Pending Approvals</h3>
          <p className="text-sm text-gray-600 mt-1">Items awaiting review and approval</p>
        </div>
        <div data-testid="approvals-count" className="bg-yellow-50 px-4 py-2 rounded-lg">
          <span className="text-xs text-yellow-600 block">Pending</span>
          <span className="text-2xl font-bold text-yellow-900">{approvals.length}</span>
        </div>
      </div>
      
      <div data-testid="approvals-list" className="space-y-3">
        {approvals.map(approval => (
          <div 
            key={approval.id} 
            data-testid={`approval-${approval.id}`}
            className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
              {getApprovalIcon(approval.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="title font-medium text-gray-900">{approval.title}</p>
              <p className="text-sm text-gray-500 capitalize">{approval.type}</p>
            </div>
            <span className="status px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              {approval.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


const UserStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchUserStats();

        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    

  }, []);

  if (loading) {
    return (
      <div data-testid="stats-loading" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600 font-medium">Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="stats-error" className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-medium text-red-800">Error Loading Statistics</h4>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="user-stats" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">User Statistics</h3>
        <p className="text-sm text-gray-600 mt-1">Overview of user metrics and activity</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div data-testid="total-users" className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-indigo-600">Total Users</span>
          </div>
          <p className="text-4xl font-bold text-indigo-900">{stats?.totalUsers.toLocaleString() || 0}</p>
        </div>
        
        <div data-testid="active-users" className="bg-green-50 rounded-lg p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600">Active Users</span>
          </div>
          <p className="text-4xl font-bold text-green-900">{stats?.activeUsers || 0}</p>
        </div>
        
        <div data-testid="new-signups" className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-blue-600">New Signups</span>
          </div>
          <p className="text-4xl font-bold text-blue-900">{stats?.newSignups || 0}</p>
        </div>
      </div>
    </div>
  );
};


const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'activities', label: 'Recent Activities', icon: <BarChart size={22} /> },
    { id: 'approvals', label: 'Pending Approvals', icon: <ListCheckIcon size={22} /> },
    { id: 'stats', label: 'User Stats', icon: <BarChart size={22} /> }
  ];

  return (
    <div data-testid="tab-navigation" className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-6">
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            data-testid={`tab-${tab.id}`}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md active'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};


const MainPanel = () => {
  const [activeTab, setActiveTab] = useState('activities');

  return (
    <div data-testid="main-panel" className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Switch between tabs to view different data sections</p>
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div data-testid="tab-content">
        {activeTab === 'activities' && <RecentActivities />}
        {activeTab === 'approvals' && <PendingApprovals />}
        {activeTab === 'stats' && <UserStats />}
      </div>
    </div>
  );
};


const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboardIcon size={22} /> },
    { name: 'Users', icon: <User size={22} /> },
    { name: 'Settings', icon: <Settings size={22} /> }
  ];

  return (
    <div data-testid="sidebar" className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Debug Challenge #5</p>
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
              placeholder="Search dashboard..." 
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


export const AdminDashboardD = () => {
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


export { RecentActivities, PendingApprovals, UserStats, MainPanel, TabNavigation };