import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StudentDetail from './components/StudentDetail';
import Login from './components/Login';
import AdminManagement from './components/AdminManagement';
import ChangePassword from './components/ChangePassword';

const ProtectedRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const NavBar = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  if (!userInfo) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex flex-col">
              <span className="text-xl font-black text-indigo-600 tracking-tighter leading-none">LEET</span>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest leading-none">TRACKER</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">Dashboard</Link>
              {userInfo.role === 'superadmin' && (
                <Link to="/admin-management" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">Teams</Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-gray-900 leading-none">{userInfo.username}</span>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{userInfo.role}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="font-sans antialiased text-gray-900 bg-gray-50/50 min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
        <NavBar />
        
        <main className="py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/:id" element={
              <ProtectedRoute>
                <StudentDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin-management" element={
              <ProtectedRoute>
                <AdminManagement />
              </ProtectedRoute>
            } />
            <Route path="/change-password" element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
