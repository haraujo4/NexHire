import { IJobRepository } from "../../../core/interfaces/IJobRepository";
import { Job } from "../../../core/entities/Job";

export class CreateJobUseCase {
    constructor(private readonly jobRepo: IJobRepository) { }

    async execute(companyId: string, title: string, description: string, requirements: string[], salaryRange?: string, location?: string, isEliminatory?: boolean, customForm?: any, jobFingerprint?: string): Promise<Job> {
        return this.jobRepo.create({
            companyId,
            title,
            description,
            requirements,
            salaryRange: salaryRange || null,
            location: location || null,
            isActive: true,
            isEliminatory: isEliminatory || false,
            customForm: customForm || null,
            jobFingerprint: jobFingerprint || null
        });
    }

}
