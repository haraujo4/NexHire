"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetApplicationsUseCase = void 0;
class GetApplicationsUseCase {
    constructor(applicationRepo, jobRepo) {
        this.applicationRepo = applicationRepo;
        this.jobRepo = jobRepo;
    }
    async executeForJob(jobId, companyId) {
        const job = await this.jobRepo.findById(jobId);
        if (!job) {
            throw new Error("Vaga não encontrada");
        }
        if (job.companyId !== companyId) {
            throw new Error("Acesso negado. Esta vaga não pertence à sua empresa.");
        }
        return this.applicationRepo.findByJobId(jobId);
    }
    async executeForCandidate(candidateId) {
        return this.applicationRepo.findByCandidateId(candidateId);
    }
}
exports.GetApplicationsUseCase = GetApplicationsUseCase;
