import { Router } from 'express';
import companyRoutes from './companyRoutes';
import candidateRoutes from './candidateRoutes';
import publicRoutes from './publicRoutes';

export const router = Router();

router.use('/company', companyRoutes);
router.use('/candidate', candidateRoutes);
router.use('/public', publicRoutes);
