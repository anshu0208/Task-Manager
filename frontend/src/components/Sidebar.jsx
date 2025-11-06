import React from "react";
import {
  X,
  Home,
  CheckSquare,
  User,
  BarChart3,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ user, tasks, mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.completed).length || 0;
  const productivity =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const username = user?.name || "User";
  const initial = username.charAt(0).toUpperCase();

  const menuItems = [
    { icon: <Home size={18} />, label: "Dashboard", path: "/dashboard" },
    { icon: <CheckSquare size={18} />, label: "Completed Tasks", path: "/complete" },
    { icon: <BarChart3 size={18} />, label: "Pending Tasks", path: "/pending" },
    { icon: <User size={18} />, label: "Profile", path: "/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* === OVERLAY FOR MOBILE === */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* === SIDEBAR === */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl border-r border-purple-100 flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-50
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* === TOP SECTION === */}
        <div className="p-6">
          {/* Mobile Close Button */}
          <button
            className="absolute top-4 right-4 md:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} className="text-gray-600" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
              {initial}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Hey, {username}
              </h2>
              <p className="text-sm text-gray-500">Welcome back 👋</p>
            </div>
          </div>

          {/* Productivity Bar */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Productivity
            </p>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600"
                style={{ width: `${productivity}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {productivity}% tasks completed
            </p>
          </div>

          {/* Menu Links */}
          <nav className="space-y-2">
            {menuItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-fuchsia-100 hover:to-purple-50"
                  }`
                }
                onClick={() => setMobileOpen(false)} // close menu on mobile
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* === BOTTOM LOGOUT SECTION === */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-600 hover:text-red-700 font-medium text-sm transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
