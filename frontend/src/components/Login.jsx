import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmins, loginGuest } from '../api';
import { Eye, Shield, Sparkles, FlaskConical, X, CheckCircle, Info } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('Devtesting');
  const [password, setPassword] = useState('123456789');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [showTestPopup, setShowTestPopup] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await loginAdmins(username, password);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setError('');

    try {
      const { data } = await loginGuest();
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      // Fallback in case of network issue - generate local guest session
      const guestSession = {
        _id: 'guest',
        username: 'Guest User',
        role: 'guest',
        mustChangePassword: false,
        token: 'guest_token',
      };
      localStorage.setItem('userInfo', JSON.stringify(guestSession));
      navigate('/');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 relative">
      
      {/* Testing Notice Pop-up Modal */}
      {showTestPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-indigo-100 relative transform transition-all animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowTestPopup(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition cursor-pointer"
              title="Close notice"
            >
              <X size={18} />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Testing Notice
                </span>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Application Demo Mode</h2>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-5 font-medium">
              This login account (<span className="font-black text-indigo-600">Devtesting</span>) is provided default for understanding and testing all features of the application.
            </p>

            <div className="bg-indigo-50/70 border border-indigo-100/80 rounded-2xl p-4 mb-6 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Testing Username:</span>
                <span className="font-mono font-black text-indigo-900 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-100">Devtesting</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Testing Password:</span>
                <span className="font-mono font-black text-indigo-900 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-100">123456789</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Access Level:</span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200 text-[11px]">Standard Admin</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowTestPopup(false)}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 active:scale-95 transition cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Proceed to Login</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Login Card */}
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 transform transition-all">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-indigo-50 rounded-2xl text-indigo-600 mb-3 shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            LeetTracker
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Student Performance & Leaderboard System</p>
        </div>

        {/* Informative Testing Banner on Card */}
        <div 
          onClick={() => setShowTestPopup(true)}
          className="mb-6 p-3 bg-indigo-50/90 hover:bg-indigo-100/90 border border-indigo-100 rounded-2xl flex items-center justify-between cursor-pointer transition active:scale-98 group"
          title="Click to view testing info"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-indigo-600 text-white rounded-xl">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-black text-indigo-900 leading-tight">Testing Mode Active</p>
              <p className="text-[10px] font-semibold text-indigo-600">Pre-filled credentials for testing</p>
            </div>
          </div>
          <span className="text-[10px] font-black text-indigo-700 bg-white px-2 py-1 rounded-lg border border-indigo-100 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white transition">
            Info
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl animate-pulse">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-semibold"
              placeholder="Enter admin username"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-semibold"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || guestLoading}
            className={`w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Admin Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400 font-bold tracking-wider">or</span>
          </div>
        </div>

        {/* Guest Login Section */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading || guestLoading}
            className="w-full py-3.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 shadow-sm hover:shadow active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {guestLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-emerald-700" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entering Guest Mode...
              </span>
            ) : (
              <>
                <Eye className="w-5 h-5 text-emerald-600" />
                <span>Continue as Guest (View Only)</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-400 font-medium text-center">
            <Shield className="w-3.5 h-3.5 text-gray-400" />
            <span>Read-only access to view leaderboards and metrics</span>
          </div>
        </div>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400">
            &copy; 2026 Student LeetCode Monitoring System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
