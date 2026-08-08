import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaHistory,
  FaArrowDown,
  FaArrowUp,
  FaExchangeAlt,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import Layout from "../../layouts/Layout";
import { getTransactions } from "../../services/bankingService";
import authService from "../../services/authService";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();

    setFiltered(
      transactions.filter((tx) =>
        JSON.stringify(tx).toLowerCase().includes(term)
      )
    );
  }, [search, transactions]);

  const loadTransactions = async () => {
    try {
      const user = (await authService.getCurrentUser()).data;

      const res = await getTransactions(user.accountId);

      setTransactions(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      toast.error("Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "DEPOSIT":
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
            <FaArrowDown />
          </div>
        );

      case "WITHDRAW":
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
            <FaArrowUp />
          </div>
        );

      default:
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
            <FaExchangeAlt />
          </div>
        );
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-4xl"
      >
        <div className="overflow-hidden rounded-[32px] border border-zinc-800 bg-gradient-to-br from-[#171717] via-[#101010] to-[#27134a]">

          {/* Header */}

          <div className="border-b border-zinc-800 p-8">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/20 text-2xl text-violet-400">

                <FaHistory />

              </div>

              <div>

                <h1 className="text-4xl font-black text-white">
                  Transaction History
                </h1>

                <p className="mt-2 text-zinc-400">
                  View all your banking activities.
                </p>

              </div>

            </div>

          </div>

          <div className="p-8">

            {/* Search */}

            <div className="relative mb-8">

              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" />

              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] py-4 pl-14 pr-5 text-white outline-none transition focus:border-violet-500"
              />

            </div>

            {loading ? (
              <div className="py-20 text-center text-zinc-400">
                Loading Transactions...
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-zinc-700 bg-[#111] p-12 text-center text-zinc-500">
                No Transactions Found
              </div>
            ) : (
              <div className="space-y-5">

                {filtered.map((tx) => (

                  <motion.div
                    key={tx.id}
                    whileHover={{ scale: 1.01 }}
                    className="rounded-2xl border border-zinc-700 bg-[#111111] p-6 transition"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-4">

                        {getIcon(tx.type)}

                        <div>

                          <h3 className="text-lg font-bold text-white">
                            {tx.type}
                          </h3>

                          <p className="text-sm text-zinc-500">
                            {tx.description || "No Description"}
                          </p>

                        </div>

                      </div>

                      <div className="text-right">

                        <p className="text-2xl font-black text-white">
                          ₹{Number(tx.amount).toLocaleString()}
                        </p>

                        <p className="text-sm text-zinc-500">
                          {tx.createdAt
                            ? new Date(tx.createdAt).toLocaleString()
                            : ""}
                        </p>

                      </div>

                    </div>

                  </motion.div>

                ))}

              </div>
            )}

          </div>

        </div>
      </motion.div>
    </Layout>
  );
}