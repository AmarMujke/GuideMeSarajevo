import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080"
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchCategories = async () => {
  const res = await api.get("/api/categories");
  return res.data;
};

export const fetchLocationsByCategory = async (categoryId) => {
  const res = await api.get(`/api/locations/category/${categoryId}`);
  return res.data;
};

export default api;