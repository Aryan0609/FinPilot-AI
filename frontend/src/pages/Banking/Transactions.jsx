import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaHistory,
  FaArrowDown,
  FaArrowUp,
  FaSearch,
  FaUniversity,
  FaExchangeAlt,
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

  /*
   * Determine transaction direction.
   *
   * FD_INVESTMENT:
   *   Money leaves account -> DEBIT
   *
   * FD_CLOSURE:
   *   Maturity money returns -> CREDIT
   *
   * For normal transactions we also support the signed amount
   * coming from the backend.
   */
  const getType = (tx) => {
    const type = String(
      tx?.transactionType ??
        tx?.type ??
        tx?.transaction_type ??
        ""
    ).toUpperCase();

    if (type === "FD_CLOSURE") {
      return "CREDIT";
    }

    if (type === "FD_INVESTMENT") {
      return "DEBIT";
    }

    if (
      type === "DEPOSIT" ||
      type === "TRANSFER_IN" ||
      type.includes("CREDIT") ||
      type.includes("RECEIVE")
    ) {
      return "CREDIT";
    }

    if (
      type === "WITHDRAW" ||
      type === "TRANSFER_OUT"
    ) {
      return "DEBIT";
    }

    /*
     * Fallback to actual signed amount.
     */
    const numericAmount = Number(tx?.amount || 0);

    return numericAmount >= 0 ? "CREDIT" : "DEBIT";
  };

  const getTransactionLabel = (tx) => {
    const type = String(
      tx?.transactionType ??
        tx?.type ??
        tx?.transaction_type ??
        ""
    ).toUpperCase();

    switch (type) {
      case "FD_INVESTMENT":
        return "Fixed Deposit Investment";

      case "FD_CLOSURE":
        return "Fixed Deposit Closure";

      case "DEPOSIT":
        return "Cash Deposit";

      case "WITHDRAW":
        return "Cash Withdrawal";

      case "TRANSFER_IN":
        return "Money Received";

      case "TRANSFER_OUT":
        return "Money Transfer";

      default:
        return (
          tx?.description ||
          tx?.remarks ||
          tx?.narration ||
          tx?.transactionType ||
          tx?.type ||
          "Bank Transaction"
        );
    }
  };

  const getDescription = (tx) => {
    const type = String(
      tx?.transactionType ??
        tx?.type ??
        tx?.transaction_type ??
        ""
    ).toUpperCase();

    /*
     * For FD transactions the generic backend description is useful,
     * but the UI should present a human-readable title.
     */
    if (type === "FD_INVESTMENT") {
      return "Fixed Deposit Investment";
    }

    if (type === "FD_CLOSURE") {
      return "Fixed Deposit Closure";
    }

    return (
      tx?.description ||
      tx?.remarks ||
      tx?.narration ||
      getTransactionLabel(tx)
    );
  };

  const getDate = (tx) => {
    const value =
      tx?.createdAt ??
      tx?.transactionDate ??
      tx?.date ??
      tx?.timestamp;

    if (!value) {
      return "—";
    }

    return formatDateTime(value);
  };

  const formatMoney = (value) => {
    return Math.abs(Number(value || 0)).toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    );
  };

  const getIcon = (tx, isCredit) => {
    const type = String(
      tx?.transactionType ??
        tx?.type ??
        tx?.transaction_type ??
        ""
    ).toUpperCase();

    if (
      type === "FD_INVESTMENT" ||
      type === "FD_CLOSURE"
    ) {
      return <FaUniversity />;
    }

    if (
      type === "TRANSFER_IN" ||
      type === "TRANSFER_OUT"
    ) {
      return <FaExchangeAlt />;
    }

    return isCredit ? <FaArrowDown /> : <FaArrowUp />;
  };

  const filteredTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return transactions;
    }

    return transactions.filter((tx) =>
      JSON.stringify(tx)
        .toLowerCase()
        .includes(term)
    );
  }, [transactions, search]);

  const creditTotal = useMemo(() => {
    return transactions.reduce((sum, tx) => {
      if (getType(tx) !== "CREDIT") {
        return sum;
      }

      return sum + Math.abs(Number(tx?.amount || 0));
    }, 0);
  }, [transactions]);

  const debitTotal = useMemo(() => {
    return transactions.reduce((sum, tx) => {
      if (getType(tx) !== "DEBIT") {
        return sum;
      }

      return sum + Math.abs(Number(tx?.amount || 0));
    }, 0);
  }, [transactions]);

  const fdInvestmentTotal = useMemo(() => {
    return transactions.reduce((sum, tx) => {
      const type = String(
        tx?.transactionType ??
          tx?.type ??
          tx?.transaction_type ??
          ""
      ).toUpperCase();

      if (type !== "FD_INVESTMENT") {
        return sum;
      }

      return sum + Math.abs(Number(tx?.amount || 0));
    }, 0);
  }, [transactions]);

  const fdClosureTotal = useMemo(() => {
    return transactions.reduce((sum, tx) => {
      const type = String(
        tx?.transactionType ??
          tx?.type ??
          tx?.transaction_type ??
          ""
      ).toUpperCase();

      if (type !== "FD_CLOSURE") {
        return sum;
      }

      return sum + Math.abs(Number(tx?.amount || 0));
    }, 0);
  }, [transactions]);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8">
          <p className="text-sm font-medium text-violet-400">
            Banking
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-white">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Review your account activity, investments and
            transaction history.
          </p>
        </div>

        {/* SUMMARY */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

          <div className="rounded-2xl border border-violet-500/20 bg-[#0b0b0b] p-5">
            <p className="text-xs uppercase tracking-wider text-violet-400">
              FD Invested
            </p>

            <p className="mt-2 text-2xl font-semibold text-violet-400">
              {formatMoney(fdInvestmentTotal)}
            </p>

            {fdClosureTotal > 0 && (
              <p className="mt-1 text-xs text-emerald-400">
                {formatMoney(fdClosureTotal)} returned
              </p>
            )}
          </div>
        </div>

        {/* SEARCH + TRANSACTIONS */}
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-[#080808]">
          <div className="border-b border-zinc-800 p-5">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
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
              {filteredTransactions.map(
                (tx, index) => {
                  const type = getType(tx);

                  const rawAmount = Number(
                    tx?.amount || 0
                  );

                  const amount = Math.abs(
                    rawAmount
                  );

                  const isCredit =
                    type === "CREDIT";

                  const transactionType =
                    String(
                      tx?.transactionType ??
                        tx?.type ??
                        tx?.transaction_type ??
                        "TRANSACTION"
                    ).toUpperCase();

                  return (
                    <motion.div
                      key={tx?.id ?? index}
                      whileHover={{
                        backgroundColor:
                          "rgba(255,255,255,0.02)",
                      }}
                      className="flex items-center justify-between gap-4 p-5"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        {/* ICON */}
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            isCredit
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {getIcon(
                            tx,
                            isCredit
                          )}
                        </div>

                        {/* DETAILS */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
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
                              {transactionType}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-zinc-600">
                            {getDate(tx)}
                          </p>

                          {tx?.referenceNumber && (
                            <p className="mt-1 text-[11px] text-zinc-700">
                              Ref:{" "}
                              {tx.referenceNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* AMOUNT */}
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
                          {String(
                            tx?.status ||
                              "SUCCESS"
                          ).toUpperCase()}
                        </p>
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
