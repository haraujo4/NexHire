"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseJobUseCase = void 0;
class CloseJobUseCase {
    constructor(jobRepo) {
        this.jobRepo = jobRepo;
    }
    async execute(jobId) {
        const job = await this.jobRepo.findById(jobId);
        if (!job)
            throw new Error("Vaga não encontrada");
        return this.jobRepo.update(jobId, { isActive: false });
    }
}
exports.CloseJobUseCase = CloseJobUseCase;
