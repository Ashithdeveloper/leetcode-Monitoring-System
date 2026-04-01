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
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 sticky top-24">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Add Admin</h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black border-l-4 border-red-500 animate-in fade-in slide-in-from-left-2 duration-300">
                 {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl text-xs font-black border-l-4 border-green-500 animate-in fade-in slide-in-from-left-2 duration-300">
                {success}
              </div>
            )}

            <form onSubmit={handleAddAdmin} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700"
                  placeholder="e.g. alex_admin"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Access Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl bg-white focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-black text-gray-700 appearance-none cursor-pointer"
                >
                  <option value="admin">Standard Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center space-x-2 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Admins List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Active Team</h2>
              <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">
                {admins.length} Total
              </span>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Administrator</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Permissions</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Join Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {admins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-indigo-50/20 transition-all group">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-white group-hover:scale-110 transition-transform">
                            {admin.username[0].toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-base font-black text-gray-900">{admin.username}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase">System Identity</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          admin.role === 'superadmin' 
                          ? 'bg-purple-100 text-purple-700 shadow-sm' 
                          : 'bg-blue-100 text-blue-700 shadow-sm'
                        }`}>
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right text-xs font-black text-gray-500 italic">
                        {new Date(admin.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4 bg-gray-50/50">
              {admins.map((admin) => (
                <div key={admin._id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl">
                        {admin.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-lg font-black text-gray-900 leading-tight">{admin.username}</div>
                        <div className="text-[10px] font-black italic text-gray-400 mt-1 uppercase">Joined {new Date(admin.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                      admin.role === 'superadmin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                    }`}>
                      {admin.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {admins.length === 0 && (
              <div className="px-6 py-20 text-center">
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No administrators found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
