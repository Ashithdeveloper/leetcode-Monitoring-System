import axios from 'axios';

export const API_BASE_URL = "http://localhost:5000/api";

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

export const getStudents = () => api.get('/students');
export const getStudentById = (id) => api.get(`/students/${id}`);
export const addStudent = (studentData) => api.post('/students/add', studentData);

// Auth endpoints
export const loginAdmins = (username, password) => api.post('/auth/login', { username, password });
export const registerAdmin = (adminData) => api.post('/auth/register-admin', adminData);
export const getAdmins = () => api.get('/auth/admins');

export default api;
