import { useState, useEffect } from "react";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaWallet,
  FaCreditCard,
} from "react-icons/fa";

import { formatDateTime } from "../../utils/formatters";

import { getUserTransactions } from "../../services/adminService";

export default function UserDetailsModal({
  open,
  onClose,
  user,
}) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (open && user) {
      loadTransactions();
    }
  }, [open, user]);

  const loadTransactions = async () => {
    try {
      const response = await getUserTransactions(user.id);
      setTransactions(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-zinc-700 bg-zinc-900 p-8">

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">
            User Details
          </h2>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            <FaTimes size={22} />
          </button>
        </div>

        <div className="space-y-6">

          <div className="flex items-center gap-4">
            <FaUser className="text-violet-400" />
            <div>
              <p className="text-zinc-400">Name</p>
              <h3 className="text-xl text-white">{user.name}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FaEnvelope className="text-blue-400" />
            <div>
              <p className="text-zinc-400">Email</p>
              <h3 className="text-white">{user.email}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FaPhone className="text-green-400" />
            <div>
              <p className="text-zinc-400">Phone</p>
              <h3 className="text-white">{user.phone}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FaCreditCard className="text-yellow-400" />
            <div>
              <p className="text-zinc-400">Account Number</p>
              <h3 className="text-white">{user.accountNumber}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FaWallet className="text-emerald-400" />
            <div>
              <p className="text-zinc-400">Wallet Balance</p>
              <h3 className="text-2xl font-bold text-green-400">
                ₹{user.balance}
              </h3>
            </div>
          </div>

          <div>
            <p className="mb-3 text-zinc-400">Roles</p>

            <div className="flex gap-3">
              {user.roles?.map((role) => (
                <span
                  key={role}
                  className="rounded-full bg-violet-600 px-4 py-2 text-white"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <hr className="border-zinc-700" />

          <h3 className="text-xl font-bold text-white">
            Recent Transactions
          </h3>

          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-zinc-500">
                No transactions found.
              </p>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between rounded-xl bg-zinc-800 p-4"
                >
                  <div>
                    <p className="text-white">
                      {tx.transactionType}
                    </p>

                    <p className="text-sm text-zinc-500">
                      {formatDateTime(tx.transactionDate)}
                    </p>
                  </div>

                  <div className="font-bold text-green-400">
                    ₹{tx.amount}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
