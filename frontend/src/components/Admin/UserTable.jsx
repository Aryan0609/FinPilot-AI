import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const users = [
  {
    id: 1,
    name: "Aryan Mankar",
    email: "aryan@gmail.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Yash Baviskar",
    email: "yash@gmail.com",
    status: "Blocked",
  },
  {
    id: 3,
    name: "Sneha Patil",
    email: "sneha@gmail.com",
    status: "Active",
  },
];

export default function UserTable() {
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-[#1A1A1A] border-b border-[#2A2A2A]">

          <tr className="text-left">

            <th className="p-5 text-[#8E8E93]">ID</th>

            <th className="p-5 text-[#8E8E93]">Name</th>

            <th className="p-5 text-[#8E8E93]">Email</th>

            <th className="p-5 text-[#8E8E93]">Status</th>

            <th className="p-5 text-center text-[#8E8E93]">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr
              key={user.id}
              className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A] transition"
            >

              <td className="p-5 text-white">
                {user.id}
              </td>

              <td className="p-5 text-white">
                {user.name}
              </td>

              <td className="p-5 text-[#C4B5FD]">
                {user.email}
              </td>

              <td className="p-5">

                <span
                  className={`px-4 py-1 rounded-full text-sm

                  ${
                    user.status === "Active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {user.status}
                </span>

              </td>

              <td className="p-5">

                <div className="flex justify-center gap-4">

                  <button className="text-blue-400 hover:text-blue-300">
                    <FaEye />
                  </button>

                  <button className="text-yellow-400 hover:text-yellow-300">
                    <FaEdit />
                  </button>

                  <button className="text-red-400 hover:text-red-300">
                    <FaTrash />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}