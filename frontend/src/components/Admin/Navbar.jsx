import { FaBell, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className="h-20 bg-[#090909] border-b border-[#2A2A2A] px-8 flex justify-between items-center">

      <h1 className="text-3xl font-bold text-white">
        Dashboard
      </h1>

      <div className="flex items-center gap-8">

        <button className="relative">

          <FaBell
            size={22}
            className="text-[#C4B5FD]"
          />

          <span className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-red-500"></span>

        </button>

        <div className="flex items-center gap-3">

          <FaUserCircle
            size={36}
            className="text-[#C4B5FD]"
          />

          <div>

            <p className="font-semibold">
              Admin
            </p>

            <p className="text-xs text-[#8E8E93]">
              Super Admin
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}