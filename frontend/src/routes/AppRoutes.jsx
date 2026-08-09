import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/login/Login";
import Register from "../pages/login/Register";

import Dashboard from "../pages/Dashboard/Dashboard";

import Wallet from "../pages/Banking/Wallet";
import Transfer from "../pages/Banking/Transfer";
import Deposit from "../pages/Banking/Deposit";
import Withdraw from "../pages/Banking/Withdraw";
import Transactions from "../pages/Banking/Transactions";
import MutualFunds from "../pages/Banking/MutualFunds";
import FixedDeposits from "../pages/Banking/FD";

import FraudDetection from "../pages/AI/FraudDetection";

import Profile from "../pages/Profile/Profile";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminTransactions from "../pages/Admin/Transactions";
import AdminFraudDetection from "../pages/Admin/FraudDetection";
import AdminMutualFunds from "../pages/Admin/MutualFunds";
import AdminNotifications from "../pages/Admin/Notifications";
import AdminProfile from "../pages/Admin/Profile";
import AdminUsers from "../pages/Admin/Users";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

export default function AppRoutes() {
  return (
    <Routes>

      {/* =========================
          PUBLIC
      ========================= */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />


      {/* =========================
          USER
      ========================= */}

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/wallet"
        element={
          <PrivateRoute>
            <Wallet />
          </PrivateRoute>
        }
      />

      <Route
        path="/transfer"
        element={
          <PrivateRoute>
            <Transfer />
          </PrivateRoute>
        }
      />

      <Route
        path="/deposit"
        element={
          <PrivateRoute>
            <Deposit />
          </PrivateRoute>
        }
      />

      <Route
        path="/withdraw"
        element={
          <PrivateRoute>
            <Withdraw />
          </PrivateRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        }
      />

      <Route
        path="/mutual-funds"
        element={
          <PrivateRoute>
            <MutualFunds />
          </PrivateRoute>
        }
      />

      <Route
        path="/fixed-deposits"
        element={
          <PrivateRoute>
            <FixedDeposits />
          </PrivateRoute>
        }
      />

      <Route
        path="/fraud-detection"
        element={
          <PrivateRoute>
            <FraudDetection />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />


      {/* =========================
          ADMIN
      ========================= */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/transactions"
        element={
          <AdminRoute>
            <AdminTransactions />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/fraud-detection"
        element={
          <AdminRoute>
            <AdminFraudDetection />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/mutual-funds"
        element={
          <AdminRoute>
            <AdminMutualFunds />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/notifications"
        element={
          <AdminRoute>
            <AdminNotifications />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <AdminRoute>
            <AdminProfile />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />


      {/* =========================
          FALLBACK
      ========================= */}

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}
