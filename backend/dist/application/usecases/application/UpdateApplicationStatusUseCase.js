"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApplicationStatusUseCase = void 0;
const MailTemplates_1 = require("../../../infrastructure/providers/MailTemplates");
class UpdateApplicationStatusUseCase {
    constructor(applicationRepo, jobRepo, candidateRepo, mailProvider) {
        this.applicationRepo = applicationRepo;
        this.jobRepo = jobRepo;
        this.candidateRepo = candidateRepo;
        this.mailProvider = mailProvider;
    }
    async execute(applicationId, companyId, status) {
        const application = await this.applicationRepo.findById(applicationId);
        if (!application) {
            throw new Error("Candidatura não encontrada");
        }
        if (application.job?.companyId !== companyId) {
            throw new Error("Acesso negado. Esta candidatura não pertence a uma vaga da sua empresa.");
        }
        const updated = await this.applicationRepo.updateStatus(applicationId, status);
        // Async dispatch status update email
        Promise.all([
            this.candidateRepo.findById(application.candidateId),
            this.jobRepo.findById(application.jobId)
        ]).then(([candidate, job]) => {
            if (candidate && job) {
                this.mailProvider.sendMail({
                    to: candidate.email,
                    subject: `Atualização no seu Processo: ${job.title}`,
                    html: MailTemplates_1.MailTemplates.statusUpdate(candidate.name, job.title, status)
                });
            }
        });
        return updated;
    }
}
exports.UpdateApplicationStatusUseCase = UpdateApplicationStatusUseCase;
