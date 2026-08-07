import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getTransactions } from "../../services/adminService";

export default function Transactions() {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {

    try {

      const response = await getTransactions();

      setTransactions(response.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  return (

    <AdminLayout>

      <h1 className="text-4xl font-bold text-white mb-8">

        Transactions

      </h1>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#1A1A1A]">

            <tr>

              <th className="p-5 text-left text-[#8E8E93]">

                ID

              </th>

              <th className="p-5 text-left text-[#8E8E93]">

                Type

              </th>

              <th className="p-5 text-left text-[#8E8E93]">

                Amount

              </th>

              <th className="p-5 text-left text-[#8E8E93]">

                Date

              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="4"
                  className="p-8 text-center text-white"
                >

                  Loading...

                </td>

              </tr>

            ) : (

              transactions.map((tx) => (

                <tr
                  key={tx.id}
                  className="border-t border-[#2A2A2A] hover:bg-[#1A1A1A]"
                >

                  <td className="p-5 text-white">

                    {tx.id}

                  </td>

                  <td className="p-5 text-violet-400">

                    {tx.transactionType}

                  </td>

                  <td className="p-5 text-green-400">

                    ₹{tx.amount}

                  </td>

                  <td className="p-5 text-gray-400">

                    {new Date(tx.transactionDate).toLocaleString()}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </AdminLayout>

  );

}