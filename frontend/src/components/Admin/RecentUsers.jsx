const users = [
  { name: "Aryan", status: "Active" },
  { name: "Yash", status: "Active" },
  { name: "Sneha", status: "Blocked" },
];

export default function RecentUsers() {
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6">

      <h2 className="text-xl font-bold text-white mb-6">
        Recent Users
      </h2>

      <div className="space-y-4">

        {users.map((user) => (

          <div
            key={user.name}
            className="flex justify-between items-center border-b border-[#2A2A2A] pb-4"
          >
            <p className="text-white">
              {user.name}
            </p>

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                user.status === "Active"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {user.status}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}