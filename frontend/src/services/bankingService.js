import api from "./api";
import { API } from "../api/endpoints";

import accountService from "./accountService";
import transactionService from "./transactionService";

const bankingService = {

  getAccount(id) {
    return accountService.getAccount(id);
  },

  getBalance(id) {
    return accountService.getBalance(id);
  },

  depositMoney(data) {
    return transactionService.depositMoney(data);
  },

  withdrawMoney(data) {
    return transactionService.withdrawMoney(data);
  },

  transferMoney(data) {
    return transactionService.transferMoney(data);
  },

  getTransactions(accountId) {
    return transactionService.getTransactions(accountId);
  },

  // ---------------- Mutual Funds ----------------

  getMutualFunds() {
    return api.get(API.MUTUAL_FUNDS);
  },

  getPortfolio(accountId) {
    return api.get(API.PORTFOLIO(accountId));
  },

  buyFund(accountId, data) {
    return api.post(API.BUY_FUND(accountId), data);
  },

  sellFund(investmentId, units) {
    return api.post(
      API.SELL_FUND(investmentId),
      { units }
    );
  }

};

export const getAccount = bankingService.getAccount;
export const getBalance = bankingService.getBalance;
export const depositMoney = bankingService.depositMoney;
export const withdrawMoney = bankingService.withdrawMoney;
export const transferMoney = bankingService.transferMoney;
export const getTransactions = bankingService.getTransactions;

export const getMutualFunds = bankingService.getMutualFunds;
export const getPortfolio = bankingService.getPortfolio;
export const buyFund = bankingService.buyFund;
export const sellFund = bankingService.sellFund;

export default bankingService;