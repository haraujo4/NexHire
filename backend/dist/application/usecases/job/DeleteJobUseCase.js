"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteJobUseCase = void 0;
class DeleteJobUseCase {
    constructor(jobRepo) {
        this.jobRepo = jobRepo;
    }
    async execute(id, companyId) {
        const job = await this.jobRepo.findById(id);
        if (!job) {
            throw new Error("Vaga não encontrada");
        }
        if (job.companyId !== companyId) {
            throw new Error("Acesso negado. Esta vaga não pertence à sua empresa.");
        }
        return this.jobRepo.delete(id);
    }
}
exports.DeleteJobUseCase = DeleteJobUseCase;
