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

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    const message =
      error.response?.data?.message ||
      (status === 401
        ? "Session expired. Please login again."
        : status === 403
          ? "You are not authorized to perform this action."
          : status === 404
            ? "Requested resource was not found."
            : "An unexpected error occurred.");

    error.userMessage = message;

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;
