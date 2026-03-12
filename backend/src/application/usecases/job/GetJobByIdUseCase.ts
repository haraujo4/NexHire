import { IJobRepository } from "../../../core/interfaces/IJobRepository";
import { Job } from "../../../core/entities/Job";

export class GetJobByIdUseCase {
    constructor(private readonly jobRepo: IJobRepository) { }

    async execute(jobId: string): Promise<Job> {
        const job = await this.jobRepo.findById(jobId);
        if (!job) throw new Error("Vaga não encontrada");
        return job;
    }
}
