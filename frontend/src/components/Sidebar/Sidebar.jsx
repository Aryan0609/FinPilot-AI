import {
  FaHome,
  FaWallet,
  FaMoneyCheckAlt,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaHistory,
  FaRobot,
  FaBell,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/", icon: FaHome },
  { name: "Wallet", path: "/wallet", icon: FaWallet },
  { name: "Deposit", path: "/deposit", icon: FaMoneyBillWave },
  { name: "Withdraw", path: "/withdraw", icon: FaMoneyCheckAlt },
  { name: "Transfer", path: "/transfer", icon: FaExchangeAlt },
  { name: "Transactions", path: "/transactions", icon: FaHistory },
  { name: "AI Services", path: "/fraud", icon: FaRobot },
  { name: "Notifications", path: "/notifications", icon: FaBell },
  { name: "Profile", path: "/profile", icon: FaUser },
];

export default function Sidebar() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside className="flex h-screen w-72 flex-col bg-[#090909] border-r border-zinc-800 text-white sticky top-0">

      {/* Logo */}
      <div className="px-8 py-8 border-b border-zinc-800">

        <h1 className="text-3xl font-black tracking-wide">
          FinPilot
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          AI Powered Banking
        </p>

      </div>

      {/* Navigation */}

      <div className="flex-1 px-4 py-6 overflow-y-auto">

        <p className="px-4 mb-4 text-xs uppercase tracking-[4px] text-zinc-600">
          Navigation
        </p>

        <div className="space-y-2">

          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.name} to={item.path}>
                {({ isActive }) => (
                  <div
                    className={`group relative flex items-center gap-4 rounded-2xl px-5 py-4 cursor-pointer transition-all duration-300

                    ${
                      isActive
                        ? "bg-gradient-to-r from-violet-700 to-violet-600 shadow-lg shadow-violet-900/30"
                        : "hover:bg-zinc-900"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 h-8 w-1 rounded-r-full bg-white" />
                    )}

                    <Icon
                      size={18}
                      className={`transition-all duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-zinc-500 group-hover:text-violet-400"
                      }`}
                    />

                    <span
                      className={`font-medium tracking-wide transition-all ${
                        isActive
                          ? "text-white"
                          : "text-zinc-400 group-hover:text-white"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          })}

        </div>
      </div>

      {/* Bottom */}

      <div className="border-t border-zinc-800 p-5">

        <div className="mb-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">

          <p className="text-xs uppercase tracking-[3px] text-zinc-500">
            FinPilot AI
          </p>

          <h3 className="mt-2 text-lg font-semibold">
            Smart Banking
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            Secure • Intelligent • Fast
          </p>

        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 py-4 font-semibold transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-900/30"
        >
          <FaSignOutAlt size={18} />
          Logout
        </button>

      </div>

    </aside>
  );
}