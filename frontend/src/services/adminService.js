import api from "./api";

const adminService = {

  getDashboardStats() {
    return api.get("/admin/dashboard");
  },

  getUsers() {
    return api.get("/admin/users");
  },

  getRecentUsers() {
    return api.get("/admin/users/recent");
  },

  getRecentTransactions() {
    return api.get("/admin/transactions/recent");
  }

};

export default adminService;

export const getDashboardStats = adminService.getDashboardStats;
export const getUsers = adminService.getUsers;
export const getRecentUsers = adminService.getRecentUsers;
export const getRecentTransactions = adminService.getRecentTransactions;