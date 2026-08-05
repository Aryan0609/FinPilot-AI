import Sidebar from "../components/Admin/Sidebar";
import Navbar from "../components/Admin/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#050505] text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}