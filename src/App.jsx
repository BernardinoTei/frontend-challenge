import './App.css'
import React from 'react'
import './App.css'
import { useState } from 'react'
import { AdminDashboardA } from './challenges/debug-challenge-02-async-data'
import { AdminDashboardB } from './challenges/debug-challenge-03-double-submit'
import { AdminDashboardC } from './challenges/debug-challenge-04-race-condition'
import { AdminDashboardD } from './challenges/debug-challenge-05-unmount'
import { AdminDashboardE } from './challenges/debug-challenge-06-event-bubbling'
import { BrokenSubmitButton } from './challenges/debug-challenge-01-double-click'

function App() {
  const [activeTab, setActiveTab] = useState(0)

  const challenges = [
    { id: 0, title: 'Challenge 1: Double Click', component: <BrokenSubmitButton /> },
    { id: 1, title: 'Challenge 2: Async Data', component: <AdminDashboardA /> },
    { id: 2, title: 'Challenge 3: Double Submit', component: <AdminDashboardB /> },
    { id: 3, title: 'Challenge 4: Race Condition', component: <AdminDashboardC /> },
    { id: 4, title: 'Challenge 5: Unmount', component: <AdminDashboardD /> },
    { id: 5, title: 'Challenge 6: Event Bubbling', component: <AdminDashboardE /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <nav className="flex overflow-x-auto">
            {challenges.map((challenge) => (
              <button
                key={challenge.id}
                onClick={() => setActiveTab(challenge.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === challenge.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {challenge.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {challenges[activeTab].component}
      </div>
    </div>
  )
}

export default App