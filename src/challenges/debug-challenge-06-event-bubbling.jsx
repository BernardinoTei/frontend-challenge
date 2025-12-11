import { Bell, LayoutDashboardIcon, ListCheckIcon, Settings, User } from 'lucide-react';
import React, { useState } from 'react';

// Mock approval data
const initialApprovals = [
  { 
    id: 1, 
    title: 'User Registration: john@example.com', 
    type: 'registration',
    details: 'New user wants to register with email john@example.com',
    submittedBy: 'System',
    submittedAt: '2024-01-15 10:30:00'
  },
  { 
    id: 2, 
    title: 'Content Submission: Blog Post', 
    type: 'content',
    details: 'User submitted a blog post about React best practices',
    submittedBy: 'Alice Johnson',
    submittedAt: '2024-01-15 11:45:00'
  },
  { 
    id: 3, 
    title: 'Profile Update: Jane Smith', 
    type: 'profile',
    details: 'User requested to update profile information and avatar',
    submittedBy: 'Jane Smith',
    submittedAt: '2024-01-15 14:20:00'
  }
];

// Modal Component for Approval Details
const ApprovalModal = ({ approval, onClose, onApprove, onReject }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleApprove = async (e) => {
    // BUG: Not stopping event propagation - click bubbles to modal backdrop and row
    setIsProcessing(true);
    setClickCount(prev => prev + 1);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    onApprove(approval.id);
    setIsProcessing(false);
  };

  const handleReject = async (e) => {
    // BUG: Not stopping event propagation
    setIsProcessing(true);
    setClickCount(prev => prev + 1);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    onReject(approval.id);
    setIsProcessing(false);
  };

  const handleModalContentClick = (e) => {
    // BUG: Not stopping propagation - clicks inside modal content bubble to backdrop
    setClickCount(prev => prev + 1);
  };

  const getTypeIcon = (type) => {
    const icons = {
      registration: '👤',
      content: '📄',
      profile: '✏️'
    };
    return icons[type] || '📋';
  };

  const getTypeColor = (type) => {
    const colors = {
      registration: 'bg-blue-50 text-blue-700 border-blue-200',
      content: 'bg-purple-50 text-purple-700 border-purple-200',
      profile: 'bg-green-50 text-green-700 border-green-200'
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div 
      className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn" 
      data-testid="modal-backdrop"
      onClick={onClose}  // BUG: This fires even when clicking inside modal content
    >
      <div 
        className="modal-content bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
        data-testid="modal-content"
        onClick={handleModalContentClick}  // BUG: This bubbles to backdrop
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${getTypeColor(approval.type)} border`}>
                  {getTypeIcon(approval.type)}
                </div>
                <div className="flex-1">
                  <h2 data-testid="modal-title" className="text-xl font-bold text-gray-900">
                    {approval.title}
                  </h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize mt-1 ${getTypeColor(approval.type)} border`}>
                    {approval.type}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body px-6 py-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">Details</p>
            <p data-testid="modal-details" className="text-gray-900">{approval.details}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-indigo-600">Submitted By</p>
              </div>
              <p data-testid="modal-submitted-by" className="text-indigo-900 font-semibold">{approval.submittedBy}</p>
            </div>

            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-amber-600">Submitted At</p>
              </div>
              <p data-testid="modal-submitted-at" className="text-amber-900 font-semibold">{approval.submittedAt}</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-xl" data-testid="modal-actions">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onClose}
              data-testid="modal-close-btn"
              className="close-btn px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            
            <button
              onClick={handleReject}
              disabled={isProcessing}
              data-testid="modal-reject-btn"
              className={`reject-btn px-6 py-2.5 rounded-lg font-medium transition-colors ${
                isProcessing
                  ? 'bg-red-300 text-red-100 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Reject'
              )}
            </button>
            
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              data-testid="modal-approve-btn"
              className={`approve-btn px-6 py-2.5 rounded-lg font-medium transition-colors ${
                isProcessing
                  ? 'bg-green-300 text-green-100 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Approve'
              )}
            </button>
          </div>
        </div>

        <div data-testid="modal-click-count" style={{ display: 'none' }}>
          {clickCount}
        </div>
      </div>
    </div>
  );
};

// Approval Row Component
const ApprovalRow = ({ approval, onClick }) => {
  const [clickCount, setClickCount] = useState(0);

  const handleRowClick = (e) => {
    // BUG: Row click fires even when clicking buttons or links inside
    setClickCount(prev => prev + 1);
    onClick(approval);
  };

  const getTypeIcon = (type) => {
    const icons = {
      registration: '👤',
      content: '📄',
      profile: '✏️'
    };
    return icons[type] || '📋';
  };

  const getTypeColor = (type) => {
    const colors = {
      registration: 'bg-blue-50 border-blue-200',
      content: 'bg-purple-50 border-purple-200',
      profile: 'bg-green-50 border-green-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div 
      className="approval-row bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer" 
      data-testid={`approval-row-${approval.id}`}
      onClick={handleRowClick}  // BUG: This catches all clicks, even from children
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 ${getTypeColor(approval.type)} border`}>
            {getTypeIcon(approval.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div data-testid={`approval-title-${approval.id}`} className="font-medium text-gray-900 truncate mb-1">
              {approval.title}
            </div>
            <div data-testid={`approval-type-${approval.id}`} className="text-sm text-gray-600 capitalize">
              Type: {approval.type}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            data-testid={`quick-approve-${approval.id}`}
            className="quick-approve-btn px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            // BUG: No stopPropagation - clicking this also triggers row click
          >
            Quick Approve
          </button>

          <a 
            href="#details" 
            data-testid={`details-link-${approval.id}`}
            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors"
            // BUG: Clicking link triggers row click too
          >
            View Details
          </a>
        </div>
      </div>

      <div data-testid={`row-click-count-${approval.id}`} style={{ display: 'none' }}>
        {clickCount}
      </div>
    </div>
  );
};

// PendingApprovals Component
export const PendingApprovals = () => {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [modalOpenCount, setModalOpenCount] = useState(0);
  const [backdropClickCount, setBackdropClickCount] = useState(0);

  const handleRowClick = (approval) => {
    setSelectedApproval(approval);
    setModalOpenCount(prev => prev + 1);
  };

  const handleCloseModal = () => {
    setBackdropClickCount(prev => prev + 1);
    setSelectedApproval(null);
  };

  const handleApprove = (approvalId) => {
    setApprovals(prev => prev.map(a => 
      a.id === approvalId ? { ...a, status: 'approved' } : a
    ));
    setSelectedApproval(null);
  };

  const handleReject = (approvalId) => {
    setApprovals(prev => prev.map(a => 
      a.id === approvalId ? { ...a, status: 'rejected' } : a
    ));
    setSelectedApproval(null);
  };

  return (
    <div data-testid="pending-approvals" className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">Pending Approvals</h3>
          <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
            <span className="text-xs text-yellow-600 block">Pending</span>
            <span className="text-2xl font-bold text-yellow-900">{approvals.length}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">Click on any row to view details and take action</p>
      </div>
      
      <div data-testid="modal-open-count" style={{ display: 'none' }}>
        {modalOpenCount}
      </div>
      
      <div data-testid="backdrop-click-count" style={{ display: 'none' }}>
        {backdropClickCount}
      </div>

      <div data-testid="approvals-list" className="space-y-3">
        {approvals.map(approval => (
          <ApprovalRow
            key={approval.id}
            approval={approval}
            onClick={handleRowClick}
          />
        ))}
      </div>

      {selectedApproval && (
        <ApprovalModal
          approval={selectedApproval}
          onClose={handleCloseModal}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

// Sidebar Component
const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Approvals');
  
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboardIcon size={22} /> },
    { name: 'Approvals', icon: <ListCheckIcon size={22} /> },
    { name: 'Settings', icon: <Settings size={22} /> }
  ];

  return (
    <div data-testid="sidebar" className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Debug Challenge #6</p>
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

// MainPanel Component
const MainPanel = () => {
  return (
    <div data-testid="main-panel" className="flex-1 p-6">
      <PendingApprovals />
    </div>
  );
};

// Main AdminDashboard Component
export const AdminDashboardE = () => {
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
export { ApprovalModal, ApprovalRow, MainPanel };