// routes/projectRoutes.js
const express = require('express');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.post('/create', authMiddleware.protect, authMiddleware.isSupervisor, projectController.createProject);

// Assign developers to a project (supervisor only)
router.put('/:projectId/assign', authMiddleware.protect, authMiddleware.isSupervisor, projectController.assignProjectToDevelopers);
router.get('/:projectId', authMiddleware.protect, projectController.getProjectDetails);

// Upload assets to Cloudinary for a project
router.post('/:projectId/assets', authMiddleware.protect, authMiddleware.isSupervisor, upload.array('assets', 10), projectController.uploadProjectAssets);

router.get('/', authMiddleware.protect, authMiddleware.isSupervisor, projectController.getAllProjects);

// Route to get a specific project by its ID
router.get('/:projectId', authMiddleware.protect, authMiddleware.isSupervisor, projectController.getProjectById);

router.put('/:projectId', authMiddleware.protect, authMiddleware.isSupervisor, projectController.editProject);

module.exports = router;
