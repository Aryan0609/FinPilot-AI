import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FaExchangeAlt,
  FaWallet,
  FaStickyNote,
  FaRupeeSign,
  FaUser,
} from "react-icons/fa";

import Layout from "../../layouts/Layout";
import { transferMoney } from "../../services/bankingService";

export default function Transfer() {
  const navigate = useNavigate();

  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [bankingPin, setBankingPin] = useState("");
  const [loading, setLoading] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!receiverAccountNumber || !amount) {
      toast.error("Fill all required fields.");
      return;
    }

    if (!/^\d{4}$/.test(bankingPin)) {
      toast.error("Enter your 4-digit banking PIN.");
      return;
    }

    try {
      setLoading(true);

      let accountNumber =
        receiverAccountNumber.trim().toUpperCase();

      // Allow user to enter either:
      // AC319129872
      // or
      // 319129872
      if (!accountNumber.startsWith("AC")) {
        accountNumber = "AC" + accountNumber;
      }

      await transferMoney({
        toAccountNumber: accountNumber,
        amount: Number(amount),
        description,
        bankingPin,
      });

      toast.success("Transfer Successful");

      setReceiverAccountNumber("");
      setAmount("");
      setDescription("");
      setBankingPin("");

      setTimeout(() => navigate("/wallet"), 1200);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Transfer failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-2xl"
      >

        <div className="border-b border-zinc-800 p-8">
          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/20 text-2xl text-violet-400">
              <FaExchangeAlt />
            </div>

            <div>
              <h1 className="text-4xl font-black text-white">
                Money Transfer
              </h1>

              <p className="mt-2 text-zinc-400">
                Send money instantly to another account.
              </p>
            </div>

          </div>
        </div>

        <form
          onSubmit={handleTransfer}
          className="space-y-8 p-8"
        >

          {/* Receiver Account */}

          <div>
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">
              <FaUser />
              Receiver Account Number
            </label>

            <input
              type="text"
              value={receiverAccountNumber}
              onChange={(e) =>
                setReceiverAccountNumber(
                  e.target.value.toUpperCase()
                )
              }
              placeholder="Enter Account Number (e.g. AC319129872)"
              className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] py-4 px-5 text-white outline-none transition focus:border-violet-500"
              required
            />
          </div>

          {/* Amount */}

          <div>
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">
              <FaRupeeSign />
              Amount
            </label>

            <div className="relative">

              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 text-xl">
                ₹
              </span>

              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Transfer Amount"
                className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] py-4 pl-12 pr-5 text-xl text-white outline-none transition focus:border-violet-500"
                required
              />

            </div>
          </div>

          {/* Quick Amounts */}

          <div>

            <p className="mb-4 text-sm uppercase tracking-widest text-zinc-500">
              Quick Select
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

              {quickAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value)}
                  className="rounded-2xl border border-zinc-700 bg-[#141414] py-3 font-semibold text-white transition hover:border-violet-500 hover:bg-violet-600"
                >
                  ₹{value}
                </button>
              ))}

            </div>
          </div>

          {/* Description */}

          <div>

            <label className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">
              <FaStickyNote />
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              className="w-full resize-none rounded-2xl border border-zinc-700 bg-[#0d0d0d] p-5 text-white outline-none transition focus:border-violet-500"
            />

          </div>

          {/* Banking PIN */}

          <div>

            <label className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Banking PIN
            </label>

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={bankingPin}
              onChange={(e) =>
                setBankingPin(
                  e.target.value.replace(/\D/g, "").slice(0, 4)
                )
              }
              placeholder="Enter 4-digit PIN"
              autoComplete="off"
              className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] py-4 px-5 text-xl tracking-[0.5em] text-white outline-none transition focus:border-violet-500"
              required
            />

            <p className="mt-2 text-xs text-zinc-500">
              Your PIN is required to authorize this transaction.
            </p>

          </div>

          {/* Summary */}

          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-6">

            <div className="flex items-center gap-3 text-violet-300">

              <FaWallet />

              <span className="font-semibold">
                Transfer Summary
              </span>

            </div>

            <div className="mt-5 flex items-center justify-between">

              <span className="text-zinc-400">
                Amount
              </span>

              <span className="text-3xl font-black text-white">
                ₹{Number(amount || 0).toLocaleString()}
              </span>

            </div>

          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Processing Transfer..."
              : "Transfer Money"}
          </button>

        </form>

      </motion.div>
    </Layout>
  );
}