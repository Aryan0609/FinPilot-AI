import api from "./api";

const adminService = {

  getDashboardStats() {
    return api.get("/admin/dashboard");
  }

};

export default adminService;

// ================= DASHBOARD =================

export const getDashboardStats = () => {
  return api.get("/admin/dashboard");
};

export const getChartData = () => {
  return api.get("/admin/dashboard/chart");
};

// ================= USERS =================

export const getUsers = () => {
  return api.get("/admin/users");
};

export const getRecentUsers = () => {
  return api.get("/admin/users/recent");
};

export const getUserDetails = (id) => {
  return api.get(`/admin/users/${id}`);
};

// ================= TRANSACTIONS =================

export const getTransactions = () => {
  return api.get("/admin/transactions");
};

export const getRecentTransactions = () => {
  return api.get("/admin/transactions/recent");
};

// ================= NOTIFICATIONS =================

export const getNotifications = () => {
  return api.get("/admin/notifications");
};

// ================= AI =================

export const getAIHealth = () => {
  return api.get("/ai/health");
};

export const getUserTransactions = (id) => {
    return api.get(`/admin/users/${id}/transactions`);
};

export const getMutualFunds = () => {
    return api.get("/admin/mutual-funds");
};

export const getMutualFundInvestments = (fundId) => {
    return api.get(`/admin/mutual-funds/${fundId}/investments`);
};