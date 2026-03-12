import { Router } from 'express';
import { authenticateToken, requireRole } from '../../../application/middlewares/auth';
import { ScopedRequest } from '../../../application/middlewares/scopedContainer';

const router = Router();

// Auth
router.post('/register', (req, res, next) => (req as any).container.companyController.register(req, res, next));
router.post('/login', (req, res, next) => (req as any).container.companyController.login(req, res, next));

// Protected Routes
router.use(authenticateToken as any);
router.use(requireRole('company') as any);

// Jobs
router.post('/jobs', (req, res, next) => (req as any).container.jobController.create(req, res, next));
router.get('/jobs', (req, res, next) => (req as any).container.jobController.list(req, res, next));
router.get('/jobs/:id', (req, res, next) => (req as any).container.jobController.getById(req, res, next));
router.put('/jobs/:id', (req, res, next) => (req as any).container.jobController.update(req, res, next));
router.delete('/jobs/:id', (req, res, next) => (req as any).container.jobController.delete(req, res, next));

// AI Assist
router.post('/jobs/assist/skills', (req, res, next) => (req as any).container.jobController.suggestSkills(req, res, next));
router.post('/jobs/assist/improve-description', (req, res, next) => (req as any).container.jobController.improveDescription(req, res, next));
router.post('/jobs/assist/questions', (req, res, next) => (req as any).container.jobController.generateQuestions(req, res, next));

// Applications
router.get('/jobs/:jobId/applications', (req, res, next) => (req as any).container.applicationController.listForJob(req, res, next));
router.patch('/applications/:id/status', (req, res, next) => (req as any).container.applicationController.updateStatus(req, res, next));
router.post('/applications/:id/evaluate', (req, res, next) => (req as any).container.applicationController.evaluate(req, res, next));

// Candidates
router.get('/candidates/:id/profile', (req, res, next) => (req as any).container.candidateController.getCandidateProfile(req, res, next));
router.post('/candidates/:id/summarize', (req, res, next) => (req as any).container.candidateController.summarizeProfile(req, res, next));

// Profile
router.get('/profile', (req, res, next) => (req as any).container.companyController.getProfile(req, res, next));
router.put('/profile', (req, res, next) => (req as any).container.companyController.updateProfile(req, res, next));

// Stats
router.get('/stats', (req, res, next) => (req as any).container.companyController.getStats(req, res, next));

export default router;
