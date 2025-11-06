import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CheckCircle2, Filter, Trophy, Plus } from "lucide-react";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";

const CompletedPage = () => {
  const { tasks = [], refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState("newest");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // ✅ Filter and sort completed tasks
  const completedTasks = useMemo(() => {
    const filtered = tasks.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "yes")
    );

    return filtered.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.updatedAt) - new Date(a.updatedAt);
      if (sortBy === "oldest") return new Date(a.updatedAt) - new Date(b.updatedAt);
      const order = { high: 3, medium: 2, low: 1 };
      return order[b.priority?.toLowerCase()] - order[a.priority?.toLowerCase()];
    });
  }, [tasks, sortBy]);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-green-600">
            <CheckCircle2 size={24} />
            Completed Tasks
          </h1>
          <p className="text-gray-500 text-sm">
            You’ve completed {completedTasks.length} task
            {completedTasks.length !== 1 && "s"} — keep up the great work! 🎉
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-3 sm:mt-0 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-3 mb-6">
        <Filter className="text-gray-600" size={16} />
        <span className="text-gray-600 text-sm font-medium">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">By Priority</option>
        </select>
      </div>

      {/* Completed Tasks List */}
      <div>
        {completedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Trophy size={48} className="text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-700">No Completed Tasks Yet</h3>
            <p className="text-gray-500 text-sm">
              Finish some tasks to see them here — you’re doing great!
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition"
            >
              Create New Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                showCompleteCheckbox
                onRefresh={refreshTasks}
                onEdit={() => {
                  setSelectedTask(task);
                  setShowModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
            refreshTasks();
          }}
          taskToEdit={selectedTask}
          onSave={refreshTasks}
        />
      )}
    </div>
  );
};

export default CompletedPage;
