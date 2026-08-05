import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "http://localhost:8080/admin",
});

// Attach JWT Token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= Dashboard =================

export const getDashboardStats = () => {
  return API.get("/dashboard");
};

// ================= Users =================

export const getUsers = () => {
  return API.get("/users");
};

export const getUserById = (id) => {
  return API.get(`/users/${id}`);
};

export const createUser = (userData) => {
  return API.post("/users", userData);
};

export const updateUser = (id, userData) => {
  return API.put(`/users/${id}`, userData);
};

export const deleteUser = (id) => {
  return API.delete(`/users/${id}`);
};

export const blockUser = (id) => {
  return API.put(`/users/${id}/block`);
};

// ================= Merchants =================

export const getMerchants = () => {
  return API.get("/merchants");
};

export const getMerchantById = (id) => {
  return API.get(`/merchants/${id}`);
};

export const verifyMerchant = (id) => {
  return API.put(`/merchants/${id}/verify`);
};

export const rejectMerchant = (id) => {
  return API.put(`/merchants/${id}/reject`);
};

// ================= Transactions =================

export const getTransactions = () => {
  return API.get("/transactions");
};

export const getTransactionById = (id) => {
  return API.get(`/transactions/${id}`);
};

// ================= Fraud =================

export const getFraudAlerts = () => {
  return API.get("/fraud");
};

export const getFraudById = (id) => {
  return API.get(`/fraud/${id}`);
};

// ================= Notifications =================

export const getNotifications = () => {
  return API.get("/notifications");
};

export const markNotificationRead = (id) => {
  return API.put(`/notifications/${id}/read`);
};

// ================= Profile =================

export const getAdminProfile = () => {
  return API.get("/profile");
};

export const updateAdminProfile = (profileData) => {
  return API.put("/profile", profileData);
};

export default API;