"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyForJobUseCase = void 0;
const MailTemplates_1 = require("../../../infrastructure/providers/MailTemplates");
class ApplyForJobUseCase {
    constructor(applicationRepo, jobRepo, candidateRepo, mailProvider) {
        this.applicationRepo = applicationRepo;
        this.jobRepo = jobRepo;
        this.candidateRepo = candidateRepo;
        this.mailProvider = mailProvider;
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
        // Async dispatch confirmation email
        Promise.all([
            this.candidateRepo.findById(candidateId),
            this.jobRepo.findById(jobId)
        ]).then(([candidate, job]) => {
            if (candidate && job) {
                this.mailProvider.sendMail({
                    to: candidate.email,
                    subject: `Inscrição Recebida: ${job.title}`,
                    html: MailTemplates_1.MailTemplates.applicationConfirmation(candidate.name, job.title, job.company?.name || 'Empresa')
                });
            }
        });
        return application;
    }
}
exports.ApplyForJobUseCase = ApplyForJobUseCase;
