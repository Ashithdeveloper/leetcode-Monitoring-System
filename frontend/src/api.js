import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Student endpoints
export const getStudents = () => api.get('/students');
export const getDeletedStudents = () => api.get('/students/deleted');
export const getStudentById = (id) => api.get(`/students/${id}`);
export const addStudent = (studentData) => api.post('/students/add', studentData);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
export const restoreStudent = (id) => api.put(`/students/${id}/restore`);
export const permanentDeleteStudent = (id) => api.delete(`/students/${id}/permanent`);

// Auth endpoints
export const loginAdmins = (username, password) => api.post('/auth/login', { username, password });
export const loginGuest = () => api.post('/auth/guest');
export const registerAdmin = (adminData) => api.post('/auth/register-admin', adminData);
export const getAdmins = () => api.get('/auth/admins');
export const updatePassword = (newPassword) => api.post('/auth/update-password', { newPassword });

export default api;
