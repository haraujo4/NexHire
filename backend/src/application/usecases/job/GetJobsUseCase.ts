import { IJobRepository } from "../../../core/interfaces/IJobRepository";
import { Job } from "../../../core/entities/Job";

export class GetJobsUseCase {
    constructor(private readonly jobRepo: IJobRepository) { }

    async execute(companyId?: string): Promise<Job[]> {
        return this.jobRepo.findAll(companyId);
    }
}
