export default function FDCard({ fd, onClose }) {
  const principal = Number(
    fd.principalAmount || 0
  );

  const maturity = Number(
    fd.maturityAmount || 0
  );

  const interest = maturity - principal;

  return (
    <div className="bg-[#1d1d1f] rounded-2xl p-6 border border-gray-800">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h3 className="text-xl font-bold">
          Fixed Deposit #{fd.id}
        </h3>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            fd.status === "ACTIVE"
              ? "bg-green-500/20 text-green-400"
              : fd.status === "MATURED"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-gray-500/20 text-gray-400"
          }`}
        >
          {fd.status}
        </span>

      </div>

      {/* DETAILS */}

      <div className="space-y-4">

        <div className="flex justify-between">

          <span className="text-gray-400">
            Investment Amount
          </span>

          <span className="font-semibold text-white">
            ₹{principal.toFixed(2)}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-400">
            Interest Rate
          </span>

          <span className="text-white">
            {fd.interestRate}% p.a.
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-400">
            Tenure
          </span>

          <span className="text-white">
            {fd.tenureMonths} months
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-400">
            Start Date
          </span>

          <span className="text-white">
            {fd.startDate}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-400">
            Maturity Date
          </span>

          <span className="text-white">
            {fd.maturityDate}
          </span>

        </div>

        <div className="border-t border-gray-800 pt-4">

          <div className="flex justify-between">

            <span className="text-gray-400">
              Maturity Amount
            </span>

            <span className="text-xl font-bold text-green-400">
              ₹{maturity.toFixed(2)}
            </span>

          </div>

          <div className="flex justify-between mt-2">

            <span className="text-gray-500">
              Expected Interest
            </span>

            <span className="text-green-400">
              ₹{interest.toFixed(2)}
            </span>

          </div>

        </div>

      </div>

      {/* CLOSE BUTTON */}

      {fd.status === "ACTIVE" && (

        <button
          type="button"
          onClick={() => onClose(fd.id)}
          className="mt-6 w-full
                     bg-red-600
                     hover:bg-red-700
                     text-white
                     font-semibold
                     px-4 py-3
                     rounded-xl
                     transition"
        >
          Close FD
        </button>

      )}

    </div>
  );
}
