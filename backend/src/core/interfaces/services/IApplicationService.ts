import { Application } from "../../entities/Application";

export interface IApplicationService {
    apply(candidateId: string, jobId: string, formResponses?: any): Promise<Application>;
    getApplicationsForJob(jobId: string, companyId: string): Promise<Application[]>;
    getApplicationsForCandidate(candidateId: string): Promise<Application[]>;
    updateStatus(applicationId: string, companyId: string, status: string): Promise<Application>;
    evaluate(applicationId: string): Promise<Application>;
    simulate(candidateId: string, jobId: string, formResponses?: any): Promise<any>;
}
