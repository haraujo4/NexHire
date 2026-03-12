import { Job } from "../../entities/Job";

export interface IJobService {
    createJob(companyId: string, title: string, description: string, requirements: string[], salaryRange?: string, location?: string, isEliminatory?: boolean, customForm?: any, jobFingerprint?: string): Promise<Job>;

    getJobs(companyId?: string): Promise<Job[]>;
    getJobById(jobId: string): Promise<Job>;
    updateJob(jobId: string, companyId: string, data: Partial<Omit<Job, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>>): Promise<Job>;
    deleteJob(jobId: string, companyId: string): Promise<void>;
    closeJob(jobId: string): Promise<Job>;
    suggestSkills(description: string): Promise<string[]>;
    improveDescription(description: string): Promise<string>;
    generateQuestions(description: string, requirements: string[]): Promise<any[]>;
}
