import api from "./api";
import { API } from "../api/endpoints";

const accountService = {

  createAccount(data) {
    return api.post(API.CREATE_ACCOUNT, data);
  },

  getAccount(id) {
    return api.get(API.ACCOUNT(id));
  },

  getBalance(id) {
    return api.get(API.BALANCE(id));
  }


};
export const getUsers = () => {
  return api.get("/admin/users");
};
export default accountService;