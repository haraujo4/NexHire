import { IApplicationRepository } from "../../../core/interfaces/IApplicationRepository";
import { Application, ApplicationStatus } from "../../../core/entities/Application";
import { IJobRepository } from "../../../core/interfaces/IJobRepository";
import { ICandidateRepository } from "../../../core/interfaces/ICandidateRepository";
import { MailProvider } from "../../../infrastructure/providers/MailProvider";
import { MailTemplates } from "../../../infrastructure/providers/MailTemplates";

export class UpdateApplicationStatusUseCase {
    constructor(
        private readonly applicationRepo: IApplicationRepository,
        private readonly jobRepo: IJobRepository,
        private readonly candidateRepo: ICandidateRepository,
        private readonly mailProvider: MailProvider
    ) { }

    async execute(applicationId: string, companyId: string, status: string): Promise<Application> {
        const application = await this.applicationRepo.findById(applicationId);
        if (!application) {
            throw new Error("Candidatura não encontrada");
        }

        if (application.job?.companyId !== companyId) {
            throw new Error("Acesso negado. Esta candidatura não pertence a uma vaga da sua empresa.");
        }

        const updated = await this.applicationRepo.updateStatus(applicationId, status as ApplicationStatus);

        // Async dispatch status update email
        Promise.all([
            this.candidateRepo.findById(application.candidateId),
            this.jobRepo.findById(application.jobId)
        ]).then(([candidate, job]) => {
            if (candidate && job) {
                this.mailProvider.sendMail({
                    to: candidate.email,
                    subject: `Atualização no seu Processo: ${job.title}`,
                    html: MailTemplates.statusUpdate(candidate.name, job.title, status)
                });
            }
        });

        return updated;
    }
}
