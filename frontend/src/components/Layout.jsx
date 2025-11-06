import React, { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { Circle, Clock, TrendingUp } from "lucide-react";

const Layout = ({ onLogout, user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const { data } = await axios.get("http://localhost:4000/api/tasks/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setTasks(arr);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load tasks.");
      if (err.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Stats
  const stats = useMemo(() => {
    const completedTasks = tasks.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "yes")
    ).length;

    const totalCount = tasks.length;
    const pendingCount = totalCount - completedTasks;
    const completionPercentage = totalCount
      ? Math.round((completedTasks / totalCount) * 100)
      : 0;

    return { totalCount, completedTasks, pendingCount, completionPercentage };
  }, [tasks]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 max-w-md shadow-sm">
          <p className="font-semibold text-lg mb-1">Error loading tasks</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-4 py-2 px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  // 🧩 Compact Stat Card component inside Layout
  const StatCard = ({ title, value, color }) => (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow transition-all">
      <div className={`p-2 rounded-lg bg-${color}-100`}>
        <Circle className={`w-4 h-4 text-${color}-600`} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar
        user={user}
        onLogout={onLogout}
        onMenuToggle={handleMenuToggle}
        isMenuOpen={isMenuOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed md:static z-40 inset-y-0 left-0 transform bg-white border-r border-gray-100 shadow-md md:shadow-sm w-64 transition-transform duration-300 ease-in-out
            ${isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <Sidebar
            user={user}
            tasks={tasks}
            mobileOpen={isMenuOpen}
            setMobileOpen={setIsMenuOpen}
          />
        </div>

        {/* Overlay for mobile */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:ml-0">
          <Outlet context={{ tasks, refreshTasks: fetchTasks }} />

          {/* ✅ Compact Stats Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-semibold text-gray-700">
                Task Overview
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard title="Total" value={stats.totalCount} color="purple" />
              <StatCard title="Completed" value={stats.completedTasks} color="green" />
              <StatCard title="Pending" value={stats.pendingCount} color="fuchsia" />
              <StatCard
                title="Progress"
                value={`${stats.completionPercentage}%`}
                color="indigo"
              />
            </div>

            <div className="mt-3">
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${stats.completionPercentage}%` }}
                />
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-semibold text-gray-700">
                Recent Activity
              </h3>
            </div>

            <div className="space-y-3">
              {tasks.slice(0, 3).map((task) => (
                <div
                  key={task._id || task.id}
                  className="p-3 flex justify-between items-center rounded-xl border border-gray-100 hover:bg-purple-50 transition-all"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString()
                        : "No Date"}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      task.completed
                        ? "bg-green-100 text-green-700"
                        : "bg-fuchsia-100 text-fuchsia-700"
                    }`}
                  >
                    {task.completed ? "Done" : "Pending"}
                  </span>
                </div>
              ))}

              {tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                  <Clock className="w-6 h-6 mb-2 text-gray-400" />
                  <p className="font-medium text-gray-700">No recent activity</p>
                  <p className="text-xs">Your tasks will appear here.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Layout;
