import { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

import { getUsers } from "../../services/adminService";

export default function UserTable() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {

    try {

      const response = await getUsers();

      setUsers(response.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-10">

        <h2 className="text-white text-xl">
          Loading Users...
        </h2>

      </div>

    );

  }

  return (

    <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-[#1A1A1A] border-b border-[#2A2A2A]">

          <tr>

            <th className="p-5 text-left text-[#8E8E93]">
              ID
            </th>

            <th className="p-5 text-left text-[#8E8E93]">
              Name
            </th>

            <th className="p-5 text-left text-[#8E8E93]">
              Email
            </th>

            <th className="p-5 text-left text-[#8E8E93]">
              Phone
            </th>

            <th className="p-5 text-left text-[#8E8E93]">
              Role
            </th>

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

              <td className="p-5 text-white">

                {user.phone}

              </td>

              <td className="p-5">

                <span className="rounded-full bg-violet-500/20 px-4 py-1 text-violet-300">

                  {Array.from(user.roles).join(", ")}

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