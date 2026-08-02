import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../layouts/Layout";
import DashboardCard from "../../components/Card/DashboardCard";
import TransactionTable from "../../components/Tables/TransactionTable";

import authService from "../../services/authService";
import {
  getAccount,
  getTransactions,
} from "../../services/bankingService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const userResponse = await authService.getCurrentUser();
      const currentUser = userResponse.data;

      setUser(currentUser);

      if (!currentUser.accountId) {
        setLoading(false);
        return;
      }

      const accountResponse = await getAccount(currentUser.accountId);
      setAccount(accountResponse.data);

      const transactionResponse = await getTransactions(
        currentUser.accountId
      );
      setTransactions(transactionResponse.data);
    } catch (err) {
      console.error(err);
      alert("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center bg-black text-white">
          <div className="text-center">
            <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-zinc-700 border-t-violet-500"></div>
            <h2 className="text-2xl font-semibold tracking-wide">
              Loading FinPilot...
            </h2>
          </div>
        </div>
      </Layout>
    );
  }

  const actions = [
    { title: "Wallet", icon: "💳", path: "/wallet" },
    { title: "Deposit", icon: "➕", path: "/deposit" },
    { title: "Withdraw", icon: "➖", path: "/withdraw" },
    { title: "Transfer", icon: "🔄", path: "/transfer" },
    { title: "Transactions", icon: "📜", path: "/transactions" },
    { title: "Savings", icon: "🏦", path: "/savings" },
    { title: "Fixed Deposit", icon: "📈", path: "/fd" },
    { title: "Mutual Funds", icon: "📊", path: "/mutual-funds" },
    { title: "AI Fraud", icon: "🤖", path: "/fraud" },
    { title: "Profile", icon: "👤", path: "/profile" },
  ];

  return (
    <Layout>
      <div className="space-y-8 text-white">

        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-black to-violet-950 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[4px] text-zinc-400">
            Welcome Back
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            {user?.name}
          </h1>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <DashboardCard
              title="Current Balance"
              value={`₹${account?.balance ?? 0}`}
              color="bg-violet-700"
            />

            <DashboardCard
              title="Account Number"
              value={account?.accountNumber || "N/A"}
              color="bg-zinc-800"
            />

            <DashboardCard
              title="Transactions"
              value={transactions.length}
              color="bg-emerald-700"
            />
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-2xl font-semibold">
            Quick Services
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {actions.map((action) => (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-violet-600 hover:bg-zinc-800"
              >
                <div className="mb-4 text-4xl">
                  {action.icon}
                </div>

                <h3 className="text-lg font-semibold">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm text-zinc-400 group-hover:text-zinc-300">
                  Open →
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Recent Transactions
            </h2>

            <button
              onClick={() => navigate("/transactions")}
              className="rounded-xl bg-violet-700 px-5 py-2 transition hover:bg-violet-600"
            >
              View All
            </button>
          </div>

          <TransactionTable transactions={transactions} />
        </div>
      </div>
    </Layout>
  );
}