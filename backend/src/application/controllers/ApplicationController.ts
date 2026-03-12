import { Request, Response, NextFunction } from 'express';
import { IApplicationService } from '../../core/interfaces/services/IApplicationService';
import { AuthRequest } from '../middlewares/auth';
import { z } from 'zod';

export class ApplicationController {
    constructor(private readonly applicationService: IApplicationService) { }

    apply = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const candidateId = req.user!.id;
            const { jobId, formResponses } = req.body;

            if (!jobId) throw new Error("jobId is required");

            const application = await this.applicationService.apply(candidateId, jobId, formResponses);
            res.status(201).json(application);
        } catch (error) {
            next(error);
        }
    };


    listForJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { jobId } = req.params;
            const companyId = req.user!.id;
            const applications = await this.applicationService.getApplicationsForJob(jobId as string, companyId);
            res.json(applications);
        } catch (error) {
            next(error);
        }
    };

    listForCandidate = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const candidateId = req.user!.id;
            const applications = await this.applicationService.getApplicationsForCandidate(candidateId);
            res.json(applications);
        } catch (error) {
            next(error);
        }
    };

    updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const companyId = req.user!.id;
            const { status } = req.body;
            const application = await this.applicationService.updateStatus(id as string, companyId, status);
            res.json(application);
        } catch (error) {
            next(error);
        }
    };

    evaluate = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const application = await this.applicationService.evaluate(id as string);
            res.json(application);
        } catch (error) {
            next(error);
        }
    };

    simulate = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const candidateId = req.user!.id;
            const { jobId, formResponses } = req.body;

            const analysis = await this.applicationService.simulate(candidateId, jobId, formResponses);
            res.json(analysis);
        } catch (error) {
            next(error);
        }
    };

}
