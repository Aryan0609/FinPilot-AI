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
    <aside className="flex h-screen w-72 flex-col border-r border-[#2A2A2A] bg-[#111111] text-white">

      {/* Logo */}
      <div className="border-b border-[#2A2A2A] px-8 py-8">
        <h1 className="text-3xl font-black">FinPilot AI</h1>
        <p className="mt-2 text-sm text-[#8E8E93]">
          Admin Dashboard
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <p className="mb-4 px-4 text-xs uppercase tracking-[4px] text-[#6B7280]">
          Navigation
        </p>

        <div className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.name} to={item.path}>
                {({ isActive }) => (
                  <div
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
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
      <div className="border-t border-[#2A2A2A] p-5">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 py-4 transition hover:bg-red-500"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

    </aside>
  );
}