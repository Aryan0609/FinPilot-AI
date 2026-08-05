export default function TransactionChart() {
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-8">

      <h2 className="text-2xl font-bold text-white">
        Monthly Transaction Overview
      </h2>

      <p className="text-[#8E8E93] mt-2">
        Transaction Analytics
      </p>

      <div className="h-80 mt-8 rounded-2xl border border-dashed border-[#2A2A2A] flex items-center justify-center">

        <div className="text-center">

          <div className="text-7xl">
            📈
          </div>

          <p className="mt-5 text-[#8E8E93]">
            Transaction Chart
          </p>

        </div>

      </div>

    </div>
  );
}