import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getStats: () => api.get('/users/stats'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};

export const bookService = {
  getAll: (params) => api.get('/books', { params }),
  getStats: () => api.get('/books/stats'),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`)
};

export const transactionService = {
  getAll: (params) => api.get('/transactions', { params }),
  getStats: () => api.get('/transactions/stats'),
  getById: (id) => api.get(`/transactions/${id}`),
  issue: (data) => api.post('/transactions/issue', data),
  return: (id, fine) => api.post(`/transactions/return/${id}`, { fine }),
  delete: (id) => api.delete(`/transactions/${id}`)
};
