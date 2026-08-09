import { Routes, Route } from "react-router-dom";

import Login from "../pages/login/Login";
import Register from "../pages/login/Register";

import Dashboard from "../pages/Dashboard/Dashboard";
import Transactions from "../pages/Banking/Transactions";
import MutualFunds from "../pages/Banking/MutualFunds";
import FixedDeposits from "../pages/Banking/FixedDeposits";
import FraudDetection from "../pages/AI/FraudDetection";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminTransactions from "../pages/Admin/Transactions";
import AdminFraudDetection from "../pages/Admin/FraudDetection";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/mutual-funds" element={<MutualFunds />} />
      <Route path="/fixed-deposits" element={<FixedDeposits />} />
      <Route path="/fraud-detection" element={<FraudDetection />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route
        path="/admin/transactions"
        element={<AdminTransactions />}
      />
      <Route
        path="/admin/fraud-detection"
        element={<AdminFraudDetection />}
      />

      {/* Default */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
