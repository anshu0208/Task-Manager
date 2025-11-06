// src/components/TaskItem.jsx
import React, { useState } from "react";
import { CheckCircle2, MoreVertical, Trash2, Edit3 } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/tasks`
  : "http://localhost:5000/api/tasks";

const TaskItem = ({ task, onEdit, onRefresh, onLogout }) => {
  const [isCompleted, setIsCompleted] = useState(
    [true, 1, "yes"].includes(
      typeof task.completed === "string"
        ? task.completed.toLowerCase()
        : task.completed
    )
  );
  const [showMenu, setShowMenu] = useState(false);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const handleComplete = async () => {
    try {
      const newStatus = isCompleted ? "No" : "Yes";
      await axios.put(
        `${API_URL}/${task._id}`,
        { completed: newStatus },
        { headers: getAuthHeaders() }
      );
      setIsCompleted(!isCompleted);
      onRefresh?.();
    } catch (err) {
      console.error("Error updating task:", err);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${task._id}`, { headers: getAuthHeaders() });
      onRefresh?.();
      setShowMenu(false);
    } catch (err) {
      console.error("Error deleting task:", err);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const getPriorityStyle = (priority) => {
    switch ((priority || "").toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };

  return (
    <div className="relative flex justify-between items-center p-4 border rounded-xl shadow-sm bg-white hover:shadow-md transition-all duration-150">
      <div className="flex items-center gap-3">
        <button onClick={handleComplete} title="Mark Complete">
          <CheckCircle2
            size={20}
            className={`${
              isCompleted
                ? "text-green-500 fill-green-500"
                : "text-gray-300 hover:text-green-500"
            } transition`}
          />
        </button>

        <div>
          <h3
            className={`font-semibold text-base ${
              isCompleted ? "text-gray-400 line-through" : "text-gray-800"
            }`}
          >
            {task.title}
          </h3>
          <p className="text-sm text-gray-500">{task.description}</p>
          {task.dueDate && (
            <p className="text-xs text-gray-400 mt-1">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityStyle(
            task.priority
          )}`}
        >
          {task.priority}
        </span>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <MoreVertical size={18} className="text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-32 z-50">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit?.(task);
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit3 size={14} /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
