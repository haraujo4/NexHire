"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApplicationStatusUseCase = void 0;
class UpdateApplicationStatusUseCase {
    constructor(applicationRepo) {
        this.applicationRepo = applicationRepo;
    }
    async execute(applicationId, companyId, status) {
        const application = await this.applicationRepo.findById(applicationId);
        if (!application) {
            throw new Error("Candidatura não encontrada");
        }
        if (application.job?.companyId !== companyId) {
            throw new Error("Acesso negado. Esta candidatura não pertence a uma vaga da sua empresa.");
        }
        return this.applicationRepo.updateStatus(applicationId, status);
    }
}
exports.UpdateApplicationStatusUseCase = UpdateApplicationStatusUseCase;
