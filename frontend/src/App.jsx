import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StudentDetail from './components/StudentDetail';
import Login from './components/Login';
import AdminManagement from './components/AdminManagement';
import ChangePassword from './components/ChangePassword';
import { Menu, X, LayoutDashboard, Users as UsersIcon, Lock, LogOut, Trophy } from 'lucide-react';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    setIsMenuOpen(false);
  };

  if (!userInfo) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex flex-col group transition-transform active:scale-95" onClick={() => setIsMenuOpen(false)}>
              <span className="text-2xl font-black text-indigo-600 tracking-tighter leading-none group-hover:text-indigo-700">LEET</span>
              <span className="text-[12px] font-bold text-gray-400 tracking-[0.2em] leading-none group-hover:text-gray-500 transition-colors">TRACKER</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex items-center">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              {userInfo.role === 'superadmin' && (
                <>
                  <Link to="/admin-management" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex items-center">
                    <UsersIcon className="w-4 h-4 mr-2" />
                    Teams
                  </Link>
                  <Link to="/change-password" title="Change Password" className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                    <Lock className="w-5 h-5" />
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-black text-gray-900 leading-none">{userInfo.username}</span>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">{userInfo.role}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="hidden md:flex p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm hover:shadow-md"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all active:scale-90"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Backdrop */}
        <div className={`absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)} />
        
        {/* Drawer Content */}
        <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col border-l border-gray-100">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-black text-gray-900">{userInfo.username}</span>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{userInfo.role}</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-3 p-4 rounded-2xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-bold transition-all"
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            
            {userInfo.role === 'superadmin' && (
              <>
                <Link 
                  to="/admin-management" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 p-4 rounded-2xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-bold transition-all"
                >
                  <UsersIcon size={20} />
                  <span>Manage Teams</span>
                </Link>
                <Link 
                  to="/change-password" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 p-4 rounded-2xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-bold transition-all"
                >
                  <Lock size={20} />
                  <span>Security</span>
                </Link>
              </>
            )}
          </div>

          <div className="p-6 border-t border-gray-50">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-4 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition-all active:scale-95 shadow-sm"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
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
                {JSON.parse(localStorage.getItem('userInfo'))?.role === 'superadmin' ? (
                  <ChangePassword />
                ) : (
                  <Navigate to="/" replace />
                )}
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
