import api from "./api";

const pinService = {
  verifyPin: async (pin) => {
    const response = await api.post("/api/pin/verify", {
      pin,
    });

    return response.data;
  },
};

export default pinService;
