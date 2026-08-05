import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Admin/Dashboard";
import Users from "../pages/Admin/Users";
import Merchants from "../pages/Admin/Merchants";
import Transactions from "../pages/Admin/Transactions";
import FraudDetection from "../pages/Admin/FraudDetection";
import Notifications from "../pages/Admin/Notifications";
import Profile from "../pages/Admin/Profile";

export default function AdminRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Dashboard />} />

      <Route path="/users" element={<Users />} />

      <Route path="/merchants" element={<Merchants />} />

      <Route path="/transactions" element={<Transactions />} />

      <Route path="/fraud" element={<FraudDetection />} />

      <Route path="/notifications" element={<Notifications />} />

      <Route path="/profile" element={<Profile />} />

    </Routes>
  );
}