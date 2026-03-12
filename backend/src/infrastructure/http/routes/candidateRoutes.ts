import { Router } from 'express';
import { authenticateToken, requireRole } from '../../../application/middlewares/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Auth
router.post('/register', (req, res, next) => (req as any).container.candidateController.register(req, res, next));
router.post('/login', (req, res, next) => (req as any).container.candidateController.login(req, res, next));

// Protected Routes
router.use(authenticateToken as any);
router.use(requireRole('candidate') as any);

// Profile
router.get('/profile', (req, res, next) => (req as any).container.candidateController.getProfile(req, res, next));
router.put('/profile', (req, res, next) => (req as any).container.candidateController.updateProfile(req, res, next));
router.post('/profile/extract-cv', upload.single('cv'), (req, res, next) => (req as any).container.candidateController.extractCV(req, res, next));

// Applications
router.post('/simulate', (req, res, next) => (req as any).container.applicationController.simulate(req, res, next));
router.post('/apply', (req, res, next) => (req as any).container.applicationController.apply(req, res, next));
router.get('/applications', (req, res, next) => (req as any).container.applicationController.listForCandidate(req, res, next));

export default router;
