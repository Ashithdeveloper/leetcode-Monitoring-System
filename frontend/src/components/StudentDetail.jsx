import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, ExternalLink } from 'lucide-react';
import api from '../api';

const StudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-200">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold leading-6 text-gray-900 flex items-center">
                <User className="mr-2 h-6 w-6 text-indigo-500" />
                {student.name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 flex items-center">
                Roll No: <span className="font-semibold text-gray-700 ml-1 mr-4">{student.rollNo}</span>
                Batch Year: <span className="font-semibold text-gray-700 ml-1">{student.year}</span>
              </p>
            </div>
            <div>
              <a 
                href={`https://leetcode.com/${student.leetcode.username}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                LeetCode Profile <ExternalLink className="ml-2 h-4 w-4 text-gray-500" />
              </a>
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
