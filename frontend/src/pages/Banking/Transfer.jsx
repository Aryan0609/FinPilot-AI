import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
<<<<<<< HEAD
=======

>>>>>>> 9198277 (n)
import {
  FaExchangeAlt,
  FaUser,
  FaRupeeSign,
  FaStickyNote,
  FaWallet,
} from "react-icons/fa";

import Layout from "../../layouts/Layout";
import { transferMoney } from "../../services/bankingService";
import authService from "../../services/authService";

export default function Transfer() {

  const navigate = useNavigate();

  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleTransfer = async (e) => {

    e.preventDefault();

    if (!receiverId || !amount) {
<<<<<<< HEAD
      toast.error("Please fill all fields.");
=======
      toast.error("Please fill all required fields.");
>>>>>>> 9198277 (n)
      return;
    }

    if (Number(amount) <= 0) {
<<<<<<< HEAD
      toast.error("Please enter a valid amount.");
=======
      toast.error("Enter a valid amount.");
>>>>>>> 9198277 (n)
      return;
    }

    try {

      setLoading(true);

<<<<<<< HEAD
      const user =
        (await authService.getCurrentUser()).data;
=======
      const user = (await authService.getCurrentUser()).data;
>>>>>>> 9198277 (n)

      await transferMoney({
        fromAccountId: user.accountId,
        toAccountId: Number(receiverId),
        amount: Number(amount),
        description,
      });

      toast.success("Transfer Successful");

      setReceiverId("");
      setAmount("");
      setDescription("");

      setTimeout(() => navigate("/wallet"), 1200);

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Transfer failed."
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <Layout>

      <motion.div
<<<<<<< HEAD
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-2xl"
      >

        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-[#141414]">

          <div className="border-b border-zinc-800 p-8">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20 text-2xl text-violet-400">

                <FaExchangeAlt />

              </div>

=======
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .45 }}
        className="mx-auto max-w-2xl"
      >

        <div className="overflow-hidden rounded-[32px] border border-zinc-800 bg-gradient-to-br from-[#171717] via-[#101010] to-[#27134a]">

          {/* Header */}

          <div className="border-b border-zinc-800 p-8">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/20 text-2xl text-violet-400">

                <FaExchangeAlt />

              </div>

>>>>>>> 9198277 (n)
              <div>

                <h1 className="text-4xl font-black text-white">
                  Transfer Money
                </h1>

                <p className="mt-2 text-zinc-400">
<<<<<<< HEAD
                  Transfer funds securely to another account.
=======
                  Securely transfer funds to another account.
>>>>>>> 9198277 (n)
                </p>

              </div>

            </div>

          </div>

          <form
            onSubmit={handleTransfer}
            className="space-y-8 p-8"
          >

<<<<<<< HEAD
=======
            {/* Receiver */}

>>>>>>> 9198277 (n)
            <div>

              <label className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">

                <FaUser />

<<<<<<< HEAD
                Receiver Account ID
=======
                Receiver Account
>>>>>>> 9198277 (n)

              </label>

              <input
                type="number"
                value={receiverId}
<<<<<<< HEAD
                onChange={(e) =>
                  setReceiverId(e.target.value)
                }
                placeholder="Enter Receiver Account ID"
                className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] p-4 text-white outline-none transition focus:border-violet-500"
=======
                onChange={(e) => setReceiverId(e.target.value)}
                placeholder="Enter Receiver Account ID"
                className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] px-5 py-4 text-white outline-none transition focus:border-violet-500"
>>>>>>> 9198277 (n)
                required
              />

            </div>

<<<<<<< HEAD
=======
            {/* Amount */}

>>>>>>> 9198277 (n)
            <div>

              <label className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">

                <FaRupeeSign />

                Amount

              </label>

<<<<<<< HEAD
              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="Enter Amount"
                className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] p-4 text-white outline-none transition focus:border-violet-500"
                required
              />

            </div>

=======
              <div className="relative">

                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 text-xl">
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

            {/* Quick Amount */}

>>>>>>> 9198277 (n)
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
<<<<<<< HEAD
                    className="rounded-2xl border border-zinc-700 bg-[#0d0d0d] py-3 font-semibold text-white transition hover:border-violet-500"
=======
                    className="rounded-2xl border border-zinc-700 bg-[#141414] py-3 font-semibold text-white transition hover:border-violet-500 hover:bg-violet-600"
>>>>>>> 9198277 (n)
                  >
                    ₹{value}
                  </button>

                ))}

              </div>

            </div>
<<<<<<< HEAD
                        <div>
=======

                        {/* Description */}

            <div>
>>>>>>> 9198277 (n)

              <label className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">

                <FaStickyNote />

                Description

              </label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
<<<<<<< HEAD
                placeholder="Optional description..."
=======
                placeholder="Optional transfer note..."
>>>>>>> 9198277 (n)
                className="w-full resize-none rounded-2xl border border-zinc-700 bg-[#0d0d0d] p-5 text-white outline-none transition focus:border-violet-500"
              />

            </div>

<<<<<<< HEAD
            {/* Transfer Summary */}

            <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6">

              <div className="flex items-center gap-3 text-violet-400">
=======
            {/* Summary */}

            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-6">

              <div className="flex items-center gap-3 text-violet-300">
>>>>>>> 9198277 (n)

                <FaWallet />

                <span className="font-semibold">
                  Transfer Summary
                </span>

              </div>

              <div className="mt-6 space-y-4">

<<<<<<< HEAD
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">

                  <span className="text-zinc-500">
                    Receiver
                  </span>

                  <span className="font-semibold text-white">
=======
                <div className="flex items-center justify-between">

                  <span className="text-zinc-400">
                    Receiver
                  </span>

                  <span className="font-bold text-white">
>>>>>>> 9198277 (n)
                    {receiverId || "--"}
                  </span>

                </div>

<<<<<<< HEAD
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">

                  <span className="text-zinc-500">
=======
                <div className="flex items-center justify-between">

                  <span className="text-zinc-400">
>>>>>>> 9198277 (n)
                    Amount
                  </span>

                  <span className="text-3xl font-black text-white">
                    ₹{Number(amount || 0).toLocaleString()}
                  </span>

                </div>

<<<<<<< HEAD
                <div className="flex items-center justify-between">

                  <span className="text-zinc-500">
                    Status
                  </span>

                  <span className="rounded-full bg-violet-600/20 px-3 py-1 text-sm font-semibold text-violet-400">
                    Ready to Transfer
                  </span>

                </div>

=======
>>>>>>> 9198277 (n)
              </div>

            </div>

<<<<<<< HEAD
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-violet-600 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
=======
            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
>>>>>>> 9198277 (n)
            >
              {loading
                ? "Processing Transfer..."
                : "Transfer Money"}
            </button>

          </form>

        </div>

      </motion.div>

    </Layout>
  );
}