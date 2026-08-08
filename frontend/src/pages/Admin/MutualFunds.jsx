import { useEffect, useState } from "react";
import {
  FaChartLine,
  FaUsers,
  FaCoins,
  FaArrowUp,
  FaArrowDown,
  FaSyncAlt,
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaWallet,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

import {
  getMutualFunds,
  getMutualFundInvestments,
} from "../../services/adminService";

export default function MutualFunds() {
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [investments, setInvestments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState("");

  // =========================================================
  // LOAD MUTUAL FUNDS
  // =========================================================

  const loadFunds = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await getMutualFunds();

      setFunds(response.data || []);
    } catch (err) {
      console.error("Failed to load mutual funds:", err);
      setError("Unable to load mutual funds.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // INITIAL LOAD + AUTO REFRESH
  // =========================================================

  useEffect(() => {
    loadFunds();

    // Refresh NAV and fund statistics every 30 seconds.
    const interval = setInterval(() => {
      loadFunds(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // OPEN FUND DETAILS
  // =========================================================

  const openFundDetails = async (fund) => {
    try {
      setSelectedFund(fund);
      setInvestments([]);
      setDetailsError("");
      setDetailsLoading(true);

      const response = await getMutualFundInvestments(fund.id);

      setInvestments(response.data || []);
    } catch (err) {
      console.error(
        "Failed to load fund investments:",
        err
      );

      setDetailsError(
        "Unable to load investment transactions."
      );

      setInvestments([]);
    } finally {
      setDetailsLoading(false);
    }
  };

  // =========================================================
  // CLOSE DETAILS
  // =========================================================

  const closeFundDetails = () => {
    setSelectedFund(null);
    setInvestments([]);
    setDetailsError("");
  };

  // =========================================================
  // FORMATTERS
  // =========================================================

  const formatMoney = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  };

  const formatNumber = (value, digits = 4) => {
    return Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
    });
  };

  const formatDate = (value) => {
    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN");
  };

  // =========================================================
  // FUND TOTALS
  // =========================================================

  const totalInvested = funds.reduce(
    (sum, fund) =>
      sum + Number(fund.totalInvestment || 0),
    0
  );

  const totalCurrentValue = funds.reduce(
    (sum, fund) =>
      sum + Number(fund.totalCurrentValue || 0),
    0
  );

  const totalUnits = funds.reduce(
    (sum, fund) =>
      sum + Number(fund.totalUnits || 0),
    0
  );

  const totalInvestors = funds.reduce(
    (sum, fund) =>
      sum + Number(fund.investorCount || 0),
    0
  );

  const totalProfitLoss =
    totalCurrentValue - totalInvested;

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <FaSyncAlt
              className="mx-auto mb-4 animate-spin text-violet-400"
              size={30}
            />

            <p className="text-zinc-400">
              Loading mutual funds...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <p className="text-sm uppercase tracking-[4px] text-zinc-500">
              Investment Management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-white">
              Mutual Funds
            </h1>

            <p className="mt-2 text-zinc-400">
              Live fund NAV, investor activity and portfolio
              performance.
            </p>
          </div>

          <button
            onClick={() => loadFunds(false)}
            disabled={refreshing}
            className="flex items-center justify-center gap-3 rounded-2xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaSyncAlt
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="rounded-2xl border border-red-900 bg-red-950/40 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          {/* Funds */}

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-zinc-500">
                  Total Funds
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  {funds.length}
                </h2>
              </div>

              <div className="rounded-2xl bg-violet-600/20 p-4 text-violet-400">
                <FaChartLine size={22} />
              </div>

            </div>

          </div>

          {/* Investors */}

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-zinc-500">
                  Investors
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  {formatNumber(totalInvestors, 0)}
                </h2>
              </div>

              <div className="rounded-2xl bg-blue-600/20 p-4 text-blue-400">
                <FaUsers size={22} />
              </div>

            </div>

          </div>

          {/* Units */}

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-zinc-500">
                  Total Units
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  {formatNumber(totalUnits)}
                </h2>
              </div>

              <div className="rounded-2xl bg-emerald-600/20 p-4 text-emerald-400">
                <FaCoins size={22} />
              </div>

            </div>

          </div>

          {/* Portfolio */}

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-zinc-500">
                  Current Portfolio
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  {formatMoney(totalCurrentValue)}
                </h2>
              </div>

              <div
                className={`rounded-2xl p-4 ${
                  totalProfitLoss >= 0
                    ? "bg-green-600/20 text-green-400"
                    : "bg-red-600/20 text-red-400"
                }`}
              >
                {totalProfitLoss >= 0 ? (
                  <FaArrowUp size={22} />
                ) : (
                  <FaArrowDown size={22} />
                )}
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            INVESTMENT TOTAL
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <p className="text-sm text-zinc-500">
              Total Invested
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {formatMoney(totalInvested)}
            </p>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <p className="text-sm text-zinc-500">
              Current Value
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {formatMoney(totalCurrentValue)}
            </p>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <p className="text-sm text-zinc-500">
              Overall Profit / Loss
            </p>

            <p
              className={`mt-2 text-2xl font-bold ${
                totalProfitLoss >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {totalProfitLoss >= 0 ? "+" : ""}
              {formatMoney(totalProfitLoss)}
            </p>

          </div>

        </div>

        {/* =====================================================
            FUND TABLE
        ====================================================== */}

        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-[#141414]">

          <div className="border-b border-zinc-800 p-6">

            <h2 className="text-xl font-bold text-white">
              Fund Performance
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Click any fund to view individual investor
              transactions.
            </p>

          </div>

          {funds.length === 0 ? (
            <div className="p-10 text-center text-zinc-500">
              No mutual funds found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b border-zinc-800 bg-zinc-900/50">

                  <tr className="text-left text-sm text-zinc-500">

                    <th className="px-6 py-4">
                      Fund
                    </th>

                    <th className="px-6 py-4">
                      Type
                    </th>

                    <th className="px-6 py-4">
                      NAV
                    </th>

                    <th className="px-6 py-4">
                      Risk
                    </th>

                    <th className="px-6 py-4">
                      Annual Return
                    </th>

                    <th className="px-6 py-4">
                      Units Sold
                    </th>

                    <th className="px-6 py-4">
                      Investors
                    </th>

                    <th className="px-6 py-4">
                      Invested
                    </th>

                    <th className="px-6 py-4">
                      Current Value
                    </th>

                    <th className="px-6 py-4">
                      P/L
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {funds.map((fund) => {

                    const profitLoss =
                      Number(
                        fund.profitLoss || 0
                      );

                    return (
                      <tr
                        key={fund.id}
                        onClick={() =>
                          openFundDetails(fund)
                        }
                        className="cursor-pointer border-b border-zinc-800 transition hover:bg-zinc-800/50"
                      >

                        <td className="px-6 py-5">

                          <div className="font-semibold text-white">
                            {fund.fundName}
                          </div>

                          <div className="mt-1 text-xs text-zinc-500">
                            ID: {fund.id}
                          </div>

                        </td>

                        <td className="px-6 py-5 text-zinc-300">
                          {fund.fundType || "N/A"}
                        </td>

                        <td className="px-6 py-5">

                          <span className="font-bold text-violet-400">
                            {formatMoney(fund.nav)}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                            {fund.riskLevel || "N/A"}
                          </span>

                        </td>

                        <td className="px-6 py-5 text-zinc-300">
                          {fund.annualReturn ?? 0}%
                        </td>

                        <td className="px-6 py-5 text-white">
                          {formatNumber(fund.totalUnits)}
                        </td>

                        <td className="px-6 py-5 text-white">
                          {formatNumber(
                            fund.investorCount,
                            0
                          )}
                        </td>

                        <td className="px-6 py-5 text-zinc-300">
                          {formatMoney(
                            fund.totalInvestment
                          )}
                        </td>

                        <td className="px-6 py-5 text-white">
                          {formatMoney(
                            fund.totalCurrentValue
                          )}
                        </td>

                        <td
                          className={`px-6 py-5 font-semibold ${
                            profitLoss >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {profitLoss >= 0
                            ? "+"
                            : ""}
                          {formatMoney(profitLoss)}
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

      {/* =======================================================
          FUND DETAILS MODAL
      ======================================================== */}

      {selectedFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

          <div className="max-h-[92vh] w-full max-w-7xl overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-900 shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-zinc-800 p-6">

              <div>

                <p className="text-xs uppercase tracking-[3px] text-zinc-500">
                  Fund Details
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">
                  {selectedFund.fundName}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Fund ID: {selectedFund.id}
                </p>

              </div>

              <button
                onClick={closeFundDetails}
                className="rounded-xl p-3 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                <FaTimes size={20} />
              </button>

            </div>

            {/* Modal Body */}

            <div className="max-h-[calc(92vh-100px)] overflow-y-auto p-6">

              {/* Fund Information */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

                <div className="rounded-2xl bg-zinc-800 p-5">

                  <p className="text-xs text-zinc-500">
                    Current NAV
                  </p>

                  <p className="mt-2 text-2xl font-bold text-violet-400">
                    {formatMoney(selectedFund.nav)}
                  </p>

                </div>

                <div className="rounded-2xl bg-zinc-800 p-5">

                  <p className="text-xs text-zinc-500">
                    Units Sold
                  </p>

                  <p className="mt-2 text-2xl font-bold text-white">
                    {formatNumber(
                      selectedFund.totalUnits
                    )}
                  </p>

                </div>

                <div className="rounded-2xl bg-zinc-800 p-5">

                  <p className="text-xs text-zinc-500">
                    Investors
                  </p>

                  <p className="mt-2 text-2xl font-bold text-white">
                    {formatNumber(
                      selectedFund.investorCount,
                      0
                    )}
                  </p>

                </div>

                <div className="rounded-2xl bg-zinc-800 p-5">

                  <p className="text-xs text-zinc-500">
                    Invested
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {formatMoney(
                      selectedFund.totalInvestment
                    )}
                  </p>

                </div>

                <div className="rounded-2xl bg-zinc-800 p-5">

                  <p className="text-xs text-zinc-500">
                    Current Value
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {formatMoney(
                      selectedFund.totalCurrentValue
                    )}
                  </p>

                </div>

              </div>

              {/* Additional Fund Details */}

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">

                <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-5">

                  <p className="text-xs text-zinc-500">
                    Fund Type
                  </p>

                  <p className="mt-2 text-white">
                    {selectedFund.fundType || "N/A"}
                  </p>

                </div>

                <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-5">

                  <p className="text-xs text-zinc-500">
                    Risk Level
                  </p>

                  <p className="mt-2 text-white">
                    {selectedFund.riskLevel || "N/A"}
                  </p>

                </div>

                <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-5">

                  <p className="text-xs text-zinc-500">
                    Annual Return
                  </p>

                  <p className="mt-2 text-green-400">
                    {selectedFund.annualReturn ?? 0}%
                  </p>

                </div>

                <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-5">

                  <p className="text-xs text-zinc-500">
                    Total P/L
                  </p>

                  <p
                    className={`mt-2 ${
                      Number(
                        selectedFund.profitLoss || 0
                      ) >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {Number(
                      selectedFund.profitLoss || 0
                    ) >= 0
                      ? "+"
                      : ""}
                    {formatMoney(
                      selectedFund.profitLoss
                    )}
                  </p>

                </div>

              </div>

              {/* Transactions */}

              <div className="mt-8">

                <div className="mb-4 flex items-center justify-between">

                  <div>

                    <h3 className="text-xl font-bold text-white">
                      Investor Transactions
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Every investment made in this fund.
                    </p>

                  </div>

                  <div className="rounded-xl bg-zinc-800 px-4 py-2 text-sm text-zinc-300">
                    {investments.length} transactions
                  </div>

                </div>

                {detailsLoading ? (

                  <div className="flex items-center justify-center rounded-2xl border border-zinc-800 bg-[#141414] p-12">

                    <FaSyncAlt className="mr-3 animate-spin text-violet-400" />

                    <span className="text-zinc-400">
                      Loading transactions...
                    </span>

                  </div>

                ) : detailsError ? (

                  <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6 text-red-300">
                    {detailsError}
                  </div>

                ) : investments.length === 0 ? (

                  <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-10 text-center">

                    <FaCoins className="mx-auto mb-4 text-zinc-600" size={30} />

                    <p className="text-zinc-500">
                      No investments found for this fund.
                    </p>

                  </div>

                ) : (

                  <div className="overflow-x-auto rounded-2xl border border-zinc-800">

                    <table className="w-full">

                      <thead className="bg-zinc-800">

                        <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">

                          <th className="px-5 py-4">
                            User
                          </th>

                          <th className="px-5 py-4">
                            Account
                          </th>

                          <th className="px-5 py-4">
                            Units
                          </th>

                          <th className="px-5 py-4">
                            Purchase NAV
                          </th>

                          <th className="px-5 py-4">
                            Current NAV
                          </th>

                          <th className="px-5 py-4">
                            Investment
                          </th>

                          <th className="px-5 py-4">
                            Current Value
                          </th>

                          <th className="px-5 py-4">
                            P/L
                          </th>

                          <th className="px-5 py-4">
                            Return
                          </th>

                          <th className="px-5 py-4">
                            Date
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {investments.map(
                          (investment) => {

                            const profitLoss =
                              Number(
                                investment.profitLoss ||
                                  0
                              );

                            return (
                              <tr
                                key={
                                  investment.investmentId
                                }
                                className="border-t border-zinc-800 transition hover:bg-zinc-800/50"
                              >

                                {/* USER */}

                                <td className="px-5 py-5">

                                  <div className="flex items-center gap-3">

                                    <div className="rounded-xl bg-violet-600/20 p-3 text-violet-400">
                                      <FaUser />
                                    </div>

                                    <div>

                                      <p className="font-semibold text-white">
                                        {investment.userName ||
                                          "Unknown"}
                                      </p>

                                      <p className="text-xs text-zinc-500">
                                        User ID:{" "}
                                        {investment.userId}
                                      </p>

                                    </div>

                                  </div>

                                </td>

                                {/* ACCOUNT */}

                                <td className="px-5 py-5">

                                  <div className="flex items-center gap-2 text-zinc-300">

                                    <FaWallet className="text-zinc-500" />

                                    {investment.accountId}

                                  </div>

                                </td>

                                {/* UNITS */}

                                <td className="px-5 py-5">

                                  <span className="font-semibold text-white">
                                    {formatNumber(
                                      investment.units
                                    )}
                                  </span>

                                </td>

                                {/* PURCHASE NAV */}

                                <td className="px-5 py-5 text-zinc-300">
                                  {formatMoney(
                                    investment.purchaseNav
                                  )}
                                </td>

                                {/* CURRENT NAV */}

                                <td className="px-5 py-5">

                                  <span className="font-semibold text-violet-400">
                                    {formatMoney(
                                      investment.currentNav
                                    )}
                                  </span>

                                </td>

                                {/* INVESTMENT */}

                                <td className="px-5 py-5 text-zinc-300">
                                  {formatMoney(
                                    investment.investmentAmount
                                  )}
                                </td>

                                {/* CURRENT VALUE */}

                                <td className="px-5 py-5 font-semibold text-white">
                                  {formatMoney(
                                    investment.currentValue
                                  )}
                                </td>

                                {/* P/L */}

                                <td
                                  className={`px-5 py-5 font-semibold ${
                                    profitLoss >= 0
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">

                                    {profitLoss >= 0 ? (
                                      <FaArrowUp />
                                    ) : (
                                      <FaArrowDown />
                                    )}

                                    {profitLoss >= 0
                                      ? "+"
                                      : ""}

                                    {formatMoney(
                                      profitLoss
                                    )}

                                  </div>
                                </td>

                                {/* RETURN */}

                                <td
                                  className={`px-5 py-5 font-semibold ${
                                    Number(
                                      investment.returnPercentage ||
                                        0
                                    ) >= 0
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {Number(
                                    investment.returnPercentage ||
                                      0
                                  ) >= 0
                                    ? "+"
                                    : ""}
                                  {investment.returnPercentage ??
                                    0}
                                  %
                                </td>

                                {/* DATE */}

                                <td className="px-5 py-5 whitespace-nowrap text-sm text-zinc-400">

                                  <div className="flex items-center gap-2">

                                    <FaCalendarAlt />

                                    {formatDate(
                                      investment.investmentDate
                                    )}

                                  </div>

                                </td>

                              </tr>
                            );
                          }
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>
      )}

    </AdminLayout>
  );
}
