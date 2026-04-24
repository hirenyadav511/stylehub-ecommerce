import axios from 'axios';
import API_BASE_URL from '../config';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getImageUrl = (img) => {
  if (!img) return "";
  return img.startsWith("http") ? img : `${API_BASE_URL}${img}`;
};

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
