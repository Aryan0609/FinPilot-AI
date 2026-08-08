import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/login/Login";
import Register from "../pages/login/Register";

import Dashboard from "../pages/Dashboard/Dashboard";

import Wallet from "../pages/Banking/Wallet";
import Deposit from "../pages/Banking/Deposit";
import Withdraw from "../pages/Banking/Withdraw";
import Transfer from "../pages/Banking/Transfer";
import Transactions from "../pages/Banking/Transactions";
import Savings from "../pages/Banking/Savings";
import FD from "../pages/Banking/FD";
import MutualFunds from "../pages/Banking/MutualFunds";

import FraudDetection from "../pages/AI/FraudDetection";
import Profile from "../pages/Profile/Profile";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import AdminRoutes from "./AdminRoutes";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
        path="/transfer"
        element={
          <PrivateRoute>
            <Transfer />
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
        path="/savings"
        element={
          <PrivateRoute>
            <Savings />
          </PrivateRoute>
        }
      />

      <Route
        path="/fd"
        element={
          <PrivateRoute>
            <FD />
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
        path="/fraud"
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

      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminRoutes />
          </AdminRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  );
}