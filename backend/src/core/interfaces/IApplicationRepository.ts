import { Application, ApplicationStatus } from "../entities/Application";

export interface IApplicationRepository {
    findById(id: string): Promise<Application | null>;
    findByJobId(jobId: string): Promise<Application[]>;
    findByCandidateId(candidateId: string): Promise<Application[]>;
    create(application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application>;
    updateStatus(id: string, status: ApplicationStatus): Promise<Application>;
    updateAIAnalysis(id: string, score: number, analysis: string): Promise<Application>;
}
