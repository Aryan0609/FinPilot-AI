const merchants = [
  { name: "Amazon", status: "Verified" },
  { name: "Flipkart", status: "Pending" },
  { name: "Reliance", status: "Verified" },
];

export default function RecentMerchants() {
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6">

      <h2 className="text-xl font-bold text-white mb-6">
        Recent Merchants
      </h2>

      <div className="space-y-4">

        {merchants.map((merchant) => (

          <div
            key={merchant.name}
            className="flex justify-between items-center border-b border-[#2A2A2A] pb-4"
          >
            <p className="text-white">
              {merchant.name}
            </p>

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                merchant.status === "Verified"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {merchant.status}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}