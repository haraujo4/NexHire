import { IJobRepository } from "../../../core/interfaces/IJobRepository";
import { Job } from "../../../core/entities/Job";

export class CloseJobUseCase {
    constructor(private readonly jobRepo: IJobRepository) { }

    async execute(jobId: string): Promise<Job> {
        const job = await this.jobRepo.findById(jobId);
        if (!job) throw new Error("Vaga não encontrada");

        return this.jobRepo.update(jobId, { isActive: false });
    }
}
