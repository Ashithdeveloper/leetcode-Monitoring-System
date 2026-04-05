import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, ExternalLink, Building2, Trash2, Loader2, Hash } from 'lucide-react';
import api, { deleteStudent } from '../api';
import { useNavigate } from 'react-router-dom';

const StudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/students/${id}`);
        setStudent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch student details. They might not exist.');
        setLoading(false);
        console.error("Error fetching student details:", err);
      }
    };
    fetchStudent();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this student? All history will be lost.')) {
      return;
    }

    try {
      setDeleting(true);
      await deleteStudent(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete student. You might not have permission.');
      setDeleting(false);
      console.error("Error deleting student:", err);
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
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Student Profile Card */}
        <div className="bg-white border border-gray-100 shadow-lg rounded-3xl p-6 md:p-8 mb-10">

          <div className="flex flex-col lg:flex-row justify-between gap-8">

            {/* LEFT SECTION */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">

              {/* Avatar */}
              <div className="h-20 w-20 md:h-24 md:w-24 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                <User size={42} strokeWidth={2.5} />
              </div>

              {/* Info */}
              <div className="space-y-3">

                {/* Name */}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {student.name}
                </h3>

                {/* Username */}
                <p className="text-indigo-500 font-semibold text-sm tracking-wide">
                  @{student.leetcode.username}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">

                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg text-xs font-semibold text-gray-600">
                    <Hash size={14} className="text-indigo-400" />
                    {student.rollNo}
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg text-xs font-semibold text-gray-600">
                    <Building2 size={14} className="text-indigo-400" />
                    {student.dept || "N/A"}
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg text-xs font-semibold text-gray-600">
                    <Calendar size={14} className="text-indigo-400" />
                    Year {student.year}
                  </div>

                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">

              {/* LeetCode Button */}
              <a
                href={`https://leetcode.com/${student.leetcode.username}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center px-6 py-3 rounded-xl border border-indigo-100 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
              >
                LeetCode
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center justify-center px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </button>

            </div>

          </div>
        </div>

        {/* 7-Day Performance History */}
        <div className="bg-white shadow-xl overflow-hidden rounded-3xl border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">
                7-Day performance
              </h3>
            </div>
            <div className="hidden sm:block text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Last 7 log points
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-white">
                <tr>
                  <th scope="col" className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                    Date Logged
                  </th>
                  <th scope="col" className="px-8 py-5 text-center text-xs font-black text-indigo-600 uppercase tracking-widest">
                    Total Solved
                  </th>
                  <th scope="col" className="px-8 py-5 text-center text-xs font-black text-green-600 uppercase tracking-widest">
                    Easy
                  </th>
                  <th scope="col" className="px-8 py-5 text-center text-xs font-black text-yellow-600 uppercase tracking-widest">
                    Medium
                  </th>
                  <th scope="col" className="px-8 py-5 text-center text-xs font-black text-red-600 uppercase tracking-widest">
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
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <tr key={entry._id || index} className="hover:bg-indigo-50/30 transition-all duration-300">
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-black text-gray-900">
                          {date}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-center">
                          <span className="px-4 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-lg font-black italic">
                            {entry.totalSolved}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-center text-sm text-green-600 font-black">
                          {entry.easy}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-center text-sm text-yellow-600 font-black">
                          {entry.medium}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-center text-sm text-red-600 font-black">
                          {entry.hard}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="p-4 bg-gray-50 rounded-3xl mb-4">
                          <Calendar className="h-10 w-10 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No activity records yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile History Cards */}
          <div className="md:hidden p-4 space-y-4 bg-gray-50/50">
            {student.history && student.history.length > 0 ? (
              [...student.history].reverse().map((entry, index) => {
                const date = new Date(entry.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={entry._id || index} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <div className="text-xs font-black text-gray-900">{date}</div>
                      <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-black italic">
                        {entry.totalSolved}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm font-black text-green-600">{entry.easy}</div>
                        <div className="text-[8px] font-black text-gray-400 uppercase">Easy</div>
                      </div>
                      <div>
                        <div className="text-sm font-black text-yellow-600">{entry.medium}</div>
                        <div className="text-[8px] font-black text-gray-400 uppercase">Medium</div>
                      </div>
                      <div>
                        <div className="text-sm font-black text-red-600">{entry.hard}</div>
                        <div className="text-[8px] font-black text-gray-400 uppercase">Hard</div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No activity records yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
