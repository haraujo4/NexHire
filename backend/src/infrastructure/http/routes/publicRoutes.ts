import { Router } from 'express';

const router = Router();

router.get('/jobs', (req, res, next) => (req as any).container.jobController.list(req, res, next));
router.get('/jobs/:id', (req, res, next) => (req as any).container.jobController.getById(req, res, next));

export default router;
