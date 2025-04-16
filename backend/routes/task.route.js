const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/auth.middleware");
const { createTask, updateTask, commentOnTask, getCommentsOfTask } = require("../controllers/task.controller");
const {body,param} = require("express-validator");

router.post(
    "/",
    authUser.authenticate,
    authUser.checkRole(["admin"]),
    [
        body("title").notEmpty().withMessage("Title is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("assignedTo").notEmpty().withMessage("Assigned user is required"),
        body("projectId").notEmpty().withMessage("Project ID is required"),
        body("priority").notEmpty().withMessage("Priority is required")
    ],
    createTask
);
router.patch(
    "/:taskId",
    authUser.authenticate,
    [
        param("taskId").notEmpty().withMessage("Task ID is required"),
        body("status").notEmpty().withMessage("Status is required")
    ],
    updateTask
);

router.post("/:taskId/comment",authUser.authenticate,[body("comment").notEmpty().withMessage("comment is required")],commentOnTask);

router.get("/:taskId/comments",authUser.authenticate,getCommentsOfTask);

module.exports = router ;