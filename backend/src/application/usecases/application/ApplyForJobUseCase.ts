import { Application } from "../../../core/entities/Application";
import { IApplicationRepository } from "../../../core/interfaces/IApplicationRepository";
import { IJobRepository } from "../../../core/interfaces/IJobRepository";
import { ICandidateRepository } from "../../../core/interfaces/ICandidateRepository";
import { MailProvider } from "../../../infrastructure/providers/MailProvider";
import { MailTemplates } from "../../../infrastructure/providers/MailTemplates";

export class ApplyForJobUseCase {
    constructor(
        private readonly applicationRepo: IApplicationRepository,
        private readonly jobRepo: IJobRepository,
        private readonly candidateRepo: ICandidateRepository,
        private readonly mailProvider: MailProvider
    ) { }

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

        // Async dispatch confirmation email
        Promise.all([
            this.candidateRepo.findById(candidateId),
            this.jobRepo.findById(jobId)
        ]).then(([candidate, job]) => {
            if (candidate && job) {
                this.mailProvider.sendMail({
                    to: candidate.email,
                    subject: `Inscrição Recebida: ${job.title}`,
                    html: MailTemplates.applicationConfirmation(candidate.name, job.title, (job as any).company?.name || 'Empresa')
                });
            }
        });

        return application;
    }
}
