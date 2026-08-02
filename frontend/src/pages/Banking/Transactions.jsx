import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
<<<<<<< HEAD
  FaHistory,
  FaSearch,
  FaArrowDown,
  FaArrowUp,
  FaExchangeAlt,
=======
  FaExchangeAlt,
  FaArrowDown,
  FaArrowUp,
  FaWallet,
  FaSearch
>>>>>>> 9198277 (n)
} from "react-icons/fa";

import Layout from "../../layouts/Layout";
import authService from "../../services/authService";
import { getTransactions } from "../../services/bankingService";
import { toast } from "react-hot-toast";

export default function Transactions() {

  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {

    loadTransactions();

  }, []);

  const loadTransactions = async () => {

    try {

      const user =
        (await authService.getCurrentUser()).data;

<<<<<<< HEAD
      const res =
        await getTransactions(user.accountId);

      const data = res.data || [];

      setTransactions(data);
      setFiltered(data);

    } catch (err) {

      console.error(err);
=======
      const res = await getTransactions(user.accountId);

      setTransactions(res.data);

    } catch (err) {

      console.error(err);

      toast.error("Unable to load transactions.");
>>>>>>> 9198277 (n)

    } finally {

      setLoading(false);

    }

  };

<<<<<<< HEAD
  useEffect(() => {

    let data = [...transactions];

    if (filter !== "ALL") {

      data = data.filter(
        t =>
          t.type?.toUpperCase() === filter
      );

    }

    if (search.trim()) {

      data = data.filter(t =>

        JSON.stringify(t)
          .toLowerCase()
          .includes(search.toLowerCase())

      );

    }

    setFiltered(data);

  }, [transactions, search, filter]);

  const totalDeposits = useMemo(() =>

    transactions
      .filter(t => t.type === "DEPOSIT")
      .reduce((a, b) => a + Number(b.amount), 0)

  , [transactions]);

  const totalWithdrawals = useMemo(() =>

    transactions
      .filter(t => t.type === "WITHDRAW")
      .reduce((a, b) => a + Number(b.amount), 0)

  , [transactions]);

  const totalTransfers = useMemo(() =>

    transactions
      .filter(t => t.type === "TRANSFER")
      .reduce((a, b) => a + Number(b.amount), 0)

  , [transactions]);
=======
  const income = useMemo(() =>

    transactions
      .filter(t => t.type === "DEPOSIT")
      .reduce((sum, t) => sum + Number(t.amount), 0)

  , [transactions]);

  const expense = useMemo(() =>

    transactions
      .filter(t =>
        t.type === "WITHDRAW" ||
        t.type === "TRANSFER"
      )
      .reduce((sum, t) => sum + Number(t.amount), 0)

  , [transactions]);

  const filtered = transactions.filter(t =>
    t.description?.toLowerCase().includes(search.toLowerCase()) ||
    t.type?.toLowerCase().includes(search.toLowerCase())
  );
>>>>>>> 9198277 (n)

  return (

    <Layout>

      <motion.div
<<<<<<< HEAD
        initial={{opacity:0,y:12}}
        animate={{opacity:1,y:0}}
        className="space-y-8"
      >

        <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-8">

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-violet-600/20 p-4 text-2xl text-violet-400">

              <FaHistory />

            </div>

            <div>

              <h1 className="text-4xl font-black text-white">
                Transaction History
              </h1>

              <p className="mt-2 text-zinc-400">
                View every deposit, withdrawal and transfer.
              </p>

            </div>

          </div>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <div className="flex items-center gap-3 text-green-400">

              <FaArrowDown />

              Deposits

            </div>

            <h2 className="mt-4 text-3xl font-black text-white">

              ₹{totalDeposits.toLocaleString()}

            </h2>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <div className="flex items-center gap-3 text-red-400">

              <FaArrowUp />

              Withdrawals

            </div>

            <h2 className="mt-4 text-3xl font-black text-white">

              ₹{totalWithdrawals.toLocaleString()}

            </h2>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <div className="flex items-center gap-3 text-violet-400">

              <FaExchangeAlt />

              Transfers

            </div>

            <h2 className="mt-4 text-3xl font-black text-white">

              ₹{totalTransfers.toLocaleString()}

            </h2>

          </div>

        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

          <div className="flex flex-col gap-4 md:flex-row">

            <div className="relative flex-1">

              <FaSearch className="absolute left-4 top-4 text-zinc-500"/>

              <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] py-3 pl-12 pr-4 text-white outline-none focus:border-violet-500"
              />

            </div>

            <select
              value={filter}
              onChange={(e)=>setFilter(e.target.value)}
              className="rounded-2xl border border-zinc-700 bg-[#0d0d0d] px-5 text-white"
            >

              <option value="ALL">All</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAW">Withdraw</option>
              <option value="TRANSFER">Transfer</option>

            </select>

          </div>

        </div>

                <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-[#141414]">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-zinc-800 bg-[#181818]">

                <tr className="text-left text-sm uppercase tracking-wider text-zinc-500">

                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Date</th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="py-12 text-center text-zinc-500"
                    >
                      Loading Transactions...
                    </td>

                  </tr>

                ) : filtered.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="py-12 text-center text-zinc-500"
                    >
                      No transactions found.
                    </td>

                  </tr>

                ) : (

                  filtered.map((txn) => (

                    <tr
                      key={txn.transactionId}
                      className="border-b border-zinc-800 transition hover:bg-[#1b1b1b]"
                    >

                      <td className="px-6 py-5">

                        {txn.type === "DEPOSIT" && (

                          <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">

                            Deposit

                          </span>

                        )}

                        {txn.type === "WITHDRAW" && (

                          <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">

                            Withdraw

                          </span>

                        )}

                        {txn.type === "TRANSFER" && (

                          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-400">

                            Transfer

                          </span>

                        )}

                      </td>

                      <td className="px-6 py-5 font-bold text-white">

                        ₹{Number(txn.amount).toLocaleString()}

                      </td>

                      <td className="px-6 py-5 text-zinc-300">

                        {txn.description || "-"}

                      </td>

                      <td className="px-6 py-5 text-zinc-500">

                        {txn.timestamp
                          ? new Date(txn.timestamp).toLocaleString()
                          : "-"}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

=======
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        className="mx-auto max-w-6xl space-y-8"
      >

        {/* Header */}

        <div className="rounded-[32px] border border-zinc-800 bg-gradient-to-br from-[#171717] via-[#101010] to-[#27134a] p-8">

          <h1 className="text-4xl font-black text-white">
            Transaction History
          </h1>

          <p className="mt-2 text-zinc-400">
            View all your recent banking activities.
          </p>

        </div>

        {/* Summary */}

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <div className="flex items-center gap-3 text-green-400">

              <FaArrowDown />

              Income

            </div>

            <h2 className="mt-4 text-3xl font-black text-white">

              ₹{income.toLocaleString()}

            </h2>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <div className="flex items-center gap-3 text-red-400">

              <FaArrowUp />

              Expense

            </div>

            <h2 className="mt-4 text-3xl font-black text-white">

              ₹{expense.toLocaleString()}

            </h2>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <div className="flex items-center gap-3 text-violet-400">

              <FaWallet />

              Transactions

            </div>

            <h2 className="mt-4 text-3xl font-black text-white">

              {transactions.length}

            </h2>

          </div>

        </div>

        {/* Search */}

        <div className="relative">

          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"/>

          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full rounded-2xl border border-zinc-700 bg-[#141414] py-4 pl-14 pr-5 text-white outline-none focus:border-violet-500"
          />

        </div>

                {/* Transactions */}

        <div className="space-y-5">

          {loading ? (

            <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-12 text-center text-zinc-400">

              Loading Transactions...

            </div>

          ) : filtered.length === 0 ? (

            <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-12 text-center">

              <FaExchangeAlt className="mx-auto text-5xl text-zinc-600"/>

              <h2 className="mt-5 text-2xl font-bold text-white">
                No Transactions Found
              </h2>

              <p className="mt-2 text-zinc-500">
                Your banking activity will appear here.
              </p>

            </div>

          ) : (

            filtered.map((tx, index) => (

              <motion.div
                key={tx.id}
                initial={{opacity:0,y:15}}
                animate={{opacity:1,y:0}}
                transition={{delay:index*.05}}
                className="rounded-3xl border border-zinc-800 bg-[#141414] p-6 transition hover:border-violet-500"
              >

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  {/* Left */}

                  <div className="flex items-center gap-5">

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl

                      ${
                        tx.type === "DEPOSIT"

                          ? "bg-green-500/20 text-green-400"

                          : tx.type === "WITHDRAW"

                          ? "bg-red-500/20 text-red-400"

                          : "bg-violet-500/20 text-violet-400"
                      }`}
                    >

                      {tx.type === "DEPOSIT" ? (
                        <FaArrowDown/>
                      ) : tx.type === "WITHDRAW" ? (
                        <FaArrowUp/>
                      ) : (
                        <FaExchangeAlt/>
                      )}

                    </div>

                    <div>

                      <h3 className="text-xl font-bold text-white">

                        {tx.type}

                      </h3>

                      <p className="mt-1 text-zinc-400">

                        {tx.description || "No Description"}

                      </p>

                      <p className="mt-2 text-sm text-zinc-500">

                        {new Date(tx.createdAt).toLocaleString()}

                      </p>

                    </div>

                  </div>

                  {/* Right */}

                  <div className="text-right">

                    <h2
                      className={`text-3xl font-black

                      ${
                        tx.type === "DEPOSIT"

                          ? "text-green-400"

                          : tx.type === "WITHDRAW"

                          ? "text-red-400"

                          : "text-violet-400"
                      }`}
                    >

                      {tx.type === "DEPOSIT" ? "+" : "-"}

                      ₹{Number(tx.amount).toLocaleString()}

                    </h2>

                    <span
                      className={`mt-3 inline-flex rounded-full px-4 py-2 text-sm font-semibold

                      ${
                        tx.type === "DEPOSIT"

                          ? "bg-green-500/20 text-green-400"

                          : tx.type === "WITHDRAW"

                          ? "bg-red-500/20 text-red-400"

                          : "bg-violet-500/20 text-violet-400"
                      }`}
                    >

                      Successful

                    </span>

                  </div>

                </div>

              </motion.div>

            ))

          )}

        </div>

>>>>>>> 9198277 (n)
      </motion.div>

    </Layout>

  );

}