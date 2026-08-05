import AdminLayout from "../../layouts/AdminLayout";

export default function Transactions() {

  const transactions = [
    { id: 101, amount: "₹12,000", status: "Completed" },
    { id: 102, amount: "₹5,500", status: "Pending" },
    { id: 103, amount: "₹18,400", status: "Completed" },
  ];

  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold text-white mb-8">
        Transactions
      </h1>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#1A1A1A]">

            <tr>

              <th className="p-5 text-left text-[#8E8E93]">Transaction ID</th>
              <th className="p-5 text-left text-[#8E8E93]">Amount</th>
              <th className="p-5 text-left text-[#8E8E93]">Status</th>

            </tr>

          </thead>

          <tbody>

            {transactions.map((tx) => (

              <tr
                key={tx.id}
                className="border-t border-[#2A2A2A] hover:bg-[#1A1A1A]"
              >

                <td className="p-5 text-white">{tx.id}</td>

                <td className="p-5 text-white">{tx.amount}</td>

                <td className="p-5 text-green-400">{tx.status}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>
  );
}