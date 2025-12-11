import React, { useState } from 'react';

export const BrokenSubmitButton = ({ onSubmit }) => {
  const [message, setMessage] = useState('');

  const handleClick = async () => {
    setMessage('Submitting...');
    
    try {
      await onSubmit();
      setMessage('Success!');
    } catch (error) {
      setMessage('Error!');
    }
  };

  const getStatusStyles = () => {
    if (message === 'Success!') {
      return 'bg-green-50 text-green-700 border-green-200';
    }
    if (message === 'Error!') {
      return 'bg-red-50 text-red-700 border-red-200';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const getStatusIcon = () => {
    if (message === 'Success!') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    if (message === 'Error!') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Debug Challenge: Double Click Prevention
            </h3>
            <p className="text-sm text-gray-600">
              Click the button below to test the submission functionality
            </p>
          </div>

          <button
            onClick={handleClick}
            data-testid="submit-button"
            className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            Submit
          
          </button>

          {message && (
            <div
              data-testid="status-message"
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${getStatusStyles()} transition-all duration-300`}
            >
              {getStatusIcon()}
              <span className="font-medium">{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};