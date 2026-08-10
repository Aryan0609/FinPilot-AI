import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash, FaLock, FaWallet } from "react-icons/fa";

import Layout from "../../layouts/Layout";
import authService from "../../services/authService";
import { getAccount } from "../../services/bankingService";
import pinService from "../../services/pinService";

export default function Wallet() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [verifyingPin, setVerifyingPin] = useState(false);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      setLoading(true);

      const currentUser =
        (await authService.getCurrentUser()).data;

      setUser(currentUser);

      if (!currentUser?.accountId) {
        throw new Error("No account associated with this user");
      }

      const accountRes =
        await getAccount(currentUser.accountId);

      setAccount(accountRes.data);
    } catch (err) {
      console.error("Wallet loading failed:", err);

      toast.error(
        err.response?.data?.message ||
        "Failed to load wallet"
      );
    } finally {
      setLoading(false);
    }
  };

  const openBalance = () => {
    setPin("");
    setShowPinModal(true);
  };

  const closePinModal = () => {
    if (verifyingPin) return;

    setPin("");
    setShowPinModal(false);
  };

  const verifyPin = async (e) => {
    e.preventDefault();

    if (!/^\d{4}$/.test(pin)) {
      toast.error("Enter your 4-digit banking PIN.");
      return;
    }

    try {
      setVerifyingPin(true);

      await pinService.verifyPin(pin);

      setShowPinModal(false);
      setPin("");

      /*
       * Fetch the balance again after PIN verification.
       * This prevents showing an old/static balance.
       */
      await loadWallet();

      setBalanceVisible(true);

      toast.success("Balance unlocked");
    } catch (err) {
      console.error("PIN verification failed:", err);

      toast.error(
        err.response?.data?.message ||
        err.userMessage ||
        "Invalid banking PIN"
      );

      setPin("");
    } finally {
      setVerifyingPin(false);
    }
  };

  const hideBalance = () => {
    setBalanceVisible(false);
  };

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(
        account?.accountNumber || ""
      );

      toast.success("Account number copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const formatBalance = () => {
    return Number(account?.balance || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-sm text-zinc-500">
            Loading wallet...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8">
          <p className="text-sm uppercase tracking-[4px] text-violet-400">
            Wallet
          </p>

          <h1 className="mt-2 text-4xl font-black text-white">
            My Wallet
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage your banking account and available funds.
          </p>
        </div>

        {/* BALANCE CARD */}

        <div className="mb-6 overflow-hidden rounded-3xl border border-zinc-800 bg-[#141414]">

          <div className="p-8">

            <div className="flex items-start justify-between gap-4">

              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                    <FaWallet />
                  </div>

                  <div>
                    <p className="text-sm text-zinc-500">
                      Available Balance
                    </p>

                    <p className="text-xs text-zinc-600">
                      Protected by your banking PIN
                    </p>
                  </div>
                </div>

                <div className="mt-7">

                  {balanceVisible ? (
                    <h2 className="text-5xl font-black tracking-tight text-white">
                      ₹{formatBalance()}
                    </h2>
                  ) : (
                    <h2 className="text-5xl font-black tracking-[8px] text-white">
                      ••••••••
                    </h2>
                  )}

                  <p className="mt-3 text-sm text-zinc-500">
                    {account?.accountType || "BANK ACCOUNT"}
                  </p>

                </div>
              </div>

              <button
                type="button"
                onClick={
                  balanceVisible
                    ? hideBalance
                    : openBalance
                }
                className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-[#0d0d0d] px-4 py-3 text-sm font-medium text-white transition hover:border-violet-500 hover:bg-violet-500/10"
              >
                {balanceVisible ? (
                  <>
                    <FaEyeSlash />
                    Hide Balance
                  </>
                ) : (
                  <>
                    <FaEye />
                    Show Balance
                  </>
                )}
              </button>

            </div>

          </div>

          <div className="border-t border-zinc-800 bg-[#0d0d0d] px-8 py-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <FaLock className="text-violet-400" />
              Your balance is hidden until your banking PIN is verified.
            </div>
          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="mb-6 grid gap-5 md:grid-cols-3">

          <button
            onClick={() => navigate("/deposit")}
            className="rounded-3xl border border-zinc-800 bg-[#141414] p-6 text-left transition hover:-translate-y-1 hover:border-violet-500"
          >
            <div className="text-3xl">
              📥
            </div>

            <h3 className="mt-4 text-xl font-bold text-white">
              Deposit
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Add money to your account
            </p>
          </button>

          <button
            onClick={() => navigate("/withdraw")}
            className="rounded-3xl border border-zinc-800 bg-[#141414] p-6 text-left transition hover:-translate-y-1 hover:border-violet-500"
          >
            <div className="text-3xl">
              📤
            </div>

            <h3 className="mt-4 text-xl font-bold text-white">
              Withdraw
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Withdraw available balance
            </p>
          </button>

          <button
            onClick={() => navigate("/transfer")}
            className="rounded-3xl border border-zinc-800 bg-[#141414] p-6 text-left transition hover:-translate-y-1 hover:border-violet-500"
          >
            <div className="text-3xl">
              🔄
            </div>

            <h3 className="mt-4 text-xl font-bold text-white">
              Transfer
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Transfer money instantly
            </p>
          </button>

        </div>

        {/* ACCOUNT DETAILS */}

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

              <div className="mt-2 flex items-center justify-between gap-3">

                <span className="truncate text-lg font-semibold text-white">
                  {account?.accountNumber || "-"}
                </span>

                <button
                  onClick={copyAccount}
                  className="shrink-0 rounded-lg bg-violet-600 px-3 py-2 text-sm text-white transition hover:bg-violet-700"
                >
                  Copy
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* PIN MODAL */}

      {showPinModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closePinModal();
            }
          }}
        >

          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#141414] p-7 shadow-2xl">

            <div className="mb-6 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                <FaLock />
              </div>

              <h2 className="mt-4 text-2xl font-bold text-white">
                Verify Banking PIN
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Enter your 4-digit banking PIN to view your balance.
              </p>

            </div>

            <form onSubmit={verifyPin}>

              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                autoFocus
                value={pin}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(/\D/g, "");

                  setPin(value);
                }}
                placeholder="••••"
                className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] px-4 py-4 text-center text-2xl tracking-[10px] text-white outline-none transition focus:border-violet-500"
              />

              <p className="mt-3 text-center text-xs text-zinc-600">
                Your PIN is never displayed or stored in the browser.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={closePinModal}
                  disabled={verifyingPin}
                  className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={verifyingPin || pin.length !== 4}
                  className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {verifyingPin
                    ? "Verifying..."
                    : "Verify PIN"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

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
