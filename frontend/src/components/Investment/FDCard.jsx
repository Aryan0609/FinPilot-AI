export default function FDCard({ fd, onClose }) {
  return (
    <div className="bg-white p-4 rounded shadow">

      <h2 className="text-xl font-semibold mb-3">
        Fixed Deposit
      </h2>

      <div className="space-y-2">
        <p>
          <strong>Amount:</strong> ₹{fd.amount}
        </p>

        <p>
          <strong>Tenure:</strong> {fd.tenureMonths} months
        </p>

        {fd.interestRate !== undefined && (
          <p>
            <strong>Interest Rate:</strong> {fd.interestRate}%
          </p>
        )}

        {fd.status && (
          <p>
            <strong>Status:</strong> {fd.status}
          </p>
        )}
      </div>

      {fd.status !== "CLOSED" && (
        <button
          type="button"
          onClick={() => onClose(fd.id)}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Close FD
        </button>
      )}
    </div>
  );
}