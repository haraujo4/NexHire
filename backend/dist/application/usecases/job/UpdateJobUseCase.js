"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateJobUseCase = void 0;
class UpdateJobUseCase {
    constructor(jobRepo) {
        this.jobRepo = jobRepo;
    }
    async execute(id, companyId, data) {
        const job = await this.jobRepo.findById(id);
        if (!job) {
            throw new Error("Vaga não encontrada");
        }
        if (job.companyId !== companyId) {
            throw new Error("Acesso negado. Esta vaga não pertence à sua empresa.");
        }
        return this.jobRepo.update(id, data);
    }
}
exports.UpdateJobUseCase = UpdateJobUseCase;
