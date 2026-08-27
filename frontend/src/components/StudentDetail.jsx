import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, ExternalLink, Building2, Trash2, RotateCcw, Loader2, Hash, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import api, { deleteStudent, restoreStudent, permanentDeleteStudent } from '../api';

const StudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isGuest = userInfo?.role === 'guest';
  const isSuperAdmin = userInfo?.role === 'superadmin';
  const isAdminOrSuper = userInfo?.role === 'admin' || userInfo?.role === 'superadmin';

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/students/${id}`);
      setStudent(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch student details. They might not exist.');
      setLoading(false);
      console.error("Error fetching student details:", err);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const showToast = (msg, isErr = false) => {
    setNotification({ text: msg, isErr });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSoftDelete = async () => {
    if (isGuest) {
      alert('Guest accounts are in read-only mode and cannot delete students.');
      return;
    }

    if (!window.confirm('Move this student to Trash? Their complete history will be safely preserved and can be recovered by a Super Admin.')) {
      return;
    }

    try {
      setActionLoading(true);
      await deleteStudent(id);
      showToast('Student moved to Trash successfully.');
      await fetchStudent();
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || 'Failed to delete student.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!isSuperAdmin) return;
    try {
      setActionLoading(true);
      await restoreStudent(id);
      showToast('Student successfully restored to active status!');
      await fetchStudent();
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || 'Failed to restore student.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (!isSuperAdmin) return;
    if (!window.confirm('⚠️ PERMANENT DELETION:\nAre you sure you want to permanently erase this student and all history? This cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      await permanentDeleteStudent(id);
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || 'Failed to permanently delete student.', true);
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex justify-center flex-col items-center h-screen bg-gray-50 text-red-600">
        <p className="text-xl font-semibold">{error || "Student not found"}</p>
        <Link
          to="/"
          className="mt-4 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Action Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center space-x-3 shadow-md ${
            notification.isErr ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            <span className="text-sm font-bold">{notification.text}</span>
          </div>
        )}

        {/* Trash Status Banner */}
        {student.isDeleted && (
          <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-2xl mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-amber-900">Record in Trash Archive</h4>
                <p className="text-xs text-amber-800 font-medium mt-0.5">
                  Deleted on {student.deletedAt ? new Date(student.deletedAt).toLocaleString() : 'N/A'} by @{student.deletedBy || 'admin'}.
                  {isSuperAdmin ? ' You can restore this record or erase it permanently.' : ' Only Super Admins can recover or permanently erase this student.'}
                </p>
              </div>
            </div>
            {isSuperAdmin && (
              <div className="flex items-center space-x-2 self-end sm:self-center">
                <button
                  onClick={handleRestore}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Student</span>
                </button>
                <button
                  onClick={handlePermanentDelete}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Forever</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Student Profile Card */}
        <div className="bg-white border border-gray-100 shadow-xl shadow-gray-100/70 rounded-3xl p-6 md:p-8 mb-10">
          <div className="flex flex-col lg:flex-row justify-between gap-8">

            {/* LEFT SECTION */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              {/* Avatar */}
              <div className="h-20 w-20 md:h-24 md:w-24 flex items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md text-3xl font-black">
                {student.name.charAt(0)}
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                    {student.name}
                  </h2>
                  {student.isDeleted && (
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded-lg uppercase tracking-wider w-max self-center sm:self-auto">
                      Archived
                    </span>
                  )}
                </div>

                <p className="text-indigo-600 font-bold text-sm">
                  @{student.leetcode?.username}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 border border-gray-100">
                    <Hash size={14} className="text-indigo-400" />
                    <span>{student.rollNo}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 border border-gray-100">
                    <Building2 size={14} className="text-indigo-400" />
                    <span>{student.dept || "N/A"}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 border border-gray-100">
                    <Calendar size={14} className="text-indigo-400" />
                    <span>Year {student.year}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
              <a
                href={`https://leetcode.com/${student.leetcode?.username}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center px-6 py-3 rounded-2xl border border-indigo-200 text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition"
              >
                <span>LeetCode Profile</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>

              {/* Action Buttons */}
              {!student.isDeleted && isAdminOrSuper && (
                <button
                  onClick={handleSoftDelete}
                  disabled={actionLoading}
                  className="flex items-center justify-center px-6 py-3 rounded-2xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Move to Trash</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* 7-Day Performance History */}
        <div className="bg-white shadow-xl shadow-gray-100/70 overflow-hidden rounded-3xl border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                  Problem-Solving History Log
                </h3>
                <p className="text-xs text-gray-400 font-medium">Full historical snapshots</p>
              </div>
            </div>
            <div className="hidden sm:block text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-lg">
              {student.history ? student.history.length : 0} Records
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-white">
                <tr>
                  <th scope="col" className="px-8 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">
                    Timestamp
                  </th>
                  <th scope="col" className="px-8 py-4 text-center text-[11px] font-black text-indigo-600 uppercase tracking-widest">
                    Total Solved
                  </th>
                  <th scope="col" className="px-8 py-4 text-center text-[11px] font-black text-emerald-600 uppercase tracking-widest">
                    Easy
                  </th>
                  <th scope="col" className="px-8 py-4 text-center text-[11px] font-black text-amber-500 uppercase tracking-widest">
                    Medium
                  </th>
                  <th scope="col" className="px-8 py-4 text-center text-[11px] font-black text-rose-600 uppercase tracking-widest">
                    Hard
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {student.history && student.history.length > 0 ? (
                  [...student.history].reverse().map((entry, index) => {
                    const date = new Date(entry.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <tr key={entry._id || index} className="hover:bg-indigo-50/20 transition-all duration-200">
                        <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-gray-800">
                          {date}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-center">
                          <span className="px-3.5 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-base font-black italic">
                            {entry.totalSolved}
                          </span>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-center text-sm text-emerald-600 font-black">
                          {entry.easy}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-center text-sm text-amber-500 font-black">
                          {entry.medium}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-center text-sm text-rose-600 font-black">
                          {entry.hard}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <p className="text-gray-400 font-bold text-sm">No activity records yet</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile History Cards */}
          <div className="md:hidden p-4 space-y-3 bg-gray-50/50">
            {student.history && student.history.length > 0 ? (
              [...student.history].reverse().map((entry, index) => {
                const date = new Date(entry.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={entry._id || index} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <div className="text-xs font-bold text-gray-800">{date}</div>
                      <div className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black italic">
                        {entry.totalSolved} Solved
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs font-black text-emerald-600">{entry.easy}</div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase">Easy</div>
                      </div>
                      <div>
                        <div className="text-xs font-black text-amber-500">{entry.medium}</div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase">Medium</div>
                      </div>
                      <div>
                        <div className="text-xs font-black text-rose-600">{entry.hard}</div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase">Hard</div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-10 text-center">
                <p className="text-gray-400 font-bold text-xs">No activity records yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
