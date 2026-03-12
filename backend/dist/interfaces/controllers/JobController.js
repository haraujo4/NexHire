"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const zod_1 = require("zod");
class JobController {
    constructor(jobService) {
        this.jobService = jobService;
        this.create = async (req, res, next) => {
            try {
                const companyId = req.user.id; // from auth middleware verifyRole('company')
                const schema = zod_1.z.object({
                    title: zod_1.z.string().min(3),
                    description: zod_1.z.string().min(10),
                    requirements: zod_1.z.array(zod_1.z.string()),
                    salaryRange: zod_1.z.string().optional(),
                    location: zod_1.z.string().optional()
                });
                const data = schema.parse(req.body);
                const job = await this.jobService.createJob(companyId, data.title, data.description, data.requirements, data.salaryRange, data.location);
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
    }
}
exports.JobController = JobController;
