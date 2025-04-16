const { validationResult } = require("express-validator");
const taskModel = require("../models/task.model");
const UserModel = require("../models/user.model");
const projectModel = require("../models/project.model");
const commentModel = require("../models/comment.model");
const createTask = async (req, res) => {
  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, assignedTo, projectId, priority } = req.body;

  // Check required fields
  if (!title || !description || !assignedTo || !projectId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Verify user exists
    const user = await UserModel.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ message: "Assigned user not found." });
    }

    // Verify project exists
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Create task
    const task = await taskModel.create({
      title,
      description,
      assignedTo,
      projectId,
      priority: priority || "medium",
    });

    return res.status(201).json({
      message: "Task created successfully.",
      task,
    });
  } catch (err) {
    console.error("Task creation error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { taskId } = req.params;
  let updateData;

  try {
    // First, find the task to verify permissions
    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Permission check: Admin can update anything, regular users can only update status if assigned
    if (req.user.role === "admin") {
      // Admins can update all fields
      updateData = req.body;
    } else if (task.assignedTo.toString() === req.user._id.toString()) {
      // Assigned users can only update status
      if (req.body.status) {
        updateData = { status: req.body.status };
      } else {
        return res
          .status(400)
          .json({ message: "Status field is required for updates." });
      }
    } else {
      // Not assigned and not admin
      return res
        .status(403)
        .json({ message: "You don't have permission to update this task." });
    }

    // Update the task
    const updatedTask = await taskModel.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    console.error("Task update error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const commentOnTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { comment } = req.body;
  const { taskId } = req.params;
  const commentedBy = req.user._id;

  try {
    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const newComment = await commentModel.create({
      comment,
      commentedBy,
      taskId, // Link comment to task
    });

    return res.status(201).json({
      message: "Comment added successfully.",
      comment: newComment,
    });
  } catch (err) {
    console.error("Comment creation error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Adding missing CRUD operations
const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskModel.find();
    return res.status(200).json({ tasks });
  } catch (err) {
    console.error("Get tasks error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    return res.status(200).json({ task });
  } catch (err) {
    console.error("Get task error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await taskModel.findByIdAndDelete(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (err) {
    console.error("Delete task error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getCommentsOfTask = async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    return res.status(400).json({ message: "taskID not found." });
  }
  try {
    const comments = await commentModel.find({ taskId });
    return res.status(200).json({ comments });
  } catch (err) {
    console.error("Get comments error:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTask,
  updateTask,
  commentOnTask,
  getAllTasks,
  getTaskById,
  deleteTask,
  getCommentsOfTask,
};
