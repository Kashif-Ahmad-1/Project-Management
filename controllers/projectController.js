// controllers/projectController.js
const Project = require("../models/Project");
const User = require("../models/User");
const Notification = require('../models/Notification');
// Controller to create a project
exports.createProject = async (req, res) => {
  try {
    // Ensure the request is coming from a supervisor
    if (req.user.role !== "supervisor") {
      return res
        .status(403)
        .json({ message: "Only supervisors can create projects" });
    }

    const {
      projectName,
      projectTitle,
      dateProject,
      priority,
      price,
      projectCompletionTime,
      websiteType,
      description,
    } = req.body;
    const project = new Project({
      projectName,
      projectTitle,
      dateProject,
      priority,
      price,
      description,
      projectCompletionTime,
      websiteType,
      createdBy: req.user.id,
    });

    await project.save();
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assuming User model exists

exports.assignProjectToDevelopers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      description,
      development,
      figmaDesign,
      backendDevelopment,
      daysLeftToCompletion,
    } = req.body;

    // Find the project by its ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Find the developers assigned to each role
    const developmentUser = await User.findById(development);
    const figmaDesignUser = await User.findById(figmaDesign);
    const backendDevelopmentUser = await User.findById(backendDevelopment);

    // Check if all developers exist
    if (!developmentUser || !figmaDesignUser || !backendDevelopmentUser) {
      return res
        .status(404)
        .json({ message: "One or more developers not found" });
    }

    // Update project with assigned developers and details
    project.description = description;
    project.development.assignDeveloper = development;
    project.figmaDesign.assignDeveloper = figmaDesign;
    project.backendDevelopment.assignDeveloper = backendDevelopment;
    project.daysLeftToCompletion = daysLeftToCompletion;

    // Generate the teams array automatically from the developers assigned
    const allAssignedDevelopers = [
      developmentUser._id,
      figmaDesignUser._id,
      backendDevelopmentUser._id,
    ];

    // Ensure unique team members in the project (in case same developer is assigned to multiple roles)
    project.teams = [...new Set(allAssignedDevelopers)];

    // Save the project with the updated teams
    await project.save();

    // Send notifications to each team member
    const notificationMessage = `You have been assigned to the project: ${project.projectTitle}.`;

    for (let i = 0; i < allAssignedDevelopers.length; i++) {
      const developerId = allAssignedDevelopers[i];
      const notification = new Notification({
        message: notificationMessage,
        userId: developerId,
        projectId: project._id,
      });
      await notification.save(); // Save notification to database
    }


    res.status(200).json({ message: "Project assigned successfully", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload assets to Cloudinary and save URLs in project
exports.uploadProjectAssets = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const assets = req.files.map((file) => ({
      url: file.path,
      type: file.mimetype,
    }));

    project.assets.push(...assets);
    await project.save();

    res.status(200).json({ message: "Assets uploaded successfully", assets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// controllers/projectController.js

exports.getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id; // ID of the user making the request

    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the user is part of the project
    const isAssigned =
      project.development.assignDeveloper.toString() === userId ||
      project.figmaDesign.assignDeveloper.toString() === userId ||
      project.backendDevelopment.assignDeveloper.toString() === userId ||
      project.teams.includes(userId);

    // Deny access if the user is not assigned to the project
    if (!isAssigned) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this project" });
    }

    // If the user is assigned, return project details
    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllProjects = async (req, res) => {
  try {
    // Ensure the request is coming from a supervisor
    if (req.user.role !== 'supervisor') {
      return res.status(403).json({ message: 'Only supervisors can view all projects' });
    }

    const projects = await Project.find({ createdBy: req.user.id }); // Get all projects created by the logged-in supervisor
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific project by its ID
exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Ensure the request is coming from a supervisor
    if (req.user.role !== 'supervisor') {
      return res.status(403).json({ message: 'Only supervisors can view a specific project' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.editProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { description, development, figmaDesign, backendDevelopment, daysLeftToCompletion, price, projectCompletionTime, websiteType } = req.body;

    // Ensure the request is coming from a supervisor
    if (req.user.role !== 'supervisor') {
      return res.status(403).json({ message: 'Only supervisors can edit projects' });
    }

    // Find the project by its ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the supervisor is the creator of the project
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this project' });
    }

    // Update the project fields
    project.description = description || project.description;
    project.development = development || project.development;
    project.figmaDesign = figmaDesign || project.figmaDesign;
    project.backendDevelopment = backendDevelopment || project.backendDevelopment;
    project.daysLeftToCompletion = daysLeftToCompletion || project.daysLeftToCompletion;
    project.price = price || project.price;
    project.projectCompletionTime = projectCompletionTime || project.projectCompletionTime;
    project.websiteType = websiteType || project.websiteType;

    // Save the updated project
    await project.save();

    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};