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
        <div className="bg-white shadow-xl overflow-hidden rounded-3xl mb-8 border border-gray-100">
          <div className="px-6 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
              <div className="h-16 w-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                <User size={32} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                  {student.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-y-2 gap-x-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
                    <Hash size={14} className="mr-1.5 text-indigo-400" />
                    {student.rollNo}
                  </div>
                  <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
                    <Building2 size={14} className="mr-1.5 text-indigo-400" />
                    {student.dept || 'N/A'}
                  </div>
                  <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
                    <Calendar size={14} className="mr-1.5 text-indigo-400" />
                    {student.year}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col lg:flex-row gap-3 w-full md:w-auto">
              <a 
                href={`https://leetcode.com/${student.leetcode.username}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 md:flex-none inline-flex items-center justify-center px-5 py-3 border border-gray-200 shadow-sm text-sm font-bold rounded-2xl text-gray-700 bg-white hover:bg-gray-50 transition-all active:scale-95"
              >
                Profile <ExternalLink className="ml-2 h-4 w-4 text-gray-400" />
              </a>
              <button 
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 md:flex-none inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-bold rounded-2xl text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-100 transition-all active:scale-95 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="animate-spin h-4 w-4" />
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

        {/* 7-Day Performance Table */}
        <div className="bg-white shadow-sm overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg leading-6 font-semibold text-gray-900">
              7-Day Performance History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date Logged
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider font-bold">
                    Total Solved
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-green-600 uppercase tracking-wider">
                    Easy
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-yellow-600 uppercase tracking-wider">
                    Medium
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-red-600 uppercase tracking-wider">
                    Hard
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {student.history && student.history.length > 0 ? (
                  // Map through history array (newest to oldest or as retrieved)
                  // usually history is oldest to newest, let's reverse to show latest at top
                  [...student.history].reverse().map((entry, index) => {
                    const date = new Date(entry.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <tr key={entry._id || index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-800">
                          {entry.totalSolved}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600 font-medium">
                          {entry.easy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-yellow-600 font-medium">
                          {entry.medium}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-red-600 font-medium">
                          {entry.hard}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                      No performance history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
