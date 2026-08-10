import { useEffect, useMemo, useState } from "react";
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
import { formatDateTime } from "../../utils/formatters";
import { getTransactions } from "../../services/bankingService";
import authService from "../../services/authService";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      setLoading(true);

      const user = (await authService.getCurrentUser()).data;

      if (!user?.accountId) {
        setTransactions([]);
        return;
      }

      const response = await getTransactions(user.accountId);

      setTransactions(response.data || []);
    } catch (error) {
      console.error("Transaction loading failed:", error);
      toast.error(
        error.userMessage ||
        error.response?.data?.message ||
        "Unable to load transactions."
      );
    } finally {
      setLoading(false);
    }
  }

  const getType = (tx) => {
    const type = String(
      tx?.type ??
        tx?.transactionType ??
        tx?.transaction_type ??
        ""
    ).toUpperCase();

    if (
      type.includes("DEPOSIT") ||
      type.includes("CREDIT") ||
      type.includes("RECEIVE")
    ) {
      return "CREDIT";
    }

    return "DEBIT";
  };

  const getDescription = (tx) => {
    return (
      tx?.description ||
      tx?.remarks ||
      tx?.narration ||
      tx?.transactionType ||
      tx?.type ||
      "Bank transaction"
    );
  };

  const getDate = (tx) => {
    const value =
      tx?.createdAt ??
      tx?.transactionDate ??
      tx?.date ??
      tx?.timestamp;

    if (!value) return "—";

    return formatDateTime(value);
  };

  const formatMoney = (value) => {
    return Math.abs(Number(value || 0)).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  };

  const filteredTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return transactions;
    }

    return transactions.filter((tx) =>
      JSON.stringify(tx).toLowerCase().includes(term)
    );
  }, [transactions, search]);

  const creditTotal = useMemo(
    () =>
      transactions.reduce(
        (sum, tx) =>
          getType(tx) === "CREDIT"
            ? sum + Math.abs(Number(tx?.amount || 0))
            : sum,
        0
      ),
    [transactions]
  );

  const debitTotal = useMemo(
    () =>
      transactions.reduce(
        (sum, tx) =>
          getType(tx) === "DEBIT"
            ? sum + Math.abs(Number(tx?.amount || 0))
            : sum,
        0
      ),
    [transactions]
  );

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-violet-400">
            Banking
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-white">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Review your account activity and transaction history.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-[#0b0b0b] p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Total Transactions
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {transactions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-[#0b0b0b] p-5">
            <p className="text-xs uppercase tracking-wider text-emerald-400">
              Total Credits
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">
              {formatMoney(creditTotal)}
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-[#0b0b0b] p-5">
            <p className="text-xs uppercase tracking-wider text-red-400">
              Total Debits
            </p>
            <p className="mt-2 text-2xl font-semibold text-red-400">
              {formatMoney(debitTotal)}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-[#080808]">
          <div className="border-b border-zinc-800 p-5">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="w-full rounded-xl border border-zinc-800 bg-[#0d0d0d] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-violet-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-sm text-zinc-500">
              Loading transactions...
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-20 text-center">
              <FaHistory className="mx-auto text-3xl text-zinc-700" />

              <p className="mt-4 text-sm text-zinc-500">
                No transactions found.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-900">
              {filteredTransactions.map((tx, index) => {
                const type = getType(tx);
                const amount = Math.abs(Number(tx?.amount || 0));
                const isCredit = type === "CREDIT";

                return (
                  <motion.div
                    key={tx?.id ?? index}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                    className="flex items-center justify-between gap-4 p-5"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          isCredit
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {isCredit ? <FaArrowDown /> : <FaArrowUp />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">
                            {getDescription(tx)}
                          </p>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              isCredit
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {type}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-zinc-600">
                          {getDate(tx)}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`text-base font-semibold ${
                          isCredit
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {isCredit ? "+" : "-"}
                        {formatMoney(amount)}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        {String(tx?.status || "SUCCESS").toUpperCase()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
