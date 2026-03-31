import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getStudents } from '../api';
import { ExternalLink, UserPlus, Trophy, Users, Award } from 'lucide-react';
import AddStudentModal from './AddStudentModal';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents();
      setStudents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch student data');
      setLoading(false);
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading && students.length === 0) {
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
          onClick={() => fetchStudents()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
              <Trophy className="mr-3 text-yellow-500 h-10 w-10" />
              Student Leaderboard
            </h1>
            <p className="mt-2 text-lg text-gray-500 font-medium">Monitoring real-time LeetCode performance.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all transform hover:scale-105 active:scale-95"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Add New Student
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Total Students</p>
              <p className="text-3xl font-black text-gray-900">{students.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Top Scorer</p>
              <p className="text-xl font-bold text-gray-900">
                {students.length > 0 ? students.sort((a, b) => (b.latestStats?.totalSolved || 0) - (a.latestStats?.totalSolved || 0))[0].name : 'N/A'}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Trophy className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Avg Solved</p>
              <p className="text-3xl font-black text-gray-900">
                {students.length > 0 ? Math.round(students.reduce((acc, s) => acc + (s.latestStats?.totalSolved || 0), 0) / students.length) : 0}
              </p>
            </div>
          </div>
        </div>
        
        {/* Leaderboard Table */}
        <div className="bg-white shadow-xl overflow-hidden rounded-3xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Rank</th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Student</th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Roll No</th>
                  <th scope="col" className="px-6 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Total Solved</th>
                  <th scope="col" className="px-4 py-5 text-center text-xs font-bold text-green-600 uppercase tracking-widest">Easy</th>
                  <th scope="col" className="px-4 py-5 text-center text-xs font-bold text-yellow-600 uppercase tracking-widest">Medium</th>
                  <th scope="col" className="px-4 py-5 text-center text-xs font-bold text-red-600 uppercase tracking-widest">Hard</th>
                  <th scope="col" className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {students
                  .sort((a, b) => (b.latestStats?.totalSolved || 0) - (a.latestStats?.totalSolved || 0))
                  .map((student, index) => {
                  const stats = student.latestStats || { totalSolved: 0, easy: 0, medium: 0, hard: 0 };
                  
                  return (
                    <tr key={student._id} className="hover:bg-indigo-50/30 transition-all duration-300">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-black ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                          index === 1 ? 'bg-gray-100 text-gray-700' : 
                          index === 2 ? 'bg-orange-100 text-orange-700' : 'text-gray-400'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-base font-bold text-gray-900 leading-none">{student.name}</div>
                            <div className="text-xs text-indigo-500 font-medium mt-1">@{student.leetcodeUsername}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-500">
                        {student.rollNo}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-lg font-black italic">
                          {stats.totalSolved}
                        </span>
                      </td>
                      <td className="px-4 py-6 whitespace-nowrap text-center text-sm text-green-600 font-black">
                        {stats.easy}
                      </td>
                      <td className="px-4 py-6 whitespace-nowrap text-center text-sm text-yellow-600 font-black">
                        {stats.medium}
                      </td>
                      <td className="px-4 py-6 whitespace-nowrap text-center text-sm text-red-600 font-black">
                        {stats.hard}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right">
                        <Link 
                          to={`/student/${student._id}`} 
                          className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-bold rounded-xl text-indigo-600 bg-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-sm transition-all duration-300"
                        >
                          Details 
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <Users className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-xl font-bold text-gray-400">No students yet</p>
                        <p className="text-sm text-gray-400 mt-2">Click the button above to add your first student.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
