const express = require("express");
const projectController = require("../controllers/project.controller");
const authUser = require("../middlewares/auth.middleware");
const { body, param } = require("express-validator");
const router = express.Router();

router.post(
  "/",
  authUser.authenticate,
  authUser.checkRole(["admin"]),
  [
    body("title").notEmpty().withMessage("Title must be present."),
    body("description").notEmpty().withMessage("Description must be present."),
  ],
  projectController.createProject
);
router.get("/", authUser.authenticate, projectController.getProjects);
router.get(
  "/:projectId",
  [param("projectId").notEmpty().withMessage("projectId required.")],
  authUser.authenticate,
  projectController.getProjectsTasks
);

module.exports = router;
