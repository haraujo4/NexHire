"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyForJobUseCase = void 0;
class ApplyForJobUseCase {
    constructor(applicationRepo) {
        this.applicationRepo = applicationRepo;
    }
    async execute(candidateId, jobId, formResponses, evaluateCompatibility) {
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
exports.ApplyForJobUseCase = ApplyForJobUseCase;
