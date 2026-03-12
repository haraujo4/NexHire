import { Request, Response, NextFunction } from 'express';
import { IJobService } from '../../core/interfaces/services/IJobService';
import { AuthRequest } from '../middlewares/auth';
import { z } from 'zod';

export class JobController {
    constructor(private readonly jobService: IJobService) { }

    create = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const companyId = req.user!.id;
            const schema = z.object({
                title: z.string().min(3),
                description: z.string().min(10),
                requirements: z.array(z.string()),
                salaryRange: z.string().optional(),
                location: z.string().optional(),
                isEliminatory: z.boolean().optional(),
                customForm: z.any().optional()
            });
            const data = schema.parse(req.body);

            // Simple fingerprint for job content
            const crypto = require('crypto');
            const jobFingerprint = crypto.createHash('md5').update(JSON.stringify({
                description: data.description,
                requirements: data.requirements,
                customForm: data.customForm
            })).digest('hex');

            const job = await this.jobService.createJob(
                companyId,
                data.title,
                data.description,
                data.requirements,
                data.salaryRange,
                data.location,
                data.isEliminatory,
                data.customForm,
                jobFingerprint
            );

            res.status(201).json(job);
        } catch (error) {
            next(error);
        }
    };


    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { companyId } = req.query;
            const jobs = await this.jobService.getJobs(companyId as string);
            res.json(jobs);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const job = await this.jobService.getJobById(id as string);
            res.json(job);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const companyId = req.user!.id;
            const schema = z.object({
                title: z.string().min(3).optional(),
                description: z.string().min(10).optional(),
                requirements: z.array(z.string()).optional(),
                salaryRange: z.string().optional(),
                location: z.string().optional(),
                isActive: z.boolean().optional(),
                isEliminatory: z.boolean().optional()
            });
            const data = schema.parse(req.body);
            const job = await this.jobService.updateJob(id as string, companyId, data);
            res.json(job);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const companyId = req.user!.id;
            await this.jobService.deleteJob(id as string, companyId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    suggestSkills = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { description } = req.body;
            const skills = await this.jobService.suggestSkills(description);
            res.json({ skills });
        } catch (error) {
            next(error);
        }
    };

    improveDescription = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { description } = req.body;
            const improved = await this.jobService.improveDescription(description);
            res.json({ description: improved });
        } catch (error) {
            next(error);
        }
    };

    generateQuestions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { description, requirements } = req.body;
            const questions = await this.jobService.generateQuestions(description, requirements);
            res.json({ questions });
        } catch (error) {
            next(error);
        }
    };
}
