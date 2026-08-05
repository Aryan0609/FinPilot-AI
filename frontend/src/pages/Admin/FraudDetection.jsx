import AdminLayout from "../../layouts/AdminLayout";

export default function FraudDetection() {

  const frauds = [
    {
      id: 1,
      account: "100245",
      amount: "₹90,000",
      risk: "High",
    },
    {
      id: 2,
      account: "100310",
      amount: "₹25,000",
      risk: "Medium",
    },
  ];

  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold text-white mb-8">
        Fraud Detection
      </h1>

      <div className="grid gap-6">

        {frauds.map((item) => (

          <div
            key={item.id}
            className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6 hover:border-[#E24A63]"
          >

            <h2 className="text-xl font-bold text-white">
              Account #{item.account}
            </h2>

            <p className="text-[#8E8E93] mt-2">
              Amount : {item.amount}
            </p>

            <span className="inline-block mt-4 px-4 py-2 rounded-full bg-red-500/20 text-red-400">
              {item.risk} Risk
            </span>

          </div>

        ))}

      </div>

    </AdminLayout>
  );
}