import { ICandidateRepository } from "../../../core/interfaces/ICandidateRepository";
import { IAIProvider } from "../../../core/interfaces/IAIProvider";
import { CandidateProfile } from "../../../core/entities/Candidate";
import crypto from 'crypto';

export class SummarizeCandidateProfileUseCase {
    constructor(
        private readonly candidateRepo: ICandidateRepository,
        private readonly aiProvider: IAIProvider
    ) { }

    async execute(candidateId: string): Promise<CandidateProfile> {
        const profile = await this.candidateRepo.getProfileByCandidateId(candidateId);
        if (!profile) throw new Error("Perfil do candidato não encontrado.");

        const summaries = await this.aiProvider.summarizeProfile({
            skills: profile.skills,
            experience: profile.experience,
            education: profile.education,
            academicInfo: profile.academicInfo,
            professionalInfo: profile.professionalInfo
        });

        const aiSummaryFingerprint = crypto.createHash('md5').update(JSON.stringify({
            skills: profile.skills,
            experience: profile.experience,
            education: profile.education,
            academicInfo: profile.academicInfo,
            professionalInfo: profile.professionalInfo
        })).digest('hex');

        return this.candidateRepo.updateProfile(candidateId, {
            aiSummary: summaries.general,
            aiExperienceSummary: summaries.experience,
            aiAcademicSummary: summaries.academic,
            aiSummaryFingerprint
        });
    }
}
