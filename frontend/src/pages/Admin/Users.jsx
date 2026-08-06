import { useEffect, useState } from "react";
import { getUsers } from "../../services/adminService";
import AdminLayout from "../../layouts/AdminLayout";

export default function Users() {

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
      <AdminLayout>
        <h1 className="text-white text-2xl">Loading Users...</h1>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <h1 className="text-3xl font-bold text-white mb-8">
        Users
      </h1>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">

        <table className="w-full text-white">

          <thead className="bg-zinc-800">

            <tr>

              <th className="p-4 text-left">ID</th>

              <th className="p-4 text-left">Name</th>

              <th className="p-4 text-left">Email</th>

              <th className="p-4 text-left">Phone</th>

              <th className="p-4 text-left">Role</th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-t border-zinc-800 hover:bg-zinc-800"
              >

                <td className="p-4">{user.id}</td>

                <td className="p-4">{user.name}</td>

                <td className="p-4">{user.email}</td>

                <td className="p-4">{user.phone}</td>

                <td className="p-4">
                  {user.roles.join(", ")}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>
  );
}