import {
  FaUsers,
  FaStore,
  FaMoneyBillWave,
  FaShieldAlt,
  FaExchangeAlt,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import StatsCard from "../../components/Admin/StatsCard";
import TransactionChart from "../../components/Admin/TransactionChart";
import RecentUsers from "../../components/Admin/RecentUsers";
import RecentMerchants from "../../components/Admin/RecentMerchants";

export default function AdminDashboard() {
  return (
    <AdminLayout>

      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold text-white">
            Dashboard
          </h1>

          <p className="text-[#8E8E93] mt-2">
            Welcome back, Admin 👋
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

          <StatsCard title="Total Users" value="2431" icon={<FaUsers />} />

          <StatsCard title="Merchants" value="128" icon={<FaStore />} />

          <StatsCard title="Transactions" value="18524" icon={<FaExchangeAlt />} />

          <StatsCard title="Revenue" value="₹8.2 Cr" icon={<FaMoneyBillWave />} />

          <StatsCard
            title="Fraud Alerts"
            value="12"
            icon={<FaShieldAlt />}
            color="#E24A63"
          />

        </div>

        <TransactionChart />

        <div className="grid lg:grid-cols-2 gap-8">
          <RecentUsers />
          <RecentMerchants />
        </div>

      </div>

    </AdminLayout>
  );
}