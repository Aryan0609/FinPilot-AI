import {
  FaHome,
  FaWallet,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaHistory,
  FaChartLine,
  FaRobot,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaUniversity,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: FaHome },
  { name: "Wallet", path: "/wallet", icon: FaWallet },
  { name: "Transfer", path: "/transfer", icon: FaExchangeAlt },
  { name: "Transactions", path: "/transactions", icon: FaHistory },
  { name: "Mutual Funds", path: "/mutual-funds", icon: FaChartLine },
  { name: "Fixed Deposits", path: "/fixed-deposits", icon: FaUniversity },
  { name: "AI Fraud Detection", path: "/fraud-detection", icon: FaRobot },
];

export default function Sidebar() {

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[250px] shrink-0 flex-col border-r border-zinc-900 bg-[#050505] text-white">

      {/* BRAND */}
      <div className="border-b border-zinc-900 px-6 py-6">

        <h1 className="text-2xl font-bold tracking-tight">
          Fin<span className="text-violet-500">Pilot</span>
        </h1>

        <p className="mt-1 text-[11px] uppercase tracking-[2px] text-zinc-600">
          AI banking
        </p>

      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">

        <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[2px] text-zinc-700">
          Workspace
        </p>

        <div className="space-y-1">

          {menu.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
              >
                {({ isActive }) => (
                  <div
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                      isActive
                        ? "bg-violet-500/10 text-white"
                        : "text-zinc-500 hover:bg-zinc-900/70 hover:text-zinc-200"
                    }`}
                  >

                    {isActive && (
                      <span className="absolute left-0 h-6 w-[2px] rounded-r-full bg-violet-500" />
                    )}

                    <Icon
                      size={15}
                      className={
                        isActive
                          ? "text-violet-400"
                          : "text-zinc-600 group-hover:text-zinc-300"
                      }
                    />

                    <span className="text-sm font-medium">
                      {item.name}
                    </span>

                  </div>
                )}
              </NavLink>
            );
          })}

        </div>

        <div className="my-6 border-t border-zinc-900" />

        <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[2px] text-zinc-700">
          Account
        </p>

        <NavLink to="/profile">
          {({ isActive }) => (
            <div
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                isActive
                  ? "bg-violet-500/10 text-white"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <FaUser
                size={15}
                className={isActive ? "text-violet-400" : "text-zinc-600"}
              />

              <span>Profile</span>
            </div>
          )}
        </NavLink>

      </nav>

      {/* FOOTER */}
      <div className="border-t border-zinc-900 p-4">

        <div className="mb-3 rounded-xl bg-zinc-900/50 px-3 py-3">
          <p className="text-[10px] uppercase tracking-[2px] text-zinc-700">
            FinPilot AI
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Secure intelligent banking
          </p>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 py-3 text-sm text-zinc-500 transition hover:border-red-900/70 hover:bg-red-950/20 hover:text-red-400"
        >
          <FaSignOutAlt size={14} />
          Logout
        </button>

      </div>

    </aside>
  );
}
