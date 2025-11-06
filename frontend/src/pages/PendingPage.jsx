// src/pages/PendingPage.jsx
import { Clock, Filter, ListChecks, Plus } from "lucide-react";
import React, { useMemo, useState, useCallback } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/tasks`
  : "http://localhost:5000/api/tasks";

const PendingPage = () => {
  const { tasks = [], refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter(
      (t) =>
        !t.completed ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "no")
    );

    return filtered.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);

      if (sortBy === "priority") {
        const order = { high: 3, medium: 2, low: 1 };
        return order[b.priority?.toLowerCase()] - order[a.priority?.toLowerCase()];
      }
      return 0;
    });
  }, [tasks, sortBy]);

  const handleTaskSave = useCallback(
    async (taskData) => {
      try {
        if (taskData._id) {
          await axios.put(`${API_URL}/${taskData._id}`, taskData, { headers: getAuthHeaders() });
        } else {
          await axios.post(API_URL, taskData, { headers: getAuthHeaders() });
        }
        refreshTasks();
        setShowModal(false);
        setSelectedTask(null);
      } catch (error) {
        console.error("Error saving task:", error);
      }
    },
    [refreshTasks]
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <ListChecks className="text-purple-600" />
            Pending Tasks
          </h1>
          <p className="text-gray-500 text-sm">
            {sortedPendingTasks.length} task
            {sortedPendingTasks.length !== 1 && "s"} needing your attention
          </p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500" size={18} />
          <span className="text-gray-600 text-sm">Sort by:</span>
          <select
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">By Priority</option>
          </select>
        </div>

        {/* Add Task */}
        <button
          onClick={() => {
            setSelectedTask(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {/* Task List */}
      {sortedPendingTasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <div className="flex justify-center mb-3">
            <Clock className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold">All caught up 🎉</h3>
          <p className="text-gray-500 text-sm mb-4">No pending tasks found</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
          >
            Create New Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPendingTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={() => {
                setSelectedTask(task);
                setShowModal(true);
              }}
              onRefresh={refreshTasks}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <TaskModal
        isOpen={!!selectedTask || showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
          refreshTasks();
        }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  );
};

export default PendingPage;
