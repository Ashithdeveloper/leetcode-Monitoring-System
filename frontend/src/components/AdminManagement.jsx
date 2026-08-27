import React, { useState, useEffect } from 'react';
import { getAdmins, registerAdmin } from '../api';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, UserPlus, Users, Key, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

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
  const isSuperAdmin = userInfo?.role === 'superadmin';

  useEffect(() => {
    if (!userInfo || (userInfo.role !== 'superadmin' && userInfo.role !== 'admin')) {
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
      console.error("Error fetching admins:", err);
      setError('Failed to fetch admin team');
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Ensure regular admins can never send superadmin role
    const assignedRole = isSuperAdmin ? role : 'admin';

    try {
      await registerAdmin({ username, password, role: assignedRole });
      setSuccess(`Admin '${username}' added successfully as ${assignedRole === 'superadmin' ? 'Super Admin' : 'Standard Admin'}!`);
      setUsername('');
      setPassword('');
      setRole('admin');
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to add admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Team Management</h1>
        <p className="mt-3 text-sm sm:text-base text-gray-500 font-medium max-w-xl mx-auto">
          Manage authorized administrators who oversee and track student progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Register Admin Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/80 p-8 border border-gray-100 sticky top-24">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Add New Admin</h2>
                <p className="text-xs text-gray-400 font-medium">Create system credentials</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-bold border border-red-100 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold border border-emerald-100 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleAddAdmin} className="space-y-5">
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 ml-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800 text-sm"
                  placeholder="e.g. prof_sharma"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800 text-sm"
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 ml-1">Role Permissions</label>
                {isSuperAdmin ? (
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl bg-white focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800 text-sm cursor-pointer"
                  >
                    <option value="admin">Standard Admin (Manage Students)</option>
                    <option value="superadmin">Super Admin (Full System Control)</option>
                  </select>
                ) : (
                  <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-bold text-gray-700">Standard Admin</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider bg-gray-200 px-2 py-0.5 rounded-md">Fixed</span>
                  </div>
                )}
                {!isSuperAdmin && (
                  <p className="text-[11px] text-gray-400 font-medium mt-1.5 ml-1">
                    Standard Admins can only provision new Standard Admin accounts.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Admin Account</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Admins List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/80 overflow-hidden border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Active Team Roster</h2>
              </div>
              <span className="px-3.5 py-1 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm">
                {admins.length} Total
              </span>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white border-b border-gray-100">
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Administrator</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Role</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {admins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-indigo-50/30 transition-all group">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-11 w-11 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm ${
                            admin.role === 'superadmin' 
                              ? 'bg-gradient-to-tr from-purple-600 to-indigo-600' 
                              : 'bg-gradient-to-tr from-indigo-500 to-blue-500'
                          }`}>
                            {admin.username[0]?.toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-black text-gray-900">{admin.username}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {admin.role === 'superadmin' ? 'Super Administrator' : 'Administrator'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          admin.role === 'superadmin' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          {admin.role === 'superadmin' && <ShieldAlert className="w-3 h-3 mr-1" />}
                          {admin.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right text-xs font-bold text-gray-500">
                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-3 bg-gray-50/50">
              {admins.map((admin) => (
                <div key={admin._id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white font-black ${
                      admin.role === 'superadmin' ? 'bg-purple-600' : 'bg-indigo-600'
                    }`}>
                      {admin.username[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-black text-gray-900">{admin.username}</div>
                      <div className="text-[10px] font-bold text-gray-400">
                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : ''}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                    admin.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {admin.role}
                  </span>
                </div>
              ))}
            </div>

            {admins.length === 0 && (
              <div className="px-6 py-16 text-center">
                <p className="text-gray-400 font-bold text-sm">No administrators found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
