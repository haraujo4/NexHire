import { IApplicationRepository } from "../../../core/interfaces/IApplicationRepository";
import { IJobRepository } from "../../../core/interfaces/IJobRepository";
import { ICandidateRepository } from "../../../core/interfaces/ICandidateRepository";
import { IAIProvider } from "../../../core/interfaces/IAIProvider";
import { Application } from "../../../core/entities/Application";

export class EvaluateCompatibilityUseCase {
    constructor(
        private readonly applicationRepo: IApplicationRepository,
        private readonly jobRepo: IJobRepository,
        private readonly candidateRepo: ICandidateRepository,
        private readonly aiProvider: IAIProvider
    ) { }

    async execute(applicationId: string): Promise<Application | null> {
        const application = await this.applicationRepo.findById(applicationId);
        if (!application) throw new Error("Candidatura não encontrada.");

        const job = await this.jobRepo.findById(application.jobId);
        if (!job) throw new Error("Vaga não encontrada.");

        const profile = await this.candidateRepo.getProfileByCandidateId(application.candidateId);
        if (!profile) throw new Error("O candidato ainda não preencheu o perfil profissional.");

        const aiResult = await this.aiProvider.analyzeCandidate({
            jobDescription: job.description,
            jobRequirements: job.requirements,
            candidateProfile: {
                skills: profile.skills,
                experience: profile.experience,
                education: profile.education,
                academicInfo: profile.academicInfo,
                professionalInfo: profile.professionalInfo
            },
            formResponses: application.formResponses
        });

        return await this.applicationRepo.updateAIAnalysis(
            applicationId,
            aiResult.compatibility_score,
            JSON.stringify({
                strengths: aiResult.strengths,
                weaknesses: aiResult.weaknesses,
                recommended_roles: aiResult.recommended_roles,
                incompatible_by_form: aiResult.incompatible_by_form
            })
        );
    }
}
