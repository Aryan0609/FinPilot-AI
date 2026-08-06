import { useEffect, useMemo, useState } from "react";
import {
  FaUsers,
  FaSearch,
  FaUserShield,
  FaUser
} from "react-icons/fa";

import { getUsers } from "../../services/adminService";
import AdminLayout from "../../layouts/AdminLayout";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filteredUsers = useMemo(() => {

    return users.filter((user) => {

      const text = search.toLowerCase();

      return (
        user.name.toLowerCase().includes(text) ||
        user.email.toLowerCase().includes(text) ||
        user.phone.includes(search)
      );

    });

  }, [users, search]);

  if (loading) {

    return (

      <AdminLayout>

        <div className="flex h-96 items-center justify-center">

          <h1 className="text-2xl font-bold text-white">

            Loading Users...

          </h1>

        </div>

      </AdminLayout>

    );

  }

  return (

    <AdminLayout>

      <div className="space-y-8">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-white">

              Users

            </h1>

            <p className="mt-2 text-zinc-400">

              Manage all registered users.

            </p>

          </div>

          <div className="rounded-2xl bg-violet-600 px-6 py-4 shadow-lg">

            <p className="text-sm uppercase tracking-wider text-violet-100">

              Total Users

            </p>

            <h2 className="mt-1 text-3xl font-bold text-white">

              {users.length}

            </h2>

          </div>

        </div>

        {/* Search */}

        <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4">

          <FaSearch className="text-zinc-500" />

          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
          />

        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">

          <table className="w-full">

            <thead className="bg-zinc-800">

              <tr>

                <th className="p-5 text-left text-zinc-300">ID</th>

                <th className="p-5 text-left text-zinc-300">Name</th>

                <th className="p-5 text-left text-zinc-300">Email</th>

                <th className="p-5 text-left text-zinc-300">Phone</th>

                <th className="p-5 text-left text-zinc-300">Role</th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="py-12 text-center text-zinc-500"
                  >

                    No users found.

                  </td>

                </tr>

              ) : (

                filteredUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="border-t border-zinc-800 transition hover:bg-zinc-800"
                  >

                    <td className="p-5 text-white">

                      #{user.id}

                    </td>

                    <td className="p-5 font-medium text-white">

                      {user.name}

                    </td>

                    <td className="p-5 text-violet-300">

                      {user.email}

                    </td>

                    <td className="p-5 text-white">

                      {user.phone}

                    </td>

                    <td className="p-5">

                      {user.roles.includes("ROLE_ADMIN") ? (

                        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2 text-red-400">

                          <FaUserShield />

                          Admin

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-green-400">

                          <FaUser />

                          User

                        </span>

                      )}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>

  );

}