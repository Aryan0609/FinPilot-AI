import api from "./api";

const fdService = {
  getUserFDs: async (userId) => {
    const response = await api.get(`/api/fd/user/${userId}`);
    return response.data;
  },

  createFD: async ({ accountId, amount, tenureMonths }) => {
    const response = await api.post("/api/fd/create", {
      accountId,
      amount,
      tenureMonths,
    });

    return response.data;
  },

  closeFD: async (fdId) => {
    const response = await api.post(`/api/fd/close/${fdId}`);
    return response.data;
  },
};

export default fdService;
