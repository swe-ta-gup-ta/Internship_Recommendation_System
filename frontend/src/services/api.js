import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 60000,
});

// Add JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

// Resume services
export const resumeService = {
  upload: (formData) => API.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  enhance: (data) => API.post('/resume/enhance', data),
};

// Internship services
export const internshipService = {
  getAll: () => API.get('/internships'),
  getById: (id) => API.get(`/internships/${id}`),
};

// Recommendation services
export const recommendationService = {
  getRecommendations: (userId) => API.get(`/recommendations/${userId}`),
};

// Application services
export const applicationService = {
  apply: (data) => API.post('/applications', data),
  getUserApplications: (userId) => API.get(`/applications/user/${userId}`),
};

export default API;
