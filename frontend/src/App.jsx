import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StudentDetail from './components/StudentDetail';

function App() {
  return (
    <Router>
      <div className="font-sans antialiased text-gray-900 bg-gray-50 min-h-screen">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">LeetTracker</span>
              </div>
            </div>
          </div>
        </nav>
        
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/student/:id" element={<StudentDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
