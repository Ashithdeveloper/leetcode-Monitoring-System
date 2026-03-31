import React, { useState } from 'react';
import { X, User, Hash, Calendar, Link as LinkIcon, Loader2, Building2 } from 'lucide-react';
import { addStudent } from '../api';

const AddStudentModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    year: '',
    dept: '',
    leetcodeLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addStudent(formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: '',
        rollNo: '',
        year: '',
        dept: '',
        leetcodeLink: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add student. Please check the details.');
      console.error("Error adding student:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Add New Student</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <User size={16} className="mr-2 text-indigo-500" />
              Full Name
            </label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <Hash size={16} className="mr-2 text-indigo-500" />
                Roll No
              </label>
              <input 
                type="text" 
                name="rollNo"
                required
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="e.g. 12345"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <Calendar size={16} className="mr-2 text-indigo-500" />
                Batch Year
              </label>
              <input 
                type="text" 
                name="year"
                required
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g. 2023-2027"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <Building2 size={16} className="mr-2 text-indigo-500" />
              Department
            </label>
            <input 
              type="text" 
              name="dept"
              required
              value={formData.dept}
              onChange={handleChange}
              placeholder="e.g. CSE, ECE, IT"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <LinkIcon size={16} className="mr-2 text-indigo-500" />
              LeetCode Link
            </label>
            <input 
              type="url" 
              name="leetcodeLink"
              required
              value={formData.leetcodeLink}
              onChange={handleChange}
              placeholder="https://leetcode.com/username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Stats will be fetched automatically upon submission.
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-2 px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-100 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Saving...
                </>
              ) : (
                'Add Student'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
