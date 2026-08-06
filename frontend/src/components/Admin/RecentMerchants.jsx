import { useEffect, useState } from "react";
import { getRecentTransactions } from "../../services/adminService";

export default function RecentTransactions() {

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {

        const response = await getRecentTransactions();

        setTransactions(response.data);

    };

    return (

        <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6">

            <h2 className="text-xl font-bold text-white mb-6">
                Recent Transactions
            </h2>

            {transactions.map(tx => (

                <div
                    key={tx.id}
                    className="flex justify-between border-b border-zinc-800 py-3"
                >

                    <div>

                        <p className="text-white">
                            {tx.transactionType}
                        </p>

                        <p className="text-sm text-zinc-500">
                            {new Date(tx.transactionDate).toLocaleString()}
                        </p>

                    </div>

                    <span className="text-green-400">

                        ₹{tx.amount}

                    </span>

                </div>

            ))}

        </div>

    );
}