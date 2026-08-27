import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, getDeletedStudents, restoreStudent, permanentDeleteStudent, deleteStudent } from '../api';
import { 
  ExternalLink, 
  UserPlus, 
  Trophy, 
  Users, 
  Award, 
  Filter, 
  Building2, 
  Calendar, 
  Eye, 
  Trash2, 
  RotateCcw, 
  ShieldAlert, 
  AlertTriangle, 
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import AddStudentModal from './AddStudentModal';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [deletedStudents, setDeletedStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'trash'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isGuest = userInfo?.role === 'guest';
  const isSuperAdmin = userInfo?.role === 'superadmin';
  const isAdminOrSuper = userInfo?.role === 'admin' || userInfo?.role === 'superadmin';

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await getStudents();
      setStudents(res.data);

      if (isSuperAdmin) {
        try {
          const delRes = await getDeletedStudents();
          setDeletedStudents(delRes.data);
        } catch (e) {
          console.error("Could not fetch deleted students:", e);
        }
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch student data");
      setLoading(false);
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const showNotification = (msg, isError = false) => {
    setActionMessage({ text: msg, isError });
    setTimeout(() => {
      setActionMessage(null);
    }, 4000);
  };

  const handleSoftDelete = async (studentId, studentName) => {
    if (isGuest) return;
    if (!window.confirm(`Move ${studentName} to Trash? Their complete history will be safely preserved.`)) {
      return;
    }

    try {
      setActionLoadingId(studentId);
      await deleteStudent(studentId);
      showNotification(`${studentName} moved to Trash successfully.`);
      await fetchStudents();
    } catch (err) {
      showNotification(err.response?.data?.error || err.response?.data?.message || 'Failed to move student to trash.', true);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRestore = async (studentId, studentName) => {
    if (!isSuperAdmin) return;
    try {
      setActionLoadingId(studentId);
      await restoreStudent(studentId);
      showNotification(`Successfully restored ${studentName} to active leaderboard!`);
      await fetchStudents();
    } catch (err) {
      showNotification(err.response?.data?.error || err.response?.data?.message || 'Failed to restore student.', true);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePermanentDelete = async (studentId, studentName) => {
    if (!isSuperAdmin) return;
    if (!window.confirm(`⚠️ PERMANENT DELETION WARNING:\nAre you sure you want to PERMANENTLY delete ${studentName}? This action cannot be undone and all data will be erased.`)) {
      return;
    }

    try {
      setActionLoadingId(studentId);
      await permanentDeleteStudent(studentId);
      showNotification(`${studentName} has been permanently deleted.`, false);
      await fetchStudents();
    } catch (err) {
      showNotification(err.response?.data?.error || err.response?.data?.message || 'Failed to permanently delete student.', true);
    } finally {
      setActionLoadingId(null);
    }
  };

  const currentList = activeTab === 'active' ? students : deletedStudents;

  const departments = ['All', ...new Set(currentList.map(s => s.dept).filter(Boolean).sort())];
  const years = ['All', ...new Set(currentList.map(s => s.year).filter(Boolean).sort())];

  const filteredStudents = currentList.filter(s => {
    const deptMatch = filterDept === 'All' || s.dept === filterDept;
    const yearMatch = filterYear === 'All' || s.year === filterYear;
    const searchMatch = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.leetcodeUsername && s.leetcodeUsername.toLowerCase().includes(searchQuery.toLowerCase()));
    return deptMatch && yearMatch && searchMatch;
  });

  if (loading && students.length === 0 && deletedStudents.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && students.length === 0) {
    return (
      <div className="flex justify-center flex-col items-center h-screen bg-gray-50 text-red-600">
        <p className="text-xl font-semibold">{error}</p>
        <button 
          onClick={fetchStudents}
          className="mt-4 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Notification Toast */}
        {actionMessage && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center space-x-3 shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${
            actionMessage.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            {actionMessage.isError ? <XCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm font-bold">{actionMessage.text}</span>
          </div>
        )}

        {/* Guest Mode Banner */}
        {isGuest && (
          <div className="mb-6 p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-emerald-900">Guest Mode (Read-Only)</h4>
                <p className="text-xs text-emerald-700 font-medium">You are viewing real-time student performance. Adding, editing, and deleting records are restricted.</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex px-3 py-1 bg-emerald-200/60 text-emerald-800 text-[11px] font-black rounded-lg uppercase tracking-wider">
              View Only
            </span>
          </div>
        )}
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center">
              <Trophy className="mr-3 text-yellow-500 h-8 w-8 md:h-12 md:w-12 drop-shadow-sm" />
              Leaderboard
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold uppercase tracking-wider">
              Real-time LeetCode Performance Tracking
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            {!isGuest && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-sm font-black rounded-2xl shadow-xl shadow-indigo-100 text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </button>
            )}
          </div>
        </div>

        {/* SuperAdmin Tabs: Active vs Trash */}
        {isSuperAdmin && (
          <div className="flex items-center space-x-2 mb-8 bg-gray-100/80 p-1.5 rounded-2xl w-max">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-white text-indigo-600 shadow-md shadow-gray-200/50'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Active Students</span>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px]">
                {students.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('trash')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'trash'
                  ? 'bg-white text-red-600 shadow-md shadow-gray-200/50'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Trash / Archive</span>
              {deletedStudents.length > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px]">
                  {deletedStudents.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Trash Notice Banner for SuperAdmin */}
        {activeTab === 'trash' && (
          <div className="mb-8 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-2xl flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-900">Trash & Recovery Vault</h3>
                <p className="text-xs text-amber-800 font-medium mt-0.5">
                  Deleted students retain their full historical data. As a Super Admin, you can recover them anytime or permanently erase them from the database.
                </p>
              </div>
            </div>
            <span className="px-3.5 py-1.5 bg-amber-200 text-amber-900 text-xs font-black rounded-xl uppercase tracking-wider self-end sm:self-center">
              Super Admin Vault
            </span>
          </div>
        )}

        {/* Stats Overview (Active tab only) */}
        {activeTab === 'active' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-indigo-50 rounded-2xl">
                <Users className="h-7 w-7 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Students</p>
                <p className="text-3xl font-black text-gray-900">{students.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-emerald-50 rounded-2xl">
                <Award className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Top Scorer</p>
                <p className="text-lg font-black text-gray-900 truncate max-w-[200px]">
                  {students.length > 0 ? [...students].sort((a, b) => (b.latestStats?.totalSolved || 0) - (a.latestStats?.totalSolved || 0))[0]?.name : 'N/A'}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-purple-50 rounded-2xl">
                <Trophy className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Avg Solved</p>
                <p className="text-3xl font-black text-gray-900">
                  {students.length > 0 ? Math.round(students.reduce((acc, s) => acc + (s.latestStats?.totalSolved || 0), 0) / students.length) : 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters, Search & Counter */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="flex items-center bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 flex-1 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Search className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, roll no, or username..."
                className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none w-full placeholder-gray-400"
              />
            </div>

            {/* Department Filter */}
            <div className="flex items-center bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Filter className="h-4 w-4 text-indigo-400 mr-2" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Dept</span>
              <select 
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none cursor-pointer pr-4"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            {/* Year Filter */}
            <div className="flex items-center bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Calendar className="h-4 w-4 text-indigo-400 mr-2" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Year</span>
              <select 
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none cursor-pointer pr-4"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-gray-400 font-bold uppercase tracking-widest bg-gray-100/80 px-4 py-2.5 rounded-2xl self-start lg:self-center">
            {filteredStudents.length} {activeTab === 'active' ? 'Active Students' : 'Deleted Records'}
          </div>
        </div>
        
        {/* Leaderboard Table (Desktop) & Cards (Mobile) */}
        <div className="bg-white shadow-xl shadow-gray-100/70 overflow-hidden rounded-3xl border border-gray-100">
          
          {/* Active Students View */}
          {activeTab === 'active' && (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th scope="col" className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Rank</th>
                      <th scope="col" className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Student</th>
                      <th scope="col" className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Roll No</th>
                      <th scope="col" className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Dept</th>
                      <th scope="col" className="px-6 py-5 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Total</th>
                      <th scope="col" className="px-4 py-5 text-center text-xs font-black text-emerald-600 uppercase tracking-widest">Easy</th>
                      <th scope="col" className="px-4 py-5 text-center text-xs font-black text-amber-500 uppercase tracking-widest">Medium</th>
                      <th scope="col" className="px-4 py-5 text-center text-xs font-black text-rose-600 uppercase tracking-widest">Hard</th>
                      <th scope="col" className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {filteredStudents
                      .sort((a, b) => (b.latestStats?.totalSolved || 0) - (a.latestStats?.totalSolved || 0))
                      .map((student, index) => {
                      const stats = student.latestStats || { totalSolved: 0, easy: 0, medium: 0, hard: 0 };
                      const isActing = actionLoadingId === student._id;
                      
                      return (
                        <tr key={student._id} className="hover:bg-indigo-50/20 transition-all duration-200 group">
                          <td className="px-8 py-5 whitespace-nowrap">
                            <span className={`inline-flex items-center justify-center h-8 w-8 rounded-2xl text-xs font-black border ${
                              index === 0 ? 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm' : 
                              index === 1 ? 'bg-gray-100 text-gray-700 border-gray-300' : 
                              index === 2 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'text-gray-400 border-transparent'
                            }`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-11 w-11 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-sm group-hover:scale-105 transition-transform">
                                {student.name.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-black text-gray-900 leading-tight">{student.name}</div>
                                <a 
                                  href={`https://leetcode.com/${student.leetcodeUsername}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-indigo-500 font-bold mt-1 flex items-center hover:underline"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  {student.leetcodeUsername}
                                </a>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-500">
                            {student.rollNo}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-wider">
                              {student.dept || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            <span className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-base font-black italic">
                              {stats.totalSolved}
                            </span>
                          </td>
                          <td className="px-4 py-5 whitespace-nowrap text-center text-sm text-emerald-600 font-black">
                            {stats.easy}
                          </td>
                          <td className="px-4 py-5 whitespace-nowrap text-center text-sm text-amber-500 font-black">
                            {stats.medium}
                          </td>
                          <td className="px-4 py-5 whitespace-nowrap text-center text-sm text-rose-600 font-black">
                            {stats.hard}
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap text-right space-x-2">
                            <Link 
                              to={`/student/${student._id}`} 
                              className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-black rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow-indigo-100 transition-all active:scale-95"
                            >
                              Details
                            </Link>
                            {isAdminOrSuper && (
                              <button
                                onClick={() => handleSoftDelete(student._id, student.name)}
                                disabled={isActing}
                                title="Move to Trash"
                                className="inline-flex items-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4 bg-gray-50/50">
                {filteredStudents
                  .sort((a, b) => (b.latestStats?.totalSolved || 0) - (a.latestStats?.totalSolved || 0))
                  .map((student, index) => {
                  const stats = student.latestStats || { totalSolved: 0, easy: 0, medium: 0, hard: 0 };
                  
                  return (
                    <div key={student._id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className={`flex items-center justify-center h-6 w-6 rounded-full text-[10px] font-black ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                            index === 1 ? 'bg-gray-100 text-gray-700' : 
                            index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-400'
                          }`}>
                            {index + 1}
                          </span>
                          <div className="h-10 w-10 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700 font-black">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-black text-gray-900 leading-tight">{student.name}</h3>
                            <p className="text-[10px] text-indigo-500 font-bold">@{student.leetcodeUsername}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-indigo-600 leading-none italic">{stats.totalSolved}</div>
                          <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Solved</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-50 text-center">
                        <div>
                          <div className="text-xs font-black text-emerald-600">{stats.easy}</div>
                          <div className="text-[8px] font-bold text-gray-400 uppercase">Easy</div>
                        </div>
                        <div>
                          <div className="text-xs font-black text-amber-500">{stats.medium}</div>
                          <div className="text-[8px] font-bold text-gray-400 uppercase">Med</div>
                        </div>
                        <div>
                          <div className="text-xs font-black text-rose-600">{stats.hard}</div>
                          <div className="text-[8px] font-bold text-gray-400 uppercase">Hard</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[9px] font-bold uppercase">{student.dept || 'N/A'}</span>
                          <span className="text-[11px] text-gray-400 font-bold">{student.rollNo}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isAdminOrSuper && (
                            <button
                              onClick={() => handleSoftDelete(student._id, student.name)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          <Link 
                            to={`/student/${student._id}`} 
                            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Super Admin Trash / Recovery View */}
          {activeTab === 'trash' && isSuperAdmin && (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-amber-50/40">
                    <tr>
                      <th scope="col" className="px-8 py-5 text-left text-xs font-black text-amber-900/60 uppercase tracking-widest">Student</th>
                      <th scope="col" className="px-6 py-5 text-left text-xs font-black text-amber-900/60 uppercase tracking-widest">Roll No</th>
                      <th scope="col" className="px-6 py-5 text-left text-xs font-black text-amber-900/60 uppercase tracking-widest">Dept / Year</th>
                      <th scope="col" className="px-6 py-5 text-center text-xs font-black text-amber-900/60 uppercase tracking-widest">Solved History</th>
                      <th scope="col" className="px-6 py-5 text-left text-xs font-black text-amber-900/60 uppercase tracking-widest">Deleted When & By</th>
                      <th scope="col" className="px-8 py-5 text-right text-xs font-black text-amber-900/60 uppercase tracking-widest">Vault Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {filteredStudents.map((student) => {
                      const stats = student.latestStats || { totalSolved: 0, easy: 0, medium: 0, hard: 0 };
                      const isActing = actionLoadingId === student._id;

                      return (
                        <tr key={student._id} className="hover:bg-amber-50/20 transition-all duration-200 group">
                          <td className="px-8 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-11 w-11 flex-shrink-0 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-600 font-black text-base">
                                {student.name.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-black text-gray-900 leading-tight">{student.name}</div>
                                <div className="text-xs text-gray-400 font-bold mt-0.5">@{student.leetcodeUsername}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-500">
                            {student.rollNo}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-xs font-bold text-gray-700">{student.dept}</div>
                            <div className="text-[10px] font-bold text-gray-400">Year {student.year}</div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-xl text-sm font-black">
                              {stats.totalSolved} Solved
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-xs font-bold text-gray-500">
                            <div>{student.deletedAt ? new Date(student.deletedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown date'}</div>
                            <div className="text-[10px] text-amber-700 font-black">by @{student.deletedBy || 'admin'}</div>
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap text-right space-x-2">
                            <button
                              onClick={() => handleRestore(student._id, student.name)}
                              disabled={isActing}
                              className="inline-flex items-center px-3.5 py-2 border border-emerald-200 text-xs font-black rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition active:scale-95 cursor-pointer shadow-sm"
                              title="Restore student back to active leaderboard"
                            >
                              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                              Recover
                            </button>
                            <button
                              onClick={() => handlePermanentDelete(student._id, student.name)}
                              disabled={isActing}
                              className="inline-flex items-center px-3.5 py-2 border border-red-200 text-xs font-black rounded-xl text-red-700 bg-red-50 hover:bg-red-100 transition active:scale-95 cursor-pointer shadow-sm"
                              title="Permanently remove from database"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                              Delete Forever
                            </button>
                            <Link 
                              to={`/student/${student._id}`} 
                              className="inline-flex items-center p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                              title="View full historical analytics"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Trash Cards */}
              <div className="md:hidden space-y-4 p-4 bg-gray-50/50">
                {filteredStudents.map((student) => (
                  <div key={student._id} className="bg-white rounded-3xl p-5 shadow-sm border border-amber-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-black text-gray-900 leading-tight">{student.name}</h3>
                        <p className="text-[11px] text-gray-400 font-bold">Roll: {student.rollNo} • {student.dept}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-[10px] font-black rounded-lg">
                        In Trash
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 font-medium pb-2 border-b border-gray-50">
                      Deleted: {student.deletedAt ? new Date(student.deletedAt).toLocaleDateString() : ''} by @{student.deletedBy || 'admin'}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => handleRestore(student._id, student.name)}
                        className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black hover:bg-emerald-100 transition text-center flex items-center justify-center space-x-1"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Recover</span>
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(student._id, student.name)}
                        className="flex-1 py-2.5 bg-red-50 text-red-700 rounded-xl text-xs font-black hover:bg-red-100 transition text-center flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Erase</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <div className="px-6 py-20 text-center">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gray-50 rounded-3xl mb-4">
                  {activeTab === 'active' ? (
                    <Users className="h-12 w-12 text-gray-300" />
                  ) : (
                    <Trash2 className="h-12 w-12 text-gray-300" />
                  )}
                </div>
                <p className="text-lg font-black text-gray-600">
                  {activeTab === 'active' ? 'No active students found' : 'Trash vault is clean'}
                </p>
                <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-wider">
                  {activeTab === 'active' ? 'Try adjusting your search or filters' : 'No soft-deleted student records are currently pending recovery'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddStudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchStudents}
      />
    </div>
  );
};

export default Dashboard;
