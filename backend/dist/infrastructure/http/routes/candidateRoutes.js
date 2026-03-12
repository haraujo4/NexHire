"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../application/middlewares/auth");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Auth
router.post('/register', (req, res, next) => req.container.candidateController.register(req, res, next));
router.post('/login', (req, res, next) => req.container.candidateController.login(req, res, next));
// Protected Routes
router.use(auth_1.authenticateToken);
router.use((0, auth_1.requireRole)('candidate'));
// Profile
router.get('/profile', (req, res, next) => req.container.candidateController.getProfile(req, res, next));
router.put('/profile', (req, res, next) => req.container.candidateController.updateProfile(req, res, next));
router.post('/profile/extract-cv', upload.single('cv'), (req, res, next) => req.container.candidateController.extractCV(req, res, next));
// Applications
router.post('/simulate', (req, res, next) => req.container.applicationController.simulate(req, res, next));
router.post('/apply', (req, res, next) => req.container.applicationController.apply(req, res, next));
router.get('/applications', (req, res, next) => req.container.applicationController.listForCandidate(req, res, next));
exports.default = router;
