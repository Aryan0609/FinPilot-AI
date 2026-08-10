import api from "./api";

const FD_BASE_URL = "/api/fd";

const fdService = {
  // Get all fixed deposits for a user
  getUserFDs: async (userId) => {
    const response = await api.get(
      `${FD_BASE_URL}/user/${userId}`
    );

    return response.data;
  },

  // Create a fixed deposit
  createFD: async ({ accountId, amount, tenureMonths }) => {
    const response = await api.post(
      `${FD_BASE_URL}/create`,
      {
        accountId,
        amount,
        tenureMonths,
      }
    );

    return response.data;
  },

  // Close a fixed deposit
  closeFD: async (fdId) => {
    const response = await api.post(
      `${FD_BASE_URL}/close/${fdId}`
    );

    return response.data;
  },
};

export default fdService;