"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../application/middlewares/auth");
const router = (0, express_1.Router)();
// Auth
router.post('/register', (req, res, next) => req.container.companyController.register(req, res, next));
router.post('/login', (req, res, next) => req.container.companyController.login(req, res, next));
// Protected Routes
router.use(auth_1.authenticateToken);
router.use((0, auth_1.requireRole)('company'));
// Jobs
router.post('/jobs', (req, res, next) => req.container.jobController.create(req, res, next));
router.get('/jobs', (req, res, next) => req.container.jobController.list(req, res, next));
router.get('/jobs/:id', (req, res, next) => req.container.jobController.getById(req, res, next));
router.put('/jobs/:id', (req, res, next) => req.container.jobController.update(req, res, next));
router.delete('/jobs/:id', (req, res, next) => req.container.jobController.delete(req, res, next));
// AI Assist
router.post('/jobs/assist/skills', (req, res, next) => req.container.jobController.suggestSkills(req, res, next));
router.post('/jobs/assist/improve-description', (req, res, next) => req.container.jobController.improveDescription(req, res, next));
router.post('/jobs/assist/questions', (req, res, next) => req.container.jobController.generateQuestions(req, res, next));
// Applications
router.get('/jobs/:jobId/applications', (req, res, next) => req.container.applicationController.listForJob(req, res, next));
router.patch('/applications/:id/status', (req, res, next) => req.container.applicationController.updateStatus(req, res, next));
router.post('/applications/:id/evaluate', (req, res, next) => req.container.applicationController.evaluate(req, res, next));
// Candidates
router.get('/candidates/:id/profile', (req, res, next) => req.container.candidateController.getCandidateProfile(req, res, next));
// Profile
router.get('/profile', (req, res, next) => req.container.companyController.getProfile(req, res, next));
router.put('/profile', (req, res, next) => req.container.companyController.updateProfile(req, res, next));
// Stats
router.get('/stats', (req, res, next) => req.container.companyController.getStats(req, res, next));
exports.default = router;
