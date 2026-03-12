"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CompanyController_1 = require("../controllers/CompanyController");
const JobController_1 = require("../controllers/JobController");
const ApplicationController_1 = require("../controllers/ApplicationController");
const container_1 = require("../../container");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const companyController = new CompanyController_1.CompanyController(container_1.container.companyService);
const jobController = new JobController_1.JobController(container_1.container.jobService);
const applicationController = new ApplicationController_1.ApplicationController(container_1.container.applicationService);
// Auth
router.post('/register', companyController.register);
router.post('/login', companyController.login);
// Protected Routes
router.use(auth_1.authenticateToken);
router.use((0, auth_1.requireRole)('company'));
// Jobs
router.post('/jobs', jobController.create);
router.get('/jobs', jobController.list);
// Applications
router.get('/jobs/:jobId/applications', applicationController.listForJob);
router.patch('/applications/:id/status', applicationController.updateStatus);
exports.default = router;
