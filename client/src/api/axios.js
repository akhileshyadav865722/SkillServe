import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Optionally, interceptors could be added here if needed, 
// but currently tokens are passed explicitly in components.

export default api;
