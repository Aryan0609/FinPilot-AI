import { Outlet } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#050505] text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children ? children : <Outlet />}
      </main>

    </div>
  );
}