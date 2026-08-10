import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaUniversity,
  FaPlus,
  FaCalendarAlt,
  FaPercent,
  FaMoneyBillWave,
  FaTimes,
} from "react-icons/fa";

import Layout from "../../layouts/Layout";
import authService from "../../services/authService";
import fdService from "../../services/fdService";

export default function FD() {
  const [user, setUser] = useState(null);
  const [fds, setFds] = useState([]);

  const [amount, setAmount] = useState("");
  const [tenureMonths, setTenureMonths] = useState(12);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [closingId, setClosingId] = useState(null);

  // =========================================================
  // LOAD USER + FDs
  // =========================================================

  const loadData = async () => {
    try {
      setLoading(true);

      const userResponse =
        await authService.getCurrentUser();

      const currentUser =
        userResponse.data;

      console.log(
        "FD: current user =",
        currentUser
      );

      if (!currentUser?.userId) {
        throw new Error(
          "Authenticated user ID not available"
        );
      }

      if (!currentUser?.accountId) {
        throw new Error(
          "Authenticated account ID not available"
        );
      }

      setUser(currentUser);

      const fdResponse =
        await fdService.getUserFDs(
          currentUser.userId
        );

      console.log(
        "FD: API response =",
        fdResponse
      );

      setFds(
        Array.isArray(fdResponse)
          ? fdResponse
          : []
      );

    } catch (error) {
      console.error(
        "FD LOAD ERROR:",
        error
      );

      setFds([]);

      toast.error(
        error.response?.data?.message ||
        error.userMessage ||
        error.message ||
        "Unable to load fixed deposits"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================================================
  // MONEY FORMAT
  // =========================================================

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
  // CREATE FD
  // =========================================================

  const handleCreateFD = async (event) => {
    event.preventDefault();

    if (!user?.accountId) {
      toast.error(
        "Account not available"
      );
      return;
    }

    const numericAmount =
      Number(amount);

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      toast.error(
        "Enter a valid investment amount"
      );
      return;
    }

    try {
      setCreating(true);

      await fdService.createFD({
        accountId: user.accountId,
        amount: numericAmount,
        tenureMonths,
      });

      toast.success(
        "Fixed Deposit created successfully"
      );

      setAmount("");

      await loadData();

    } catch (error) {
      console.error(
        "CREATE FD ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        error.userMessage ||
        "Unable to create fixed deposit"
      );

    } finally {
      setCreating(false);
    }
  };

  // =========================================================
  // CLOSE FD
  // =========================================================

  const handleCloseFD = async (fdId) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to close this fixed deposit?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setClosingId(fdId);

      await fdService.closeFD(fdId);

      toast.success(
        "Fixed Deposit closed successfully"
      );

      await loadData();

    } catch (error) {
      console.error(
        "CLOSE FD ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        error.userMessage ||
        "Unable to close fixed deposit"
      );

    } finally {
      setClosingId(null);
    }
  };

  // =========================================================
  // FD SUMMARY
  // =========================================================

  const activeFDs = useMemo(() => {
    return fds.filter(
      (fd) =>
        String(fd?.status).toUpperCase() ===
        "ACTIVE"
    );
  }, [fds]);

  const totalInvested = useMemo(() => {
    return activeFDs.reduce(
      (sum, fd) =>
        sum +
        Number(
          fd?.principalAmount || 0
        ),
      0
    );
  }, [activeFDs]);

  const maturityValue = useMemo(() => {
    return activeFDs.reduce(
      (sum, fd) =>
        sum +
        Number(
          fd?.maturityAmount || 0
        ),
      0
    );
  }, [activeFDs]);

  const expectedInterest =
    maturityValue -
    totalInvested;

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <Layout>

      <div className="min-h-full bg-[#050505] text-white">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="mb-8 flex flex-col gap-5 border-b border-zinc-900 pb-7 sm:flex-row sm:items-start sm:justify-between">

          <div>

            <p className="mb-2 text-xs font-medium uppercase tracking-[3px] text-violet-400">
              Investments
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Fixed Deposits
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Grow your savings with secure fixed deposits.
            </p>

          </div>

          {/* ACTIVE FD BADGE */}

          <div className="w-fit rounded-2xl border border-zinc-800 bg-[#101010] px-6 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <FaUniversity />
              </div>

              <div>

                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Active FDs
                </p>

                <p className="mt-1 text-2xl font-semibold text-emerald-400">
                  {activeFDs.length}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            SUMMARY CARDS
        ===================================================== */}

        <div className="grid gap-4 md:grid-cols-3">

          {/* TOTAL INVESTED */}

          <div className="rounded-3xl border border-zinc-800 bg-[#080808] p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-zinc-400">
                Total Invested
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <FaMoneyBillWave />
              </div>

            </div>

            <p className="mt-5 text-3xl font-semibold">
              {formatMoney(
                totalInvested
              )}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Across active fixed deposits
            </p>

          </div>

          {/* MATURITY VALUE */}

          <div className="rounded-3xl border border-zinc-800 bg-[#080808] p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-zinc-400">
                Maturity Value
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <FaCalendarAlt />
              </div>

            </div>

            <p className="mt-5 text-3xl font-semibold">
              {formatMoney(
                maturityValue
              )}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Expected value at maturity
            </p>

          </div>

          {/* INTEREST */}

          <div className="rounded-3xl border border-zinc-800 bg-[#080808] p-6">

            <div className="flex items-center justify-between">

              <p className="text-sm text-zinc-400">
                Expected Interest
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <FaPercent />
              </div>

            </div>

            <p className="mt-5 text-3xl font-semibold text-emerald-400">
              {formatMoney(
                expectedInterest
              )}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Estimated total interest
            </p>

          </div>

        </div>

        {/* =====================================================
            CREATE FD
        ===================================================== */}

        <section className="mt-5 rounded-3xl border border-zinc-800 bg-[#080808] p-6 sm:p-7">

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <FaPlus />
            </div>

            <div>

              <h2 className="text-xl font-semibold">
                Create a Fixed Deposit
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Choose an amount and tenure for your FD.
              </p>

            </div>

          </div>

          <form
            onSubmit={handleCreateFD}
            className="mt-7"
          >

            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr_auto] lg:items-end">

              {/* AMOUNT */}

              <div>

                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Investment Amount
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(event) =>
                      setAmount(
                        event.target.value
                      )
                    }
                    placeholder="Enter amount"
                    className="w-full rounded-xl border border-zinc-800 bg-[#101010] py-3.5 pl-9 pr-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-600 focus:ring-1 focus:ring-violet-600"
                  />

                </div>

              </div>

              {/* TENURE */}

              <div>

                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Tenure
                </label>

                <select
                  value={tenureMonths}
                  onChange={(event) =>
                    setTenureMonths(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-[#101010] px-4 py-3.5 text-white outline-none transition focus:border-violet-600 focus:ring-1 focus:ring-violet-600"
                >

                  <option value={12}>
                    12 Months
                  </option>

                  <option value={24}>
                    24 Months
                  </option>

                  <option value={36}>
                    36 Months
                  </option>

                  <option value={60}>
                    60 Months
                  </option>

                </select>

              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={creating}
                className="rounded-xl bg-violet-600 px-8 py-3.5 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating
                  ? "Creating..."
                  : "Create FD"}
              </button>

            </div>

          </form>

          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">

            <FaPercent />

            Current FD interest rate: 7.0% p.a.

          </div>

        </section>

        {/* =====================================================
            MY FIXED DEPOSITS
        ===================================================== */}

        <section className="mt-8">

          <div className="mb-5 flex items-end justify-between">

            <div>

              <p className="text-xs uppercase tracking-[2px] text-violet-400">
                Portfolio
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                My Fixed Deposits
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                View and manage your fixed deposits.
              </p>

            </div>

            <div className="hidden text-right sm:block">

              <p className="text-xs text-zinc-600">
                Total FDs
              </p>

              <p className="text-lg font-semibold">
                {fds.length}
              </p>

            </div>

          </div>

          {/* LOADING */}

          {loading && (

            <div className="rounded-3xl border border-zinc-800 bg-[#080808] p-10 text-center">

              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-violet-500" />

              <p className="text-sm text-zinc-500">
                Loading your fixed deposits...
              </p>

            </div>

          )}

          {/* EMPTY */}

          {!loading &&
            fds.length === 0 && (

              <div className="rounded-3xl border border-dashed border-zinc-800 bg-[#080808] p-12 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-xl text-violet-400">
                  <FaUniversity />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  No fixed deposits yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
                  Create your first fixed deposit above to start growing your savings.
                </p>

              </div>

            )}

          {/* FD CARDS */}

          {!loading &&
            fds.length > 0 && (

              <div className="grid gap-5 lg:grid-cols-2">

                {fds.map((fd) => {

                  const isActive =
                    String(fd?.status)
                      .toUpperCase() ===
                    "ACTIVE";

                  const interest =
                    Number(
                      fd?.maturityAmount || 0
                    ) -
                    Number(
                      fd?.principalAmount || 0
                    );

                  return (

                    <div
                      key={fd.id}
                      className="group rounded-3xl border border-zinc-800 bg-[#080808] p-6 transition hover:border-zinc-700"
                    >

                      {/* CARD HEADER */}

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                            <FaUniversity />
                          </div>

                          <div>

                            <p className="text-xs uppercase tracking-wider text-zinc-600">
                              Fixed Deposit
                            </p>

                            <h3 className="mt-1 text-lg font-semibold">
                              FD #{fd.id}
                            </h3>

                          </div>

                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-zinc-800 text-zinc-500"
                          }`}
                        >
                          {fd.status}
                        </span>

                      </div>

                      {/* PRINCIPAL */}

                      <div className="mt-6 rounded-2xl border border-zinc-800 bg-[#050505] p-5">

                        <p className="text-xs text-zinc-600">
                          Investment Amount
                        </p>

                        <p className="mt-2 text-2xl font-semibold">
                          {formatMoney(
                            fd.principalAmount
                          )}
                        </p>

                      </div>

                      {/* DETAILS */}

                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">

                          <p className="text-xs text-zinc-600">
                            Interest Rate
                          </p>

                          <p className="mt-2 font-semibold">
                            {fd.interestRate}%
                          </p>

                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">

                          <p className="text-xs text-zinc-600">
                            Tenure
                          </p>

                          <p className="mt-2 font-semibold">
                            {fd.tenureMonths} months
                          </p>

                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">

                          <p className="text-xs text-zinc-600">
                            Maturity Value
                          </p>

                          <p className="mt-2 font-semibold text-emerald-400">
                            {formatMoney(
                              fd.maturityAmount
                            )}
                          </p>

                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">

                          <p className="text-xs text-zinc-600">
                            Interest Earned
                          </p>

                          <p className="mt-2 font-semibold text-emerald-400">
                            {formatMoney(
                              interest
                            )}
                          </p>

                        </div>

                      </div>

                      {/* DATES */}

                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div>

                          <p className="text-xs text-zinc-600">
                            Start Date
                          </p>

                          <p className="mt-1 text-sm text-zinc-300">
                            {fd.startDate || "—"}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-zinc-600">
                            Maturity Date
                          </p>

                          <p className="mt-1 text-sm text-zinc-300">
                            {fd.maturityDate || "—"}
                          </p>

                        </div>

                      </div>

                      {/* CLOSE */}

                      {isActive && (

                        <button
                          type="button"
                          disabled={
                            closingId === fd.id
                          }
                          onClick={() =>
                            handleCloseFD(
                              fd.id
                            )
                          }
                          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-900/60 bg-red-500/5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          <FaTimes />

                          {closingId === fd.id
                            ? "Closing..."
                            : "Close Fixed Deposit"}

                        </button>

                      )}

                    </div>

                  );

                })}

              </div>

            )}

        </section>

      </div>

    </Layout>
  );
}
