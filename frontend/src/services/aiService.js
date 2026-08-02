import api from "./api";

const AI = "/ai";

export const predictFraud = async (data) => {
    const response = await api.post(`${AI}/predict`, data);
    return response.data;
};

export const getPredictionHistory = async () => {
    const response = await api.get(`${AI}/history`);
    return response.data;
};

export const checkAIStatus = async () => {
    const response = await api.get(`${AI}/health`);
    return response.data;
};