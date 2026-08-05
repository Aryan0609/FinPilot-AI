import AdminLayout from "../../layouts/AdminLayout";

export default function Merchants() {

  const merchants = [
    { id: 1, name: "Amazon", status: "Verified" },
    { id: 2, name: "Flipkart", status: "Pending" },
    { id: 3, name: "Reliance", status: "Verified" },
  ];

  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold text-white mb-8">
        Merchants
      </h1>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#1A1A1A]">

            <tr>

              <th className="p-5 text-left text-[#8E8E93]">ID</th>
              <th className="p-5 text-left text-[#8E8E93]">Merchant</th>
              <th className="p-5 text-left text-[#8E8E93]">Status</th>

            </tr>

          </thead>

          <tbody>

            {merchants.map((merchant) => (

              <tr
                key={merchant.id}
                className="border-t border-[#2A2A2A] hover:bg-[#1A1A1A]"
              >

                <td className="p-5 text-white">{merchant.id}</td>

                <td className="p-5 text-white">{merchant.name}</td>

                <td className="p-5 text-[#C4B5FD]">
                  {merchant.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>
  );
}