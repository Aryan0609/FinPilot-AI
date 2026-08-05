import AdminLayout from "../../layouts/AdminLayout";

export default function Notifications() {

  const notifications = [
    "New User Registered",
    "Fraud Alert Generated",
    "Large Transaction Completed",
    "Merchant Verification Pending",
  ];

  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold text-white mb-8">
        Notifications
      </h1>

      <div className="space-y-5">

        {notifications.map((item, index) => (

          <div
            key={index}
            className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 hover:border-[#7C5CFF]"
          >

            <p className="text-white">
              {item}
            </p>

          </div>

        ))}

      </div>

    </AdminLayout>
  );
}