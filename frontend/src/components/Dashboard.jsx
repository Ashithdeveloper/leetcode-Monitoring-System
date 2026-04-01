import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getStudents } from '../api';
import { ExternalLink, UserPlus, Trophy, Users, Award, Filter, Building2, Calendar } from 'lucide-react';
import AddStudentModal from './AddStudentModal';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDept, setFilterDept] = useState('All');
  const [filterYear, setFilterYear] = useState('All');

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

  const departments = ['All', ...new Set(students.map(s => s.dept).filter(Boolean).sort())];
  const years = ['All', ...new Set(students.map(s => s.year).filter(Boolean).sort())];

  const filteredStudents = students.filter(s => {
    const deptMatch = filterDept === 'All' || s.dept === filterDept;
    const yearMatch = filterYear === 'All' || s.year === filterYear;
    return deptMatch && yearMatch;
  });

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center">
              <Trophy className="mr-3 text-yellow-500 h-8 w-8 md:h-12 md:w-12 drop-shadow-sm" />
              Leaderboard
            </h1>
            <p className="text-sm md:text-lg text-gray-500 font-bold uppercase tracking-widest">Real-time Performance Tracking</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-black rounded-2xl shadow-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Add New Student
          </button>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex-1 md:flex-none focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Filter className="h-4 w-4 text-indigo-400 mr-2" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Dept</span>
              <select 
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none cursor-pointer appearance-none pr-4 w-full"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex-1 md:flex-none focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Calendar className="h-4 w-4 text-indigo-400 mr-2" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Year</span>
              <select 
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none cursor-pointer appearance-none pr-4 w-full"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-widest bg-gray-100/50 px-4 py-2 rounded-full self-center">
            {filteredStudents.length} Students found
          </div>
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
        
        {/* Leaderboard Table (Desktop) & Cards (Mobile) */}
        <div className="bg-white md:shadow-xl overflow-hidden rounded-3xl md:border border-gray-200">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th scope="col" className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Rank</th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Student</th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Roll No</th>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Dept</th>
                  <th scope="col" className="px-6 py-5 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Total</th>
                  <th scope="col" className="px-4 py-5 text-center text-xs font-black text-green-600 uppercase tracking-widest">Easy</th>
                  <th scope="col" className="px-4 py-5 text-center text-xs font-black text-yellow-600 uppercase tracking-widest">Medium</th>
                  <th scope="col" className="px-4 py-5 text-center text-xs font-black text-red-600 uppercase tracking-widest">Hard</th>
                  <th scope="col" className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredStudents
                  .sort((a, b) => (b.latestStats?.totalSolved || 0) - (a.latestStats?.totalSolved || 0))
                  .map((student, index) => {
                  const stats = student.latestStats || { totalSolved: 0, easy: 0, medium: 0, hard: 0 };
                  
                  return (
                    <tr key={student._id} className="hover:bg-indigo-50/30 transition-all duration-300 group">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-black border-2 ${
                          index === 0 ? 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm' : 
                          index === 1 ? 'bg-gray-50 text-gray-700 border-gray-200' : 
                          index === 2 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'text-gray-400 border-transparent'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-inner transform group-hover:scale-110 transition-transform">
                            {student.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-base font-black text-gray-900 leading-none">{student.name}</div>
                            <div className="text-xs text-indigo-500 font-bold mt-1.5 flex items-center opacity-70">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {student.leetcodeUsername}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-bold text-gray-500">
                        {student.rollNo}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {student.dept || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-lg font-black italic shadow-sm">
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
                          className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-black rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all active:scale-95"
                        >
                          Details
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
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
                      <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-black">
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

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-50">
                    <div className="text-center">
                      <div className="text-xs font-black text-green-600">{stats.easy}</div>
                      <div className="text-[8px] font-bold text-gray-400 uppercase">Easy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-black text-yellow-600">{stats.medium}</div>
                      <div className="text-[8px] font-bold text-gray-400 uppercase">Med</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-black text-red-600">{stats.hard}</div>
                      <div className="text-[8px] font-bold text-gray-400 uppercase">Hard</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[8px] font-bold uppercase">{student.dept || 'N/A'}</span>
                      <span className="text-[10px] text-gray-400 font-bold">{student.rollNo}</span>
                    </div>
                    <Link 
                      to={`/student/${student._id}`} 
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white transition-all overflow-hidden relative group"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {students.length === 0 && (
            <div className="px-6 py-20 text-center">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gray-50 rounded-3xl mb-4">
                  <Users className="h-12 w-12 text-gray-200" />
                </div>
                <p className="text-xl font-black text-gray-300">No students yet</p>
                <p className="text-sm text-gray-400 mt-2 font-bold uppercase tracking-wider">Start by adding your first student</p>
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
