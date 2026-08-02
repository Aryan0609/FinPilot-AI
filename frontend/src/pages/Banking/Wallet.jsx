import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Layout from "../../layouts/Layout";
import authService from "../../services/authService";
import { getAccount } from "../../services/bankingService";

export default function Wallet() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const currentUser = (await authService.getCurrentUser()).data;
      setUser(currentUser);

      const accountRes = await getAccount(currentUser.accountId);
      setAccount(accountRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(account?.accountNumber || "");
      toast.success("Account number copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-violet-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">

        <div>
          <p className="text-sm uppercase tracking-[4px] text-violet-400">
            Wallet
          </p>

          <h1 className="mt-2 text-4xl font-black text-white">
            My Wallet
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage your banking account.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-8">

          <p className="text-sm text-violet-400">
            Available Balance
          </p>

          <h2 className="mt-3 text-5xl font-black text-white">
            ₹{Number(account?.balance || 0).toLocaleString()}
          </h2>

          <p className="mt-2 text-zinc-500">
            {account?.accountType}
          </p>

        </div>

        <div className="grid gap-5 md:grid-cols-3">

          <button
            onClick={() => navigate("/deposit")}
            className="rounded-3xl border border-zinc-800 bg-[#141414] p-6 text-left transition hover:border-violet-500"
          >
            <div className="text-3xl">📥</div>

            <h3 className="mt-4 text-xl font-bold text-white">
              Deposit
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Add money to your account
            </p>
          </button>

          <button
            onClick={() => navigate("/withdraw")}
            className="rounded-3xl border border-zinc-800 bg-[#141414] p-6 text-left transition hover:border-violet-500"
          >
            <div className="text-3xl">📤</div>

            <h3 className="mt-4 text-xl font-bold text-white">
              Withdraw
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Withdraw available balance
            </p>
          </button>

                    <button
            onClick={() => navigate("/transfer")}
            className="rounded-3xl border border-zinc-800 bg-[#141414] p-6 text-left transition hover:border-violet-500"
          >
            <div className="text-3xl">🔄</div>

            <h3 className="mt-4 text-xl font-bold text-white">
              Transfer
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Transfer money instantly
            </p>
          </button>

        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-8">

          <h2 className="mb-6 text-2xl font-bold text-white">
            Account Details
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <InfoCard
              title="Account Holder"
              value={user?.name}
            />

            <InfoCard
              title="Email"
              value={user?.email}
            />

            <InfoCard
              title="Phone"
              value={user?.phone}
            />

            <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5">

              <p className="text-sm text-zinc-500">
                Account Number
              </p>

              <div className="mt-2 flex items-center justify-between">

                <span className="text-lg font-semibold text-white">
                  {account?.accountNumber}
                </span>

                <button
                  onClick={copyAccount}
                  className="rounded-lg bg-violet-600 px-3 py-2 text-sm text-white hover:bg-violet-700"
                >
                  Copy
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5">

      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <h3 className="mt-2 text-lg font-semibold text-white">
        {value || "-"}
      </h3>

    </div>
  );
}