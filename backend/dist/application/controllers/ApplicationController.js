"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
class ApplicationController {
    constructor(applicationService) {
        this.applicationService = applicationService;
        this.apply = async (req, res, next) => {
            try {
                const candidateId = req.user.id;
                const { jobId, formResponses } = req.body;
                if (!jobId)
                    throw new Error("jobId is required");
                const application = await this.applicationService.apply(candidateId, jobId, formResponses);
                res.status(201).json(application);
            }
            catch (error) {
                next(error);
            }
        };
        this.listForJob = async (req, res, next) => {
            try {
                const { jobId } = req.params;
                const companyId = req.user.id;
                const applications = await this.applicationService.getApplicationsForJob(jobId, companyId);
                res.json(applications);
            }
            catch (error) {
                next(error);
            }
        };
        this.listForCandidate = async (req, res, next) => {
            try {
                const candidateId = req.user.id;
                const applications = await this.applicationService.getApplicationsForCandidate(candidateId);
                res.json(applications);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateStatus = async (req, res, next) => {
            try {
                const { id } = req.params;
                const companyId = req.user.id;
                const { status } = req.body;
                const application = await this.applicationService.updateStatus(id, companyId, status);
                res.json(application);
            }
            catch (error) {
                next(error);
            }
        };
        this.evaluate = async (req, res, next) => {
            try {
                const { id } = req.params;
                const application = await this.applicationService.evaluate(id);
                res.json(application);
            }
            catch (error) {
                next(error);
            }
        };
        this.simulate = async (req, res, next) => {
            try {
                const candidateId = req.user.id;
                const { jobId, formResponses } = req.body;
                const analysis = await this.applicationService.simulate(candidateId, jobId, formResponses);
                res.json(analysis);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.ApplicationController = ApplicationController;
