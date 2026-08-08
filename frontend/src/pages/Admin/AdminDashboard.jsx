import {
  FaUsers,
  FaRobot,
  FaMoneyBillWave,
  FaShieldAlt,
  FaExchangeAlt,
} from "react-icons/fa";

import { useEffect, useState } from "react";

import {
  getDashboardStats,
  getAIHealth,
} from "../../services/adminService";

import AdminLayout from "../../layouts/AdminLayout";
import StatsCard from "../../components/Admin/StatsCard";
import TransactionChart from "../../components/Admin/TransactionChart";
import RecentUsers from "../../components/Admin/RecentUsers";
import RecentTransactions from "../../components/Admin/RecentTransactions";

export default function AdminDashboard() {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState("Loading...");

  useEffect(() => {
    loadDashboard();
    loadAIHealth();
  }, []);

  const loadDashboard = async () => {

    try {

      const response = await getDashboardStats();

      setDashboard(response.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  const loadAIHealth = async () => {

    try {

      const response = await getAIHealth();

      setAiStatus(response.data.status);

    } catch (err) {

      console.error(err);

      setAiStatus("Offline");

    }

  };

  if (loading) {

    return (

      <AdminLayout>

        <div className="flex h-96 items-center justify-center">

          <h1 className="text-2xl font-bold text-white">

            Loading Dashboard...

          </h1>

        </div>

      </AdminLayout>

    );

  }

  return (

    <AdminLayout>

      <div className="space-y-8">

        <div>

          <h1 className="text-4xl font-bold text-white">

            Dashboard

          </h1>

          <p className="mt-2 text-[#8E8E93]">

            Welcome back, Admin 👋

          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">

          <StatsCard
            title="Total Users"
            value={dashboard.totalUsers}
            icon={<FaUsers />}
          />

          <StatsCard
            title="Transactions"
            value={dashboard.totalTransactions}
            icon={<FaExchangeAlt />}
          />

          <StatsCard
            title="Wallet Balance"
            value={`₹${dashboard.totalWalletBalance}`}
            icon={<FaMoneyBillWave />}
          />

          <StatsCard
            title="Fraud Alerts"
            value={dashboard.fraudAlerts}
            icon={<FaShieldAlt />}
            color="#E24A63"
          />

          <StatsCard
            title="AI Status"
            value={aiStatus}
            icon={<FaRobot />}
            color={aiStatus === "Online" ? "#22C55E" : "#EF4444"}
          />

        </div>

        <TransactionChart />

        <div className="grid gap-8 lg:grid-cols-2">

          <RecentUsers />

          <RecentTransactions />

        </div>

      </div>

    </AdminLayout>

  );

}