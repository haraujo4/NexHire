"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const zod_1 = require("zod");
class JobController {
    constructor(jobService) {
        this.jobService = jobService;
        this.create = async (req, res, next) => {
            try {
                const companyId = req.user.id;
                const schema = zod_1.z.object({
                    title: zod_1.z.string().min(3),
                    description: zod_1.z.string().min(10),
                    requirements: zod_1.z.array(zod_1.z.string()),
                    salaryRange: zod_1.z.string().optional(),
                    location: zod_1.z.string().optional(),
                    isEliminatory: zod_1.z.boolean().optional(),
                    customForm: zod_1.z.any().optional()
                });
                const data = schema.parse(req.body);
                // Simple fingerprint for job content
                const crypto = require('crypto');
                const jobFingerprint = crypto.createHash('md5').update(JSON.stringify({
                    description: data.description,
                    requirements: data.requirements,
                    customForm: data.customForm
                })).digest('hex');
                const job = await this.jobService.createJob(companyId, data.title, data.description, data.requirements, data.salaryRange, data.location, data.isEliminatory, data.customForm, jobFingerprint);
                res.status(201).json(job);
            }
            catch (error) {
                next(error);
            }
        };
        this.list = async (req, res, next) => {
            try {
                const { companyId } = req.query;
                const jobs = await this.jobService.getJobs(companyId);
                res.json(jobs);
            }
            catch (error) {
                next(error);
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const job = await this.jobService.getJobById(id);
                res.json(job);
            }
            catch (error) {
                next(error);
            }
        };
        this.update = async (req, res, next) => {
            try {
                const { id } = req.params;
                const companyId = req.user.id;
                const schema = zod_1.z.object({
                    title: zod_1.z.string().min(3).optional(),
                    description: zod_1.z.string().min(10).optional(),
                    requirements: zod_1.z.array(zod_1.z.string()).optional(),
                    salaryRange: zod_1.z.string().optional(),
                    location: zod_1.z.string().optional(),
                    isActive: zod_1.z.boolean().optional(),
                    isEliminatory: zod_1.z.boolean().optional()
                });
                const data = schema.parse(req.body);
                const job = await this.jobService.updateJob(id, companyId, data);
                res.json(job);
            }
            catch (error) {
                next(error);
            }
        };
        this.delete = async (req, res, next) => {
            try {
                const { id } = req.params;
                const companyId = req.user.id;
                await this.jobService.deleteJob(id, companyId);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.suggestSkills = async (req, res, next) => {
            try {
                const { description } = req.body;
                const skills = await this.jobService.suggestSkills(description);
                res.json({ skills });
            }
            catch (error) {
                next(error);
            }
        };
        this.improveDescription = async (req, res, next) => {
            try {
                const { description } = req.body;
                const improved = await this.jobService.improveDescription(description);
                res.json({ description: improved });
            }
            catch (error) {
                next(error);
            }
        };
        this.generateQuestions = async (req, res, next) => {
            try {
                const { description, requirements } = req.body;
                const questions = await this.jobService.generateQuestions(description, requirements);
                res.json({ questions });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.JobController = JobController;
