import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowDown,
  FaArrowUp,
  FaExchangeAlt,
  FaWallet,
  FaPlus,
  FaMinus,
  FaUniversity,
  FaChartLine,
  FaFileInvoiceDollar,
  FaEyeSlash,
} from "react-icons/fa";

import Layout from "../../layouts/Layout";

import { getGreeting, formatDateTime } from "../../utils/formatters";

import authService from "../../services/authService";

import {
  getAccount,
  getTransactions,
  getPortfolio,
} from "../../services/bankingService";

import fdService from "../../services/fdService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [fds, setFds] = useState([]);
  const [mutualFundPortfolio, setMutualFundPortfolio] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const userResponse = await authService.getCurrentUser();
      const currentUser = userResponse.data;

      setUser(currentUser);

      if (!currentUser?.accountId) {
        return;
      }

      const [accountResponse, transactionResponse, portfolioResponse] =
        await Promise.all([
          getAccount(currentUser.accountId),
          getTransactions(currentUser.accountId),
          getPortfolio(currentUser.accountId),
        ]);

      setAccount(accountResponse.data);
      setTransactions(transactionResponse.data || []);

      setMutualFundPortfolio(
        Array.isArray(portfolioResponse.data)
          ? portfolioResponse.data
          : []
      );

      if (currentUser?.userId) {
        try {
          const fdResponse = await fdService.getUserFDs(
            currentUser.userId
          );

          setFds(
            Array.isArray(fdResponse)
              ? fdResponse
              : []
          );
        } catch (fdError) {
          console.error(
            "Dashboard FD loading failed:",
            fdError
          );

          setFds([]);
        }
      }
    } catch (err) {
      console.error(
        "Dashboard loading failed:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // BASIC HELPERS
  // =========================================================

  const firstName =
    user?.name?.trim()?.split(" ")[0] || "there";

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    );
  };

  // =========================================================
  // TRANSACTION HELPERS
  // =========================================================

  const getAmount = (transaction) =>
    Number(
      transaction?.amount ??
        transaction?.transactionAmount ??
        transaction?.value ??
        0
    );

  const getTransactionType = (transaction) => {
    const raw = String(
      transaction?.transactionType ??
        transaction?.type ??
        transaction?.transaction_type ??
        ""
    ).toUpperCase();

    if (
      raw.includes("CREDIT") ||
      raw.includes("DEPOSIT") ||
      raw.includes("RECEIVED") ||
      raw.includes("SALARY") ||
      raw.includes("TRANSFER_IN") ||
      raw.includes("FD_CLOSURE") ||
      raw.includes("MF_REDEMPTION")
    ) {
      return "CREDIT";
    }

    return "DEBIT";
  };

  const getDescription = (transaction) => {
    return (
      transaction?.description ||
      transaction?.remarks ||
      transaction?.narration ||
      transaction?.recipientName ||
      transaction?.senderName ||
      transaction?.transactionType ||
      "Bank transaction"
    );
  };

  const getParty = (transaction) => {
    return (
      transaction?.recipientName ||
      transaction?.senderName ||
      transaction?.counterparty ||
      transaction?.merchantName ||
      transaction?.beneficiaryName ||
      ""
    );
  };

  const getCategory = (transaction) => {
    const type = String(
      transaction?.transactionType ??
        transaction?.type ??
        ""
    ).toUpperCase();

    if (
      type.includes("FD_INVESTMENT") ||
      type.includes("FD_CLOSURE")
    ) {
      return "Fixed Deposit";
    }

    if (
      type.includes("MF_INVESTMENT") ||
      type.includes("MF_REDEMPTION") ||
      type.includes("MUTUAL") ||
      type.includes("FUND")
    ) {
      return "Mutual Fund";
    }

    if (
      type.includes("TRANSFER") ||
      type.includes("SEND") ||
      type.includes("RECEIVE")
    ) {
      return "Transfer";
    }

    if (
      type.includes("DEPOSIT") ||
      type.includes("CREDIT")
    ) {
      return "Deposit";
    }

    if (
      type.includes("WITHDRAW") ||
      type.includes("DEBIT")
    ) {
      return "Banking";
    }

    return transaction?.category || "Banking";
  };

  const getDate = (transaction) => {
    const value =
      transaction?.transactionDate ??
      transaction?.createdAt ??
      transaction?.date ??
      transaction?.timestamp;

    if (!value) {
      return "—";
    }

    return formatDateTime(value);
  };

  const getStatus = (transaction) => {
    return String(
      transaction?.status ||
        transaction?.transactionStatus ||
        "SUCCESS"
    ).toUpperCase();
  };

  // =========================================================
  // TRANSACTION TOTALS
  // =========================================================

  const creditTotal = useMemo(() => {
    return transactions.reduce(
      (sum, transaction) => {
        if (
          getTransactionType(transaction) ===
          "CREDIT"
        ) {
          return (
            sum +
            Math.abs(getAmount(transaction))
          );
        }

        return sum;
      },
      0
    );
  }, [transactions]);

  const debitTotal = useMemo(() => {
    return transactions.reduce(
      (sum, transaction) => {
        if (
          getTransactionType(transaction) ===
          "DEBIT"
        ) {
          return (
            sum +
            Math.abs(getAmount(transaction))
          );
        }

        return sum;
      },
      0
    );
  }, [transactions]);

  const recentTransactions =
    transactions.slice(0, 6);

  // =========================================================
  // FIXED DEPOSITS
  // =========================================================

  const activeFDs = useMemo(() => {
    return fds.filter(
      (fd) =>
        String(fd?.status).toUpperCase() ===
        "ACTIVE"
    );
  }, [fds]);

  const fdTotalInvested = useMemo(() => {
    return activeFDs.reduce(
      (sum, fd) =>
        sum +
        Number(fd?.principalAmount || 0),
      0
    );
  }, [activeFDs]);

  const fdMaturityValue = useMemo(() => {
    return activeFDs.reduce(
      (sum, fd) =>
        sum +
        Number(fd?.maturityAmount || 0),
      0
    );
  }, [activeFDs]);

  const fdExpectedInterest =
    fdMaturityValue -
    fdTotalInvested;

  // =========================================================
  // MUTUAL FUND PORTFOLIO
  // =========================================================

  const mutualFundInvested = useMemo(() => {
    return mutualFundPortfolio.reduce(
      (sum, investment) =>
        sum + Number(investment?.investedAmount || 0),
      0
    );
  }, [mutualFundPortfolio]);

  const mutualFundCurrentValue = useMemo(() => {
    return mutualFundPortfolio.reduce(
      (sum, investment) =>
        sum + Number(investment?.currentValue || 0),
      0
    );
  }, [mutualFundPortfolio]);

  const mutualFundGain = useMemo(() => {
    return mutualFundPortfolio.reduce(
      (sum, investment) =>
        sum + Number(investment?.profitLoss || 0),
      0
    );
  }, [mutualFundPortfolio]);

  // =========================================================
  // CATEGORY ICON
  // =========================================================

  const getCategoryIcon = (category) => {
    const value =
      String(category).toLowerCase();

    if (
      value.includes("fixed")
    ) {
      return <FaUniversity />;
    }

    if (
      value.includes("mutual")
    ) {
      return <FaChartLine />;
    }

    if (
      value.includes("deposit")
    ) {
      return <FaWallet />;
    }

    return <FaExchangeAlt />;
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[75vh] items-center justify-center bg-[#050505] text-white">
          <div className="text-center">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-zinc-800 border-t-violet-500" />

            <p className="text-sm text-zinc-500">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <Layout>
      <div className="min-h-full bg-[#050505] text-white">

        {/* ===================================================
            HEADER
        =================================================== */}

        <section className="mb-8 flex flex-col gap-5 border-b border-zinc-900 pb-7 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[3px] text-violet-400">
              Financial Overview
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {getGreeting()}, {firstName}
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Here's what's happening with your money.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/profile")
            }
            className="flex w-fit items-center gap-3 rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2.5 transition hover:border-violet-700 hover:bg-zinc-900"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 font-semibold">
              {firstName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="text-left">
              <p className="text-xs text-zinc-500">
                Account
              </p>

              <p className="text-sm font-medium text-zinc-200">
                {user?.name || "User"}
              </p>
            </div>
          </button>
        </section>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">

          {/* =================================================
              YOUR INVESTMENTS
          ================================================= */}

          <section className="rounded-3xl border border-zinc-800 bg-[#080808] p-5 shadow-2xl sm:p-6">

            <div className="flex items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <FaChartLine />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[2px] text-violet-400">
                  Investments
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Your Investments
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Track your mutual funds and fixed deposits.
                </p>
              </div>
            </div>

            {/* =================================================
                INVESTMENT SUMMARY
            ================================================= */}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              {/* MUTUAL FUNDS */}

              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.03] p-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                      <FaChartLine />
                    </div>

                    <div>
                      <p className="font-medium">
                        Mutual Funds
                      </p>

                      <p className="text-xs text-zinc-600">
                        Your portfolio
                      </p>
                    </div>

                  </div>

                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-medium text-violet-400">
                    Investments
                  </span>

                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">

                  <div>
                    <p className="text-[11px] text-zinc-600">
                      Invested
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatMoney(
                        mutualFundInvested
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-zinc-600">
                      Current Value
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatMoney(
                        mutualFundCurrentValue
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-zinc-600">
                      Gain
                    </p>

                    <p
                      className={`mt-1 text-sm font-semibold ${
                        mutualFundGain >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {mutualFundGain >= 0
                        ? "+"
                        : "-"}
                      {formatMoney(
                        Math.abs(
                          mutualFundGain
                        )
                      )}
                    </p>
                  </div>

                </div>

                <button
                  onClick={() =>
                    navigate("/mutual-funds")
                  }
                  className="mt-5 w-full rounded-xl border border-zinc-800 py-3 text-sm text-zinc-400 transition hover:border-violet-700 hover:bg-violet-500/5 hover:text-white"
                >
                  View mutual funds →
                </button>

              </div>

              {/* FIXED DEPOSITS */}

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <FaUniversity />
                    </div>

                    <div>
                      <p className="font-medium">
                        Fixed Deposits
                      </p>

                      <p className="text-xs text-zinc-600">
                        {activeFDs.length} active
                      </p>
                    </div>

                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-400">
                    Secure
                  </span>

                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">

                  <div>
                    <p className="text-[11px] text-zinc-600">
                      Invested
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatMoney(
                        fdTotalInvested
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-zinc-600">
                      Maturity
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatMoney(
                        fdMaturityValue
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-zinc-600">
                      Interest
                    </p>

                    <p className="mt-1 text-sm font-semibold text-emerald-400">
                      +
                      {formatMoney(
                        fdExpectedInterest
                      )}
                    </p>
                  </div>

                </div>

                <button
                  onClick={() =>
                    navigate("/fixed-deposits")
                  }
                  className="mt-5 w-full rounded-xl border border-zinc-800 py-3 text-sm text-zinc-400 transition hover:border-emerald-700 hover:bg-emerald-500/5 hover:text-white"
                >
                  View fixed deposits →
                </button>

              </div>

            </div>

            {/* =================================================
                INVESTMENT CASH FLOW
            ================================================= */}

            <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950">

              <div className="grid grid-cols-1 divide-y divide-zinc-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0">

                <div className="p-5">

                  <p className="text-xs uppercase tracking-wider text-emerald-400">
                    Invested / Received
                  </p>

                  <p className="mt-2 text-xl font-semibold text-emerald-400">
                    +
                    {formatMoney(
                      creditTotal
                    )}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Money credited to your account
                  </p>

                </div>

                <div className="p-5">

                  <p className="text-xs uppercase tracking-wider text-red-400">
                    Debit Volume
                  </p>

                  <p className="mt-2 text-xl font-semibold text-red-400">
                    -
                    {formatMoney(
                      debitTotal
                    )}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Money leaving your account
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="space-y-5">

            {/* ACCOUNT STATS */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">

              {/* BALANCE MASKED */}

              <div className="rounded-3xl border border-zinc-800 bg-[#080808] p-5">

                <div className="flex items-center justify-between">

                  <p className="text-sm text-zinc-400">
                    Available Balance
                  </p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <FaEyeSlash />
                  </div>

                </div>

                <p className="mt-5 text-2xl font-semibold tracking-widest text-zinc-500">
                  ••••••••
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Enter banking PIN to view balance
                </p>

              </div>

              {/* DEBIT VOLUME */}

              <div className="rounded-3xl border border-red-500/10 bg-[#080808] p-5">

                <div className="flex items-center justify-between">

                  <p className="text-sm text-zinc-400">
                    Debit Volume
                  </p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <FaArrowUp />
                  </div>

                </div>

                <p className="mt-5 text-2xl font-semibold text-red-400">
                  -
                  {formatMoney(
                    debitTotal
                  )}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Across account activity
                </p>

              </div>

            </div>

            {/* QUICK ACTIONS */}

            <section className="rounded-3xl border border-zinc-800 bg-[#080808] p-5">

              <h2 className="text-lg font-semibold">
                Quick actions
              </h2>

              <p className="mt-1 text-sm text-zinc-600">
                Common banking operations
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">

                {[
                  {
                    title: "Transfer",
                    subtitle: "Send money",
                    path: "/transfer",
                    icon: <FaArrowUp />,
                  },
                  {
                    title: "Deposit",
                    subtitle: "Add money",
                    path: "/deposit",
                    icon: <FaPlus />,
                  },
                  {
                    title: "Withdraw",
                    subtitle: "Withdraw cash",
                    path: "/withdraw",
                    icon: <FaMinus />,
                  },
                  {
                    title: "Fixed Deposit",
                    subtitle: "Invest now",
                    path: "/fixed-deposits",
                    icon: <FaUniversity />,
                  },
                ].map((action) => (

                  <button
                    key={action.title}
                    onClick={() =>
                      navigate(action.path)
                    }
                    className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-violet-700 hover:bg-zinc-900"
                  >

                    <span className="text-lg text-violet-400 transition group-hover:text-violet-300">
                      {action.icon}
                    </span>

                    <p className="mt-4 text-sm font-medium">
                      {action.title}
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      {action.subtitle}
                    </p>

                  </button>

                ))}

              </div>

            </section>

          </div>

        </div>

        {/* ===================================================
            RECENT TRANSACTIONS
        =================================================== */}

        <section className="mt-5 overflow-hidden rounded-3xl border border-zinc-800 bg-[#080808] shadow-2xl">

          <div className="flex flex-col gap-4 border-b border-zinc-800 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <FaFileInvoiceDollar />
              </div>

              <div>

                <p className="text-xs uppercase tracking-[2px] text-zinc-600">
                  Activity
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Recent Transactions
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Your latest account activity
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                navigate("/transactions")
              }
              className="text-sm text-violet-400 transition hover:text-violet-300"
            >
              View all →
            </button>

          </div>

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full min-w-[850px]">

              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/70 text-left text-[11px] uppercase tracking-wider text-zinc-600">

                  <th className="px-6 py-4">
                    Date & Time
                  </th>

                  <th className="px-6 py-4">
                    Description
                  </th>

                  <th className="px-6 py-4">
                    Type
                  </th>

                  <th className="px-6 py-4">
                    Category
                  </th>

                  <th className="px-6 py-4 text-right">
                    Amount
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {recentTransactions.length === 0 ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-14 text-center text-sm text-zinc-600"
                    >
                      No transactions found.
                    </td>
                  </tr>

                ) : (

                  recentTransactions.map(
                    (transaction, index) => {

                      const type =
                        getTransactionType(
                          transaction
                        );

                      const amount =
                        Math.abs(
                          getAmount(
                            transaction
                          )
                        );

                      const description =
                        getDescription(
                          transaction
                        );

                      const party =
                        getParty(
                          transaction
                        );

                      const category =
                        getCategory(
                          transaction
                        );

                      const status =
                        getStatus(
                          transaction
                        );

                      const isCredit =
                        type === "CREDIT";

                      return (
                        <tr
                          key={
                            transaction?.id ??
                            transaction?.transactionId ??
                            index
                          }
                          className="border-b border-zinc-900 transition hover:bg-zinc-900/40"
                        >

                          <td className="whitespace-nowrap px-6 py-5 text-xs text-zinc-500">
                            {getDate(
                              transaction
                            )}
                          </td>

                          <td className="px-6 py-5">

                            <p className="text-sm font-medium text-zinc-200">
                              {description}
                            </p>

                            {party && (
                              <p className="mt-1 text-xs text-zinc-600">
                                {party}
                              </p>
                            )}

                          </td>

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                                isCredit
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {isCredit ? (
                                <FaArrowDown />
                              ) : (
                                <FaArrowUp />
                              )}

                              {isCredit
                                ? "Credit"
                                : "Debit"}
                            </span>

                          </td>

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-2 text-sm text-zinc-400">

                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-xs text-violet-400">
                                {getCategoryIcon(
                                  category
                                )}
                              </span>

                              {category}

                            </div>

                          </td>

                          <td
                            className={`whitespace-nowrap px-6 py-5 text-right text-sm font-semibold ${
                              isCredit
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {isCredit
                              ? "+"
                              : "-"}

                            {formatMoney(
                              amount
                            )}
                          </td>

                          <td className="px-6 py-5">

                            <span
                              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                                status === "SUCCESS" ||
                                status === "COMPLETED"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : status === "PENDING"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {status}
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* MOBILE */}

          <div className="divide-y divide-zinc-900 md:hidden">

            {recentTransactions.length === 0 ? (

              <div className="px-5 py-12 text-center text-sm text-zinc-600">
                No transactions found.
              </div>

            ) : (

              recentTransactions.map(
                (transaction, index) => {

                  const type =
                    getTransactionType(
                      transaction
                    );

                  const amount =
                    Math.abs(
                      getAmount(
                        transaction
                      )
                    );

                  const description =
                    getDescription(
                      transaction
                    );

                  const category =
                    getCategory(
                      transaction
                    );

                  const isCredit =
                    type === "CREDIT";

                  return (
                    <div
                      key={
                        transaction?.id ??
                        transaction?.transactionId ??
                        index
                      }
                      className="p-5"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex min-w-0 items-center gap-3">

                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              isCredit
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {isCredit ? (
                              <FaArrowDown />
                            ) : (
                              <FaArrowUp />
                            )}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-medium text-zinc-200">
                              {description}
                            </p>

                          </div>

                        </div>

                        <p
                          className={`whitespace-nowrap text-sm font-semibold ${
                            isCredit
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {isCredit
                            ? "+"
                            : "-"}

                          {formatMoney(
                            amount
                          )}
                        </p>

                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs">

                        <span className="flex items-center gap-2 text-zinc-500">
                          {getCategoryIcon(
                            category
                          )}

                          {category}
                        </span>

                        <span className="text-zinc-600">
                          {getDate(
                            transaction
                          )}
                        </span>

                      </div>

                    </div>
                  );
                }
              )
            )}

          </div>

          <div className="border-t border-zinc-800 p-4">

            <button
              onClick={() =>
                navigate("/transactions")
              }
              className="w-full rounded-xl border border-zinc-800 py-3 text-sm text-zinc-400 transition hover:border-violet-700 hover:bg-violet-500/5 hover:text-white"
            >
              View all transactions →
            </button>

          </div>

        </section>

      </div>
    </Layout>
  );
}
