import {
  FaHome,
  FaUsers,
  FaStore,
  FaMoneyCheckAlt,
  FaShieldAlt,
  FaBell,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/admin", icon: FaHome },
  { name: "Users", path: "/admin/users", icon: FaUsers },
  { name: "Merchants", path: "/admin/merchants", icon: FaStore },
  { name: "Transactions", path: "/admin/transactions", icon: FaMoneyCheckAlt },
  { name: "Fraud Detection", path: "/admin/fraud", icon: FaShieldAlt },
  { name: "Notifications", path: "/admin/notifications", icon: FaBell },
  { name: "Profile", path: "/admin/profile", icon: FaUser },
];

export default function Sidebar() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside className="w-72 bg-[#090909] border-r border-[#2A2A2A] flex flex-col text-white">

      {/* Logo */}
      <div className="px-8 py-8 border-b border-[#2A2A2A]">

        <h1 className="text-3xl font-black">
          FinPilot AI
        </h1>

        <p className="mt-2 text-sm text-[#8E8E93]">
          Admin Dashboard
        </p>

      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">

        <p className="px-4 mb-4 text-xs uppercase tracking-[4px] text-[#6B7280]">
          Navigation
        </p>

        <div className="space-y-2">

          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.name} to={item.path}>
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-[#7C5CFF] text-white"
                        : "hover:bg-[#1A1A1A]"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </div>
                )}
              </NavLink>
            );
          })}

        </div>

      </div>

      {/* Logout */}
      <div className="p-5 border-t border-[#2A2A2A]">

        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-500 rounded-2xl py-4 flex justify-center items-center gap-3 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </aside>
  );
}