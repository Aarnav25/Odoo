import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('gearguard_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('gearguard_token');
  }
};

// Init token from storage
const existingToken = localStorage.getItem('gearguard_token');
if (existingToken) setAuthToken(existingToken);

// Equipment Services
export const equipmentService = {
  getAll: (filters = {}) => api.get('/equipment', { params: filters }),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/equipment', data),
  update: (id, data) => api.put(`/equipment/${id}`, data),
  delete: (id) => api.delete(`/equipment/${id}`),
  getRequests: (id) => api.get(`/equipment/${id}/requests`),
};

// Team Services
export const teamService = {
  getAll: () => api.get('/teams'),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  addMember: (id, userId) => api.post(`/teams/${id}/members`, { userId }),
  removeMember: (id, userId) => api.delete(`/teams/${id}/members`, { data: { userId } }),
  delete: (id) => api.delete(`/teams/${id}`),
};

// Request Services
export const requestService = {
  getAll: (filters = {}) => api.get('/requests', { params: filters }),
  getById: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  update: (id, data) => api.put(`/requests/${id}`, data),
  updateStage: (id, stage) => api.put(`/requests/${id}/stage`, { stage }),
  assign: (id, userId) => api.put(`/requests/${id}/assign`, { userId }),
  complete: (id, data) => api.put(`/requests/${id}/complete`, data),
  delete: (id) => api.delete(`/requests/${id}`),
  getByEquipment: (equipmentId) => api.get(`/requests/equipment/${equipmentId}`),
  getCalendarRequests: () => api.get('/requests/calendar/events'),
  getStatistics: () => api.get('/requests/stats/all'),
};

// User Services
export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => setAuthToken(null),
};

export default api;
