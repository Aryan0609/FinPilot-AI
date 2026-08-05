import AdminLayout from "../../layouts/AdminLayout";
import { FaUserCircle } from "react-icons/fa";

export default function Profile() {

  return (
    <AdminLayout>

      <div className="max-w-3xl mx-auto bg-[#141414] border border-[#2A2A2A] rounded-3xl p-10">

        <div className="flex flex-col items-center">

          <FaUserCircle
            size={120}
            className="text-[#C4B5FD]"
          />

          <h1 className="text-3xl font-bold text-white mt-6">
            Super Admin
          </h1>

          <p className="text-[#8E8E93]">
            admin@finpilot.ai
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div className="bg-[#1A1A1A] rounded-2xl p-5">

            <p className="text-[#8E8E93]">
              Role
            </p>

            <h3 className="text-white mt-2">
              System Administrator
            </h3>

          </div>

          <div className="bg-[#1A1A1A] rounded-2xl p-5">

            <p className="text-[#8E8E93]">
              Department
            </p>

            <h3 className="text-white mt-2">
              Operations
            </h3>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}