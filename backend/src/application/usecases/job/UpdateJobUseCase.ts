import { IJobRepository } from "../../../core/interfaces/IJobRepository";
import { Job } from "../../../core/entities/Job";

export class UpdateJobUseCase {
    constructor(private readonly jobRepo: IJobRepository) { }

    async execute(id: string, companyId: string, data: Partial<Omit<Job, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>>): Promise<Job> {
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
