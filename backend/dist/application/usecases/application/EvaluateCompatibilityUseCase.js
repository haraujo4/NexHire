"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluateCompatibilityUseCase = void 0;
class EvaluateCompatibilityUseCase {
    constructor(applicationRepo, jobRepo, candidateRepo, aiProvider) {
        this.applicationRepo = applicationRepo;
        this.jobRepo = jobRepo;
        this.candidateRepo = candidateRepo;
        this.aiProvider = aiProvider;
    }
    async execute(applicationId) {
        const application = await this.applicationRepo.findById(applicationId);
        if (!application)
            throw new Error("Candidatura não encontrada.");
        const job = await this.jobRepo.findById(application.jobId);
        if (!job)
            throw new Error("Vaga não encontrada.");
        const profile = await this.candidateRepo.getProfileByCandidateId(application.candidateId);
        if (!profile)
            throw new Error("O candidato ainda não preencheu o perfil profissional.");
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
        return await this.applicationRepo.updateAIAnalysis(applicationId, aiResult.compatibility_score, JSON.stringify({
            strengths: aiResult.strengths,
            weaknesses: aiResult.weaknesses,
            recommended_roles: aiResult.recommended_roles,
            incompatible_by_form: aiResult.incompatible_by_form
        }));
    }
}
exports.EvaluateCompatibilityUseCase = EvaluateCompatibilityUseCase;
