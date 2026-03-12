"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
class JobService {
    constructor(createJobUC, getJobsUC, getJobByIdUC, updateJobUC, deleteJobUC, closeJobUC, assistUC) {
        this.createJobUC = createJobUC;
        this.getJobsUC = getJobsUC;
        this.getJobByIdUC = getJobByIdUC;
        this.updateJobUC = updateJobUC;
        this.deleteJobUC = deleteJobUC;
        this.closeJobUC = closeJobUC;
        this.assistUC = assistUC;
    }
    async createJob(companyId, title, description, requirements, salaryRange, location, isEliminatory, customForm, jobFingerprint) {
        return this.createJobUC.execute(companyId, title, description, requirements, salaryRange, location, isEliminatory, customForm, jobFingerprint);
    }
    async getJobs(companyId) {
        return this.getJobsUC.execute(companyId);
    }
    async getJobById(jobId) {
        return this.getJobByIdUC.execute(jobId);
    }
    async updateJob(jobId, companyId, data) {
        return this.updateJobUC.execute(jobId, companyId, data);
    }
    async deleteJob(jobId, companyId) {
        return this.deleteJobUC.execute(jobId, companyId);
    }
    async closeJob(jobId) {
        return this.closeJobUC.execute(jobId);
    }
    async suggestSkills(description) {
        return this.assistUC.suggestSkills(description);
    }
    async improveDescription(description) {
        return this.assistUC.improveDescription(description);
    }
    async generateQuestions(description, requirements) {
        return this.assistUC.generateQuestions(description, requirements);
    }
}
exports.JobService = JobService;
