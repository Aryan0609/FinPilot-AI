import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <section className="flex-1 overflow-y-auto bg-[#050505] px-8 py-8">

          <div className="mx-auto w-full max-w-7xl">

            {children}

          </div>

        </section>

      </main>

    </div>
  );
}