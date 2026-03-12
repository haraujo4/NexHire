import { IApplicationRepository } from "../../../core/interfaces/IApplicationRepository";
import { Application } from "../../../core/entities/Application";
import { IJobRepository } from "../../../core/interfaces/IJobRepository";

export class GetApplicationsUseCase {
    constructor(
        private readonly applicationRepo: IApplicationRepository,
        private readonly jobRepo: IJobRepository
    ) { }

    async executeForJob(jobId: string, companyId: string): Promise<Application[]> {
        const job = await this.jobRepo.findById(jobId);
        if (!job) {
            throw new Error("Vaga não encontrada");
        }

        if (job.companyId !== companyId) {
            throw new Error("Acesso negado. Esta vaga não pertence à sua empresa.");
        }

        return this.applicationRepo.findByJobId(jobId);
    }

    async executeForCandidate(candidateId: string): Promise<Application[]> {
        return this.applicationRepo.findByCandidateId(candidateId);
    }
}
