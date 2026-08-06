import api from "./api";

const adminService = {

  getDashboardStats() {
    return api.get("/admin/dashboard");
  }

};

export const getDashboardStats = adminService.getDashboardStats;

export default adminService;

export const getUsers = () => {
    return api.get("/admin/users");
};
export const getRecentTransactions = () => {
    return api.get("/admin/transactions/recent");
};

export const getRecentUsers = () => {
    return api.get("/admin/users/recent");
};