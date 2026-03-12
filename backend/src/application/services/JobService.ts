import { IJobService } from "../../core/interfaces/services/IJobService";
import { Job } from "../../core/entities/Job";
import { CreateJobUseCase } from "../usecases/job/CreateJobUseCase";
import { GetJobsUseCase } from "../usecases/job/GetJobsUseCase";
import { GetJobByIdUseCase } from "../usecases/job/GetJobByIdUseCase";
import { UpdateJobUseCase } from "../usecases/job/UpdateJobUseCase";
import { DeleteJobUseCase } from "../usecases/job/DeleteJobUseCase";
import { CloseJobUseCase } from "../usecases/job/CloseJobUseCase";
import { AssistJobCreationUseCase } from "../usecases/job/AssistJobCreationUseCase";

export class JobService implements IJobService {
    constructor(
        private readonly createJobUC: CreateJobUseCase,
        private readonly getJobsUC: GetJobsUseCase,
        private readonly getJobByIdUC: GetJobByIdUseCase,
        private readonly updateJobUC: UpdateJobUseCase,
        private readonly deleteJobUC: DeleteJobUseCase,
        private readonly closeJobUC: CloseJobUseCase,
        private readonly assistUC: AssistJobCreationUseCase
    ) { }

    async createJob(companyId: string, title: string, description: string, requirements: string[], salaryRange?: string, location?: string, isEliminatory?: boolean, customForm?: any, jobFingerprint?: string): Promise<Job> {
        return this.createJobUC.execute(companyId, title, description, requirements, salaryRange, location, isEliminatory, customForm, jobFingerprint);
    }


    async getJobs(companyId?: string): Promise<Job[]> {
        return this.getJobsUC.execute(companyId);
    }

    async getJobById(jobId: string): Promise<Job> {
        return this.getJobByIdUC.execute(jobId);
    }

    async updateJob(jobId: string, companyId: string, data: Partial<Omit<Job, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>>): Promise<Job> {
        return this.updateJobUC.execute(jobId, companyId, data);
    }

    async deleteJob(jobId: string, companyId: string): Promise<void> {
        return this.deleteJobUC.execute(jobId, companyId);
    }

    async closeJob(jobId: string): Promise<Job> {
        return this.closeJobUC.execute(jobId);
    }

    async suggestSkills(description: string): Promise<string[]> {
        return this.assistUC.suggestSkills(description);
    }

    async improveDescription(description: string): Promise<string> {
        return this.assistUC.improveDescription(description);
    }

    async generateQuestions(description: string, requirements: string[]): Promise<any[]> {
        return this.assistUC.generateQuestions(description, requirements);
    }
}
