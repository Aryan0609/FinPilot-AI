import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FaArrowDown,
  FaWallet,
  FaStickyNote,
  FaRupeeSign,
} from "react-icons/fa";

import Layout from "../../layouts/Layout";
import { depositMoney } from "../../services/bankingService";
import authService from "../../services/authService";

export default function Deposit() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);

      const user = (await authService.getCurrentUser()).data;

      await depositMoney({
        accountId: user.accountId,
        amount: Number(amount),
        description,
      });

      toast.success("Deposit Successful");

      setAmount("");
      setDescription("");

      setTimeout(() => navigate("/wallet"), 1200);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Unable to complete deposit."
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
        <div className="overflow-hidden rounded-[32px] border border-zinc-800 bg-gradient-to-br from-[#171717] via-[#101010] to-[#27134a]">

          {/* Header */}

          <div className="border-b border-zinc-800 p-8">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20 text-2xl text-green-400">

                <FaArrowDown />

              </div>

              <div>

                <h1 className="text-4xl font-black text-white">
                  Deposit Money
                </h1>

                <p className="mt-2 text-zinc-400">
                  Instantly add funds to your account.
                </p>

              </div>

            </div>

          </div>

          <form
            onSubmit={handleDeposit}
            className="space-y-8 p-8"
          >

            {/* Amount */}

            <div>

              <label className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">

                <FaRupeeSign />

                Amount

              </label>

              <div className="relative">

                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-zinc-500">
                  ₹
                </span>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter Amount"
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

            {/* Summary */}

            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-6">

              <div className="flex items-center gap-3 text-violet-300">

                <FaWallet />

                <span className="font-semibold">
                  Deposit Summary
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
              className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing Deposit..." : "Deposit Money"}
            </button>

          </form>

        </div>
      </motion.div>
    </Layout>
  );
}