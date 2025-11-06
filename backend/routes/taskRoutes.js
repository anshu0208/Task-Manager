import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

// ✅ GET all tasks & CREATE new task
taskRouter
  .route("/")
  .get(authMiddleware, getTasks)     // Get all tasks of logged-in user
  .post(authMiddleware, createTask); // Create a new task

// ✅ GET, UPDATE, DELETE a specific task by ID
taskRouter
  .route("/:id")
  .get(authMiddleware, getTaskById)  // Get one task by ID
  .put(authMiddleware, updateTask)   // Update that task
  .delete(authMiddleware, deleteTask); // Delete that task

export default taskRouter;
