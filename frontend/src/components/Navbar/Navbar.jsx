import { FaBell } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 flex h-16 items-center justify-end border-b border-zinc-900 bg-[#050505]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">

      <div className="flex items-center gap-3">

        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-500 transition hover:border-violet-700 hover:text-white"
          aria-label="Notifications"
        >
          <FaBell size={15} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-500" />
        </button>

      </div>

    </nav>
  );
}
