export const API = {

  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",

  CREATE_ACCOUNT: "/accounts",

  ACCOUNT: (id) => `/accounts/${id}`,

  BALANCE: (id) => `/accounts/${id}/balance`,

  DEPOSIT: "/api/transactions/deposit",

  WITHDRAW: "/api/transactions/withdraw",

  TRANSFER: "/api/transactions/transfer",

  HISTORY: (id) => `/api/transactions/account/${id}`,

  // ---------------- Mutual Funds ----------------

  MUTUAL_FUNDS: "/api/mutual-funds",

  BUY_FUND: (accountId) =>
      `/api/mutual-funds/buy/${accountId}`,

  SELL_FUND: (investmentId) =>
      `/api/mutual-funds/sell/${investmentId}`,

  PORTFOLIO: (accountId) =>
      `/api/mutual-funds/portfolio/${accountId}`,

  AI_PREDICT: "/predict"

};