import { useEffect, useState } from "react";
import { getRecentTransactions } from "../../services/adminService";

import { formatDateTime } from "../../utils/formatters";
export default function RecentTransactions() {

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const response = await getRecentTransactions();
            setTransactions(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6">

            <h2 className="text-xl font-bold text-white mb-6">
                Recent Transactions
            </h2>

            <div className="space-y-4">

                {transactions.map(tx => (

                    <div
                        key={tx.id}
                        className="flex justify-between items-center border-b border-[#2A2A2A] pb-3"
                    >

                        <div>

                            <p className="text-white font-medium">
                                {tx.transactionType}
                            </p>

                            <p className="text-sm text-gray-400">
                                {formatDateTime(tx.transactionDate)}
                            </p>

                        </div>

                        <span className="text-green-400 font-semibold">
                            ₹{tx.amount}
                        </span>

                    </div>

                ))}

            </div>

        </div>
    );
}