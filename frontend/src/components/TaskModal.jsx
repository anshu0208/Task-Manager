import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/tasks`
  : "http://localhost:5000/api/tasks";

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    completed: "No",
  });

  const [isSaving, setIsSaving] = useState(false);
  const titleRef = useRef(null);

  // ✅ Reset or fill form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setForm({
          title: taskToEdit.title || "",
          description: taskToEdit.description || "",
          dueDate: taskToEdit.dueDate
            ? new Date(taskToEdit.dueDate).toISOString().slice(0, 10)
            : "",
          priority: taskToEdit.priority || "Low",
          completed:
            taskToEdit.completed === true ||
            taskToEdit.completed === "Yes" ||
            taskToEdit.completed === 1
              ? "Yes"
              : "No",
        });
      } else {
        setForm({
          title: "",
          description: "",
          dueDate: "",
          priority: "Low",
          completed: "No",
        });
      }

      // Focus title input
      setTimeout(() => titleRef.current?.focus(), 150);
    }
  }, [isOpen, taskToEdit]);

  // ✅ Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Please enter a task title.");

    setIsSaving(true);
    try {
      const payload = {
        ...form,
        completed: form.completed === "Yes",
      };

      await onSave(
        taskToEdit
          ? { ...payload, _id: taskToEdit._id }
          : payload
      );
    } catch (error) {
      console.error("❌ Error saving task:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Close modal smoothly
  const handleClose = () => {
    if (isSaving) return; // prevent closing while saving
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 animate-fadeIn relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {taskToEdit ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              ref={titleRef}
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Enter task details..."
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Completed Status (only in edit mode) */}
          {taskToEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Completed
              </label>
              <select
                name="completed"
                value={form.completed}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : taskToEdit ? "Update" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
