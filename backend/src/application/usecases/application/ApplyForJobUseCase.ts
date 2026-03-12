import { Application } from "../../../core/entities/Application";
import { IApplicationRepository } from "../../../core/interfaces/IApplicationRepository";

export class ApplyForJobUseCase {
    constructor(private readonly applicationRepo: IApplicationRepository) { }

    async execute(candidateId: string, jobId: string, formResponses: any, evaluateCompatibility: (appId: string) => Promise<any>): Promise<Application> {
        const existingApps = await this.applicationRepo.findByCandidateId(candidateId);
        if (existingApps.some(app => app.jobId === jobId)) {
            throw new Error("Candidato já aplicado para esta vaga");
        }

        const application = await this.applicationRepo.create({
            candidateId,
            jobId,
            status: 'applied',
            compatibilityScore: null,
            aiAnalysis: null,
            formResponses
        });

        evaluateCompatibility(application.id).catch(err => {
            console.error(`Failed to evaluate AI compatibility for app ${application.id}:`, err);
        });

        return application;
    }
}
