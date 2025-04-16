const { validationResult } = require("express-validator");
const projectModel = require("../models/project.model");
const taskModel = require("../models/task.model");

const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required." });
    }
    
    const createdBy = req.user._id;
    try {
        const project = await projectModel.create({
            title,
            description,
            createdBy,
        });
        
        if (!project) {
            return res.status(400).json({ error: "Failed to create project." });
        }
        
        return res.status(201).json({ 
            message: "Project created successfully.",
            project
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};

const getProjects = async (req, res) => {
    try {
        // Get all projects without filtering by user
        const projects = await projectModel.find({});
        
        if (!projects || projects.length === 0) {
            return res.status(404).json({ error: "No projects found." });
        }
        
        return res.status(200).json(projects);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};

const getProjectsTasks = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { projectId } = req.params;
    const { assignedTo, priority, status } = req.query;
    const userId = req.user._id;

    try {
        // Check if project exists
        const projectExists = await projectModel.findById(projectId);
        if (!projectExists) {
            return res.status(404).json({ error: "Project not found" });
        }
        
        // Build filter object conditionally
        const filterTask = { projectId };
        if (assignedTo === 'true') filterTask.assignedTo = userId;
        if (priority) filterTask.priority = priority;
        if (status) filterTask.status = status;

        const tasks = await taskModel.find(filterTask).sort({ createdAt: -1 });
        return res.status(200).json(tasks);
    } catch (err) {
        console.log(err);
        if (err.kind === "ObjectId") {
            return res.status(400).json({ error: "Invalid project ID format" });
        }
        return res.status(500).json({ error: "Internal Server error" });
    }
};

module.exports = { createProject, getProjects, getProjectsTasks };
