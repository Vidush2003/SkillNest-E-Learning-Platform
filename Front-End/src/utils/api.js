import axios from 'axios';

// Base API URL - Update this when connecting to backend
const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout')
};

// Course APIs
export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (courseData) => api.post('/courses', courseData),
  update: (id, courseData) => api.put(`/courses/${id}`, courseData),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll`)
};

// Lesson APIs (instead of Module APIs)
export const lessonAPI = {
  create: (courseId, lessonData) => api.post(`/courses/${courseId}/lessons`, lessonData),
  update: (courseId, lessonId, lessonData) => api.put(`/courses/${courseId}/lessons/${lessonId}`, lessonData),
  delete: (courseId, lessonId) => api.delete(`/courses/${courseId}/lessons/${lessonId}`),
  getByCourse: (courseId) => api.get(`/courses/${courseId}/lessons`),
  markAsComplete: (courseId, lessonId) => api.post(`/courses/${courseId}/lessons/${lessonId}/complete`)
};

// Quiz APIs
export const quizAPI = {
  getAll: () => api.get('/quizzes'),
  getByCourse: (courseId) => api.get(`/quizzes/course/${courseId}`),
  getById: (id) => api.get(`/quizzes/${id}`),
  create: (quizData) => api.post('/quizzes', quizData),
  update: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
  delete: (id) => api.delete(`/quizzes/${id}`),
  submit: (id, answers) => api.post(`/quizzes/${id}/attempt`, { answers })
};

// Discussion APIs
export const discussionAPI = {
  getByCourse: (courseId) => api.get(`/forum/course/${courseId}`),
  create: (discussionData) => api.post('/forum', discussionData),
  addReply: (threadId, replyData) => api.post(`/forum/${threadId}/reply`, replyData),
  like: (discussionId) => api.post(`/forum/${discussionId}/like`),
  delete: (discussionId) => api.delete(`/forum/${discussionId}`),
  deleteComment: (discussionId, commentId) => api.delete(`/forum/${discussionId}/comments/${commentId}`)
};

// User APIs (UPDATED FOR ADMIN)
export const userAPI = {
  // Existing User Profile methods
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getEnrollments: () => api.get('/users/enrollments'),
  updateProgress: (courseId, lessonId) => api.post('/users/progress', { courseId, lessonId }),
  getProgress: (courseId) => api.get(`/courses/${courseId}/progress`),
  
  // New Admin Methods (Ye maine add kiya hai)
  getAll: () => api.get('/users'), // Saare users fetch karne ke liye
  delete: (id) => api.delete(`/users/${id}`), // User delete karne ke liye
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }) // Future use: Role update karne ke liye
};

// Analytics APIs
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getCourseStats: (courseId) => api.get(`/analytics/courses/${courseId}`),
  exportCourseStats: (courseId) => api.get(`/analytics/courses/${courseId}/export`, { responseType: 'blob' }),
  exportUserStats: () => api.get('/analytics/users/export', { responseType: 'blob' })
};

export default api;