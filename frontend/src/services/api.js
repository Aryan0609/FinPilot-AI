import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const publicEndpoints = [
    "/auth/login",
    "/auth/register",
  ];

  const isPublic = publicEndpoints.some(
    (endpoint) => config.url?.includes(endpoint)
  );

  if (!isPublic) {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
