import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaHistory,
  FaSearch,
  FaArrowDown,
  FaArrowUp,
  FaExchangeAlt,
} from "react-icons/fa";

import Layout from "../../layouts/Layout";
import authService from "../../services/authService";
import { getTransactions } from "../../services/bankingService";

export default function Transactions() {

  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadTransactions();

  }, []);

  const loadTransactions = async () => {

    try {

      const user =
        (await authService.getCurrentUser()).data;

      const res =
        await getTransactions(user.accountId);

      const data = res.data || [];

      setTransactions(data);
      setFiltered(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

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

  return (

    <Layout>

      <motion.div
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

      </motion.div>

    </Layout>

  );

}