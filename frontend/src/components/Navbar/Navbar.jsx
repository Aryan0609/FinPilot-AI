import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 bg-[#090909]/95 px-8 py-5 backdrop-blur-lg">

      {/* Left */}

      <div>
        <p className="text-sm tracking-[4px] uppercase text-zinc-500">
          Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold text-white">
          Welcome Back 👋
        </h1>
      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <div className="hidden lg:flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">

          <FaSearch className="text-zinc-500" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-white placeholder:text-zinc-500 w-56"
          />

        </div>

        {/* Notification */}

        <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all duration-300 hover:border-violet-500 hover:text-white hover:bg-zinc-800">

          <FaBell size={18} />

        </button>

        {/* User */}

        <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2">

          <FaUserCircle
            size={42}
            className="text-violet-400"
          />

          <div>

            <p className="text-xs uppercase tracking-[3px] text-zinc-500">
              Logged In
            </p>

            <h3 className="font-semibold text-white">
              Welcome User
            </h3>

          </div>

        </div>

      </div>

    </nav>
  );
}