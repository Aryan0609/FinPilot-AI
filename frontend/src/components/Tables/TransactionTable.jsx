import React from "react";

export default function TransactionTable({ transactions = [] }) {
  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "completed":
        return "bg-green-500/20 text-green-400";

      case "pending":
        return "bg-yellow-500/20 text-yellow-400";

      case "failed":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-zinc-700 text-zinc-300";
    }
  };

  if (!transactions.length) {
    return (
      <div className="py-16 text-center text-zinc-500">
        No Transactions Available
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-[#141414]">

      <table className="w-full">

        <thead className="border-b border-zinc-800 bg-[#1b1b1b]">

          <tr className="text-left text-zinc-400">

            <th className="px-6 py-4">ID</th>

            <th className="px-6 py-4">Type</th>

            <th className="px-6 py-4">Amount</th>

            <th className="px-6 py-4">Status</th>

          </tr>

        </thead>

        <tbody>

          {transactions.map((item, index) => (

            <tr
              key={item.id || index}
              className="border-b border-zinc-800 transition hover:bg-zinc-900"
            >

              <td className="px-6 py-5 text-zinc-300">
                {item.id}
              </td>

              <td className="px-6 py-5 font-medium text-white">
                {item.type}
              </td>

              <td
                className={`px-6 py-5 font-semibold ${
                  item.type?.toLowerCase() === "deposit"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                ₹{item.amount}
              </td>

              <td className="px-6 py-5">

                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}