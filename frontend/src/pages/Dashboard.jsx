// src/pages/Dashboard.jsx
import React, { useCallback, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  HomeIcon,
  Plus,
  ListTodo,
  CircleCheck,
  AlertTriangle,
  Gauge,
  Calendar,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import TaskModal from "../components/TaskModal";
import TaskItem from "../components/TaskItem";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/tasks`
  : "http://localhost:5000/api/tasks";

const Dashboard = () => {
  const { tasks, refreshTasks } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("all");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const stats = useMemo(() => {
    if (!tasks?.length)
      return { total: 0, low: 0, medium: 0, high: 0, completed: 0 };
    return {
      total: tasks.length,
      low: tasks.filter((t) => t.priority?.toLowerCase() === "low").length,
      medium: tasks.filter((t) => t.priority?.toLowerCase() === "medium").length,
      high: tasks.filter((t) => t.priority?.toLowerCase() === "high").length,
      completed: tasks.filter(
        (t) =>
          t.completed === true ||
          t.completed === 1 ||
          (typeof t.completed === "string" &&
            t.completed.toLowerCase() === "yes")
      ).length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      switch (filter) {
        case "today":
          return dueDate.toDateString() === today.toDateString();
        case "week":
          return dueDate >= today && dueDate <= nextWeek;
        case "high":
        case "medium":
        case "low":
          return task.priority?.toLowerCase() === filter;
        default:
          return true;
      }
    });
  }, [tasks, filter]);

  const handleTaskSave = useCallback(
    async (taskData) => {
      try {
        if (taskData._id) {
          await axios.put(`${API_URL}/${taskData._id}`, taskData, {
            headers: getAuthHeaders(),
          });
        } else {
          await axios.post(API_URL, taskData, {
            headers: getAuthHeaders(),
          });
        }
        refreshTasks();
        setShowModal(false);
        setSelectedTask(null);
      } catch (error) {
        console.error("❌ Error saving the task:", error);
      }
    },
    [refreshTasks]
  );

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <HomeIcon className="text-blue-600" />
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm">Manage your tasks efficiently</p>
        </div>

        <button
          onClick={() => {
            setSelectedTask(null);
            setShowModal(true);
          }}
          className="mt-3 sm:mt-0 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {/* ===== Stats ===== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Tasks" value={stats.total} icon={ListTodo} color="text-blue-500" />
        <StatCard title="Low Priority" value={stats.low} icon={Gauge} color="text-green-500" />
        <StatCard title="Medium Priority" value={stats.medium} icon={AlertTriangle} color="text-yellow-500" />
        <StatCard title="High Priority" value={stats.high} icon={AlertTriangle} color="text-red-500" />
        <StatCard title="Completed" value={stats.completed} icon={CircleCheck} color="text-purple-500" />
      </div>

      {/* ===== Filters ===== */}
      <div className="flex flex-wrap gap-3 mb-5">
        {["all", "today", "week", "high", "medium", "low"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm capitalize transition-all duration-150 ${
              filter === f
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f === "today" && <Calendar size={14} />}
            {f === "week" && <ChevronDown size={14} />}
            {["high", "medium", "low"].includes(f) && <AlertTriangle size={14} />}
            {f === "all" && <ListTodo size={14} />}
            {f}
          </button>
        ))}
      </div>

      {/* ===== Task List ===== */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No tasks found for this filter.</p>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={handleEditTask}
              onRefresh={refreshTasks}
            />
          ))
        )}
      </div>

      {/* ===== Modal ===== */}
      <TaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-3">
    <div className={`p-2 rounded-lg bg-gray-50 ${color}`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-xl font-bold ${color}`}>{value}</h2>
    </div>
  </div>
);

export default Dashboard;
