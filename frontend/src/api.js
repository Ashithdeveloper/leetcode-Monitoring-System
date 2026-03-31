import axios from 'axios';

export const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getStudents = () => api.get('/students');
export const getStudentById = (id) => api.get(`/students/${id}`);
export const addStudent = (studentData) => api.post('/students/add', studentData);

export default api;
