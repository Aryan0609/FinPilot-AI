import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#050505]">

      <Sidebar />

      <main className="min-w-0 flex-1 bg-[#050505]">

        <Navbar />

        <div className="px-4 py-5 sm:px-6 lg:px-8">
          {children}
        </div>

      </main>

    </div>
  );
}
