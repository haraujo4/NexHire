"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CandidateController_1 = require("../controllers/CandidateController");
const ApplicationController_1 = require("../controllers/ApplicationController");
const container_1 = require("../../container");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const candidateController = new CandidateController_1.CandidateController(container_1.container.candidateService);
const applicationController = new ApplicationController_1.ApplicationController(container_1.container.applicationService);
// Auth
router.post('/register', candidateController.register);
router.post('/login', candidateController.login);
// Protected Routes
router.use(auth_1.authenticateToken);
router.use((0, auth_1.requireRole)('candidate'));
// Profile
router.get('/profile', candidateController.getProfile);
router.put('/profile', candidateController.updateProfile);
// Applications
router.post('/apply', applicationController.apply);
router.get('/applications', applicationController.listForCandidate);
exports.default = router;
