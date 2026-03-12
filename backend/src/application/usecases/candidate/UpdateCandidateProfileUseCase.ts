import { ICandidateRepository } from "../../../core/interfaces/ICandidateRepository";
import { CandidateProfile } from "../../../core/entities/Candidate";
import { IAIProvider } from "../../../core/interfaces/IAIProvider";
import crypto from 'crypto';

export class UpdateCandidateProfileUseCase {
    constructor(
        private readonly candidateRepo: ICandidateRepository,
        private readonly aiProvider: IAIProvider
    ) { }

    async execute(candidateId: string, profileData: any): Promise<CandidateProfile> {
        const { name, ...onlyProfileData } = profileData;

        // General fingerprint for profile changes
        const profileFingerprint = crypto.createHash('md5').update(JSON.stringify({
            skills: onlyProfileData.skills,
            experience: onlyProfileData.experience,
            education: onlyProfileData.education,
            academicInfo: onlyProfileData.academicInfo,
            professionalInfo: onlyProfileData.professionalInfo,
            birthDate: onlyProfileData.birthDate,
            gender: onlyProfileData.gender,
            address: onlyProfileData.address
        })).digest('hex');

        // AI Summary fingerprint - data that affects professional summary
        const aiSummaryFingerprint = crypto.createHash('md5').update(JSON.stringify({
            skills: onlyProfileData.skills,
            experience: onlyProfileData.experience,
            education: onlyProfileData.education,
            academicInfo: onlyProfileData.academicInfo,
            professionalInfo: onlyProfileData.professionalInfo
        })).digest('hex');

        if (name) {
            await this.candidateRepo.update(candidateId, { name });
        }

        const existing = await this.candidateRepo.getProfileByCandidateId(candidateId);

        let aiSummary = existing?.aiSummary || null;
        let aiExperienceSummary = existing?.aiExperienceSummary || null;
        let aiAcademicSummary = existing?.aiAcademicSummary || null;
        let finalAiSummaryFingerprint = existing?.aiSummaryFingerprint || null;

        // Regerate summaries if fingerprint changed or they don't exist
        if (!existing || existing.aiSummaryFingerprint !== aiSummaryFingerprint || !aiSummary || !aiExperienceSummary || !aiAcademicSummary) {
            try {
                const summaries = await this.aiProvider.summarizeProfile(onlyProfileData);
                aiSummary = summaries.general;
                aiExperienceSummary = summaries.experience;
                aiAcademicSummary = summaries.academic;
                finalAiSummaryFingerprint = aiSummaryFingerprint;
            } catch (error) {
                console.error("Erro ao gerar resumo IA:", error);
            }
        }

        const dataToSave: any = {
            ...onlyProfileData,
            aiSummary,
            aiExperienceSummary,
            aiAcademicSummary,
            aiSummaryFingerprint: finalAiSummaryFingerprint,
            profileFingerprint
        };

        if (existing) {
            return this.candidateRepo.updateProfile(candidateId, dataToSave);
        } else {
            return this.candidateRepo.createProfile({
                candidateId,
                skills: dataToSave.skills || [],
                experience: dataToSave.experience || '',
                education: dataToSave.education || '',
                birthDate: dataToSave.birthDate || null,
                cpf: dataToSave.cpf || null,
                phone2: dataToSave.phone2 || null,
                gender: dataToSave.gender || null,
                address: dataToSave.address || null,
                academicInfo: dataToSave.academicInfo || null,
                professionalInfo: dataToSave.professionalInfo || null,
                socialLinks: dataToSave.socialLinks || null,
                portfolioUrl: dataToSave.portfolioUrl || null,
                aiSummary: dataToSave.aiSummary,
                aiExperienceSummary: dataToSave.aiExperienceSummary,
                aiAcademicSummary: dataToSave.aiAcademicSummary,
                aiSummaryFingerprint: dataToSave.aiSummaryFingerprint,
                profileFingerprint: dataToSave.profileFingerprint
            });
        }
    }
}
