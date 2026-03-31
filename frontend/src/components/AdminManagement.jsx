import React, { useState, useEffect } from 'react';
import { getAdmins, registerAdmin } from '../api';
import { useNavigate } from 'react-router-dom';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'superadmin') {
      navigate('/');
      return;
    }
    fetchAdmins();
  }, [navigate]);

  const fetchAdmins = async () => {
    try {
      const { data } = await getAdmins();
      setAdmins(data);
    } catch (err) {
      setError('Failed to fetch admins');
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await registerAdmin({ username, password, role });
      setSuccess(`Admin '${username}' added successfully!`);
      setUsername('');
      setPassword('');
      setRole('admin');
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Management</h1>
        <p className="mt-4 text-lg text-gray-600">Securely manage team access and permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Register Admin Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </span>
              Add New Admin
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border-l-4 border-red-500 animate-pulse">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-xl text-sm border-l-4 border-green-500">
                {success}
              </div>
            )}

            <form onSubmit={handleAddAdmin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  placeholder="admin_username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/30 hover:bg-indigo-700 transition-all active:scale-95 ${
                  loading ? 'opacity-70 disabled' : ''
                }`}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Admins List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Current Admins</h2>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                {admins.length} Total
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {admins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {admin.username[0].toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">{admin.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          admin.role === 'superadmin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                        }`}>
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {admins.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-10 text-center text-gray-500 italic">
                        No other admins found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
