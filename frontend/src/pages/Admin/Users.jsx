import AdminLayout from "../../layouts/AdminLayout";
import UserTable from "../../components/Admin/UserTable";
import { FaUsers } from "react-icons/fa";

export default function Users() {
  return (
    <AdminLayout>

      <div className="space-y-8">

        {/* Header */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold text-white">
              Users
            </h1>

            <p className="text-[#8E8E93] mt-2">
              Manage registered users.
            </p>

          </div>

          <button className="bg-[#7C5CFF] hover:bg-[#A78BFA] px-6 py-3 rounded-2xl flex items-center gap-3 transition">

            <FaUsers />

            Add User

          </button>

        </div>

        {/* Search */}

        <div>

          <input
            type="text"
            placeholder="Search user..."
            className="w-full bg-[#141414] border border-[#2A2A2A] rounded-2xl px-5 py-4 text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#7C5CFF]"
          />

        </div>

        {/* Table */}

        <UserTable />

      </div>

    </AdminLayout>
  );
}