import { Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import Users from "../pages/Admin/Users";
import Merchants from "../pages/Admin/Merchants";
import Transactions from "../pages/Admin/Transactions";
import FraudDetection from "../pages/Admin/FraudDetection";
import Notifications from "../pages/Admin/Notifications";
import Profile from "../pages/Admin/Profile";

export default function AdminRoutes() {

  return (

    <Routes>

      <Route
        index
        element={<AdminDashboard />}
      />

      <Route
        path="users"
        element={<Users />}
      />

      <Route
        path="merchants"
        element={<Merchants />}
      />

      <Route
        path="transactions"
        element={<Transactions />}
      />

      <Route
        path="fraud"
        element={<FraudDetection />}
      />

      <Route
        path="notifications"
        element={<Notifications />}
      />

      <Route
        path="profile"
        element={<Profile />}
      />

      <Route
        path="*"
        element={<Navigate to="/admin" replace />}
      />

    </Routes>

  );

}