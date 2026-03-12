"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetJobByIdUseCase = void 0;
class GetJobByIdUseCase {
    constructor(jobRepo) {
        this.jobRepo = jobRepo;
    }
    async execute(jobId) {
        const job = await this.jobRepo.findById(jobId);
        if (!job)
            throw new Error("Vaga não encontrada");
        return job;
    }
}
exports.GetJobByIdUseCase = GetJobByIdUseCase;
