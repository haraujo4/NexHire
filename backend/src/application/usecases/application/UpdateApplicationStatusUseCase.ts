import { IApplicationRepository } from "../../../core/interfaces/IApplicationRepository";
import { Application, ApplicationStatus } from "../../../core/entities/Application";

export class UpdateApplicationStatusUseCase {
    constructor(private readonly applicationRepo: IApplicationRepository) { }

    async execute(applicationId: string, companyId: string, status: string): Promise<Application> {
        const application = await this.applicationRepo.findById(applicationId);
        if (!application) {
            throw new Error("Candidatura não encontrada");
        }

        if (application.job?.companyId !== companyId) {
            throw new Error("Acesso negado. Esta candidatura não pertence a uma vaga da sua empresa.");
        }

        return this.applicationRepo.updateStatus(applicationId, status as ApplicationStatus);
    }
}
