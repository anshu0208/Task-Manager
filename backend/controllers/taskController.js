import Task from "../models/taskModel.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncError.js";

// ✅ CREATE A NEW TASK
export const createTask = catchAsyncErrors(async (req, res, next) => {
  const { title, description, priority, dueDate, completed } = req.body;

  // 🧾 Validate required fields
  if (!title || !description) {
    return next(
      new ErrorHandler("Title and description are required fields.", 400)
    );
  }

  // 🗓 Validate due date format (optional)
  if (dueDate && isNaN(new Date(dueDate).getTime())) {
    return next(new ErrorHandler("Invalid due date format.", 400));
  }

  // ⚙️ Create new task instance
  const task = new Task({
    title,
    description,
    priority: priority || "Medium",
    dueDate: dueDate ? new Date(dueDate) : null,
    completed: completed === "Yes" || completed === true,
    owner: req.user.id,
  });

  // 💾 Save to DB
  const savedTask = await task.save();

  // ✅ Send success response
  res.status(201).json({
    success: true,
    message: "Task created successfully.",
    task: savedTask,
  });
});


     // GET ALL TASKS FOR LOGGED-IN USER
export const getTasks = catchAsyncErrors(async (req, res, next) => {
    const tasks = await Task.find({
        owner: req.user.id
    }).sort({
        createdAt: -1
    });
    res.json({
        success: true,
        tasks
    });
});


            // ✅ GET TASK BY ID (Only Owner Can Access)
export const getTaskById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // 🧾 Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new ErrorHandler("Invalid task ID format.", 400));
  }

  // 🔍 Find task owned by the authenticated user
  const task = await Task.findOne({ _id: id, owner: req.user.id });

  if (!task) {
    return next(new ErrorHandler("Task not found or unauthorized access.", 404));
  }

  // ✅ Send success response
  res.status(200).json({
    success: true,
    message: "Task fetched successfully.",
    task,
  });
});


      // UPDATE A TASK
export const updateTask = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const updates = { ...req.body };

  // 🧾 Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new ErrorHandler("Invalid task ID format.", 400));
  }

  // ✅ Normalize `completed` value (accepts "Yes" / true / false)
  if (updates.completed !== undefined) {
    updates.completed =
      updates.completed === "Yes" ||
      updates.completed === true ||
      updates.completed === "true";
  }

  // ⚙️ Update the task owned by the authenticated user
  const updatedTask = await Task.findOneAndUpdate(
    { _id: id, owner: req.user.id },
    updates,
    { new: true, runValidators: true }
  );

  if (!updatedTask) {
    return next(
      new ErrorHandler("Task not found or you are not authorized to update it.", 404)
    );
  }

  // ✅ Send success response
  res.status(200).json({
    success: true,
    message: "Task updated successfully.",
    task: updatedTask,
  });
});

        // DELETE A TASK
export const deleteTask = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // 🧾 Validate task ID format (prevents CastError)
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new ErrorHandler("Invalid task ID format.", 400));
  }

  // ⚙️ Delete only if the task belongs to the logged-in user
  const deletedTask = await Task.findOneAndDelete({
    _id: id,
    owner: req.user.id,
  });

  // ❌ Handle not found or unauthorized deletion
  if (!deletedTask) {
    return next(
      new ErrorHandler("Task not found or you are not authorized to delete it.", 404)
    );
  }

  // ✅ Success response
  res.status(200).json({
    success: true,
    message: "Task deleted successfully.",
  });
});

export const deleteTsfvdask = catchAsyncErrors(async (req, res, next) => {});